import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";

// Extend Express Request to carry the authenticated user ID
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

// Middleware — reads the Authorization header and validates the JWT.
// Responds 401 if the token is missing or invalid.
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    res.status(401).json({ error: "Unauthorized", message: "Missing token" });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token" });
  }
}
