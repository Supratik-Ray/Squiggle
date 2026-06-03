import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { type Request, type Response, type NextFunction } from "express";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) return res.status(401).json({ error: "Unauthorized" });

  req.user = session.user;

  next();
}
