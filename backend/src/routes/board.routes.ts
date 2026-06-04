import express, { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoard,
  updateBoard,
} from "../controllers/board.controllers.js";

const router: Router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/:roomId").get(getBoard).patch(updateBoard).delete(deleteBoard);

export default router;
