import { Router } from "express";
import { db } from "@workspace/db";
import { routinesTable } from "@workspace/db";
import { verifyToken } from "./auth";

const router = Router();

router.post("/save", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  const { routine } = req.body;
  if (!routine) return res.status(400).json({ error: "Routine data required" });

  try {
    await db.insert(routinesTable).values({
      userId: payload.userId,
      routineData: routine,
    });
    return res.json({ success: true, message: "Routine saved successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Could not save routine" });
  }
});

export default router;
