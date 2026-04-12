import { Router } from "express";
import bcrypt from "bcryptjs";
import { users, generateId } from "../lib/store.js";
import { signToken } from "../lib/jwt.js";

const router = Router();

// POST /api/auth/signup — create a new account
router.post("/auth/signup", async (req, res) => {
  const { name, email, password, skinType, heritage } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    skinType?: string;
    heritage?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "BadRequest", message: "name, email, and password are required" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "BadRequest", message: "Password must be at least 6 characters" });
    return;
  }

  // Check if email is already taken
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: "BadRequest", message: "An account with this email already exists" });
    return;
  }

  // Hash the password before storing
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    skinType: skinType ?? null,
    heritage: heritage ?? null,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const token = signToken({ userId: user.id, email: user.email });

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, heritage: user.heritage },
  });
});

// POST /api/auth/login — authenticate and receive a token
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "BadRequest", message: "email and password are required" });
    return;
  }

  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, skinType: user.skinType, heritage: user.heritage },
  });
});

export default router;
