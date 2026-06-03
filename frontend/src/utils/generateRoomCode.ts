import { customAlphabet } from "nanoid";

export const generateRoomCode = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6,
);
