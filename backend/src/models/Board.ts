import mongoose, { Schema, Types } from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trime: true,
      minLength: 2,
      maxLength: 100,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    collaborators: [
      {
        type: String,
      },
    ],
    canvasData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export const Board = mongoose.model("Board", boardSchema);
