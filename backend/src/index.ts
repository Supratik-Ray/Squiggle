import "dotenv/config";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";
import { connectToDb } from "./lib/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";
import boardRoutes from "./routes/board.routes.js";
import { requireAuth } from "./middlewares/auth.middleware.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/{*path}", toNodeHandler(auth));

app.use("/api/boards", requireAuth, boardRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    mssg: "Hello world",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    ok: true,
  });
});

interface Participant {
  id: string;
  name: string;
  image: string | null;
  socketId: string;
}

const socketToRoomMapping: Record<string, string> = {};

//we are storing Participants in a map with socket id key instead of an array as deletion and searching is O(1) in map compared to array
const rooms = new Map<string, Map<string, Participant>>();

io.use(async (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookie ?? "",
      }),
    });

    if (!session) {
      return next(new Error("unauthorized"));
    }

    socket.data.userId = session.user.id;
    socket.data.user = session.user;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(`socketID: ${socket.id} connected`);

  socket.on("room:join", ({ roomId }) => {
    //check if user can join the room

    //create room if it doesnt exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    //check if user with that socketid exists in the room
    if (room?.has(socket.id)) {
      return;
    }

    const user = socket.data.user;
    const userPayload = {
      id: user.id,
      name: user.name,
      image: user.image,
      socketId: socket.id,
    };

    //add user to the room
    room?.set(socket.id, userPayload);
    socket.join(roomId);
    socketToRoomMapping[socket.id] = roomId;
    socket.emit("room:joined", {
      roomId,
      participants: Array.from(room?.values() ?? []),
    });
    socket.to(roomId).emit("user:joined", { user: userPayload });
  });

  socket.on("disconnect", () => {
    if (socket.id in socketToRoomMapping) {
      //remove user from room
      const roomId = socketToRoomMapping[socket.id];
      if (roomId) {
        const room = rooms.get(roomId);
        room?.delete(socket.id);

        //delete the room if no user in the room
        if (room?.size === 0) {
          rooms.delete(roomId);
        }
      }
      //remove user from socket-to-room mapping
      delete socketToRoomMapping[socket.id];
      const user = socket.data.user;
      const userPayload = {
        id: user.id,
        name: user.name,
        image: user.image,
        socketId: socket.id,
      };
      socket.to(roomId!).emit("user:left", { user: userPayload });
    }
  });
});

const port = process.env.PORT || 5000;

(async function () {
  await connectToDb();
  httpServer.listen(port, () =>
    console.log(`Server listening on port ${port}`),
  );
})();
