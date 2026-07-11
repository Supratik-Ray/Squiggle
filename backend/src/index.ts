import "dotenv/config";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server, Socket } from "socket.io";
import { connectToDb } from "./lib/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";
import boardRoutes from "./routes/board.routes.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import { Board } from "./models/Board.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://squiggle-mauve.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "https://squiggle-mauve.vercel.app",
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

  socket.on("room:join", async ({ roomId }) => {
    //check if user can join the room
    //get room
    const requestedRoom = await Board.findOne({ roomId });
    //check if board exist
    if (!requestedRoom) {
      socket.emit("socket:error", {
        error: "board with this roomId doesn't exist!",
      });
      return;
    }
    //check if user is the owner or collaborator
    if (
      requestedRoom.ownerId != socket.data.userId &&
      !requestedRoom.collaborators.includes(socket.data.userId)
    ) {
      socket.emit("socket:error", {
        error: "you don't have permission to join board!",
      });
      return;
    }
    if (!rooms.has(roomId)) {
      //create room if it doesnt exist
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

    //get board snapshot
    const snapshot = requestedRoom.canvasData;

    socket.emit("room:joined", {
      roomId,
      participants: Array.from(room?.values() ?? []),
      snapshot,
    });
    socket.to(roomId).emit("user:joined", { user: userPayload });
  });

  socket.on("canvas:path:create", ({ roomId, path }) => {
    socket.to(roomId).emit("canvas:path:create", { path });
  });

  socket.on("canvas:object:add", ({ roomId, object }) => {
    socket.to(roomId).emit("canvas:object:add", { object });
  });

  socket.on("canvas:object:moving", ({ roomId, objectId, left, top }) => {
    socket.to(roomId).emit("canvas:object:moving", { objectId, left, top });
  });

  socket.on("canvas:clear", ({ roomId }) => {
    socket.to(roomId).emit("canvas:clear");
  });

  socket.on("canvas:object:modified", ({ roomId, ...properties }) => {
    socket.to(roomId).emit("canvas:object:modified", properties);
  });

  socket.on("canvas:text:update", ({ roomId, ...properties }) => {
    socket.to(roomId).emit("canvas:text:update", properties);
  });

  socket.on("canvas:object:remove", ({ roomId, objectId }) => {
    socket.to(roomId).emit("canvas:object:remove", { objectId });
  });

  function leaveRoom(socket: Socket) {
    if (!(socket.id in socketToRoomMapping)) return;

    const roomId = socketToRoomMapping[socket.id];

    if (roomId) {
      const room = rooms.get(roomId);

      room?.delete(socket.id);

      if (room?.size === 0) {
        rooms.delete(roomId);
      }

      const user = socket.data.user;

      socket.to(roomId).emit("user:left", {
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
          socketId: socket.id,
        },
      });
    }

    delete socketToRoomMapping[socket.id];
  }
  socket.on("user:left", () => leaveRoom(socket));
  socket.on("disconnect", () => leaveRoom(socket));
});

const port = process.env.PORT || 5000;

(async function () {
  await connectToDb();
  httpServer.listen(port, () =>
    console.log(`Server listening on port ${port}`),
  );
})();
