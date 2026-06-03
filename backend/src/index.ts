import "dotenv/config";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(express);
const io = new Server(httpServer);

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

httpServer.listen(port, () => console.log(`Server listening on port ${port}`));
