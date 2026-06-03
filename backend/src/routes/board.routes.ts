import express, { Router } from "express";

const router: Router = express.Router();

router.route("/").get().post();

export default router;
