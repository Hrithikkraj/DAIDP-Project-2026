import { Router } from "express";
import { createHash, createHmac } from "crypto";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function hashPassword(password: string): string {
  return createHash("sha256").update(password + (process.env.SESSION_SECRET || "dermaai-secret")).digest("hex");
}

export function makeToken(userId: number, email: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, email })).toString("base64url");
  const sig = createHmac("sha256", process.env.SESSION_SECRET || "dermaai-secret").update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  const expected = createHmac("sha256", process.env.SESSION_SECRET || "dermaai-secret").update(payload).digest("hex");
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

router.post("/signup", async (req, res) => {
  const { name, email, password, skinType, region } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash: hashPassword(password),
      skinType: skinType || null,
      region: region || null,
    }).returning();
    const token = makeToken(user.id, user.email);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, region: user.region },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = makeToken(user.id, user.email);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, region: user.region },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error during login" });
  }
});

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return res.status(401).json({ error: "Invalid token" });
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId));
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, region: user.region } });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
