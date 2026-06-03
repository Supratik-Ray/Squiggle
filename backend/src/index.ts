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

io.on("connection", (socket) => {
  console.log(`socketID: ${socket.id} connected`);
});

const port = process.env.PORT || 5000;

(async function () {
  await connectToDb();
  httpServer.listen(port, () =>
    console.log(`Server listening on port ${port}`),
  );
})();
