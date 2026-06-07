import type { Request, Response } from "express";
import { Board } from "../models/Board.js";

export async function getAllBoards(req: Request, res: Response) {
  const user = req.user;

  const boards = await Board.find({
    $or: [{ ownerId: user.id }, { collaborators: user.id }],
  });
  res.status(200).json({
    success: true,
    data: boards,
  });
}

export async function saveBoard(req: Request, res: Response) {
  const { roomId } = req.params;
  const { canvasData } = req.body;
  await Board.findOneAndUpdate({ roomId: roomId as string }, { canvasData });
  res.status(201).json({ success: true });
}

export async function getBoard(req: Request, res: Response) {
  const { roomId } = req.params;
  if (!roomId)
    return res
      .status(400)
      .json({ success: false, error: "Please provide valid roomId" });

  const board = await Board.findOne({ roomId });
  res.status(200).json({ success: true, data: board });
}

export async function createBoard(req: Request, res: Response) {
  const { name, roomId } = req.body;

  const user = req.user;

  const newBoard = await Board.create({
    name,
    roomId,
    ownerId: user.id,
  });

  res.status(201).json({ success: true, data: newBoard });
}

export async function joinBoard(req: Request, res: Response) {
  const { roomId } = req.params;
  const userId = req.user.id;
  console.log(roomId, userId);
  const updatedBoard = await Board.findOneAndUpdate(
    { roomId: roomId as string },
    {
      $addToSet: {
        collaborators: userId,
      },
    },
    { new: true },
  );

  if (!updatedBoard) {
    return res.status(404).json({
      message: "Board not found",
    });
  }

  res.status(200).json({ success: true, data: updatedBoard });
}

export async function deleteBoard(req: Request, res: Response) {
  const { roomId } = req.params;
  const deletedBoard = await Board.findOneAndDelete({
    roomId: roomId as string,
  });

  res.status(200).json({ success: true, data: deletedBoard });
}
