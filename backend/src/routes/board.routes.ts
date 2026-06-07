import express, { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoard,
  joinBoard,
  saveBoard,
} from "../controllers/board.controllers.js";

const router: Router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/:roomId").get(getBoard).delete(deleteBoard);
router.route("/:roomId/join").post(joinBoard);
router.route("/:roomId/snapshot").post(saveBoard);

export default router;
