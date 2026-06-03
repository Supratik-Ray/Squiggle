import express, { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  updateBoard,
} from "../controllers/board.controllers.js";

const router: Router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/:roomId").patch(updateBoard).delete(deleteBoard);

export default router;
