import { Router } from "express";
import { db } from "@workspace/db";
import { scanResultsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { verifyToken } from "./auth";

const router = Router();

function requireAuth(req: any, res: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
  return payload.userId;
}

function mockAnalysis() {
  const levels = ["Mild", "Moderate", "Severe"] as const;
  const allRegions = ["Left Cheek", "Jawline", "Forehead", "Right Cheek", "Nose Bridge", "Chin"];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const confidence = Math.floor(Math.random() * 18) + 80;
  const count = level === "Mild" ? 1 : level === "Moderate" ? 2 : 3;
  const regions = [...allRegions].sort(() => Math.random() - 0.5).slice(0, count);
  const skinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
  const skinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
  return { acneLevel: level, confidence, regions, skinType };
}

router.post("/analyze", async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  const { imageBase64 } = req.body;
  const analysis = mockAnalysis();
  try {
    const [result] = await db.insert(scanResultsTable).values({
      userId,
      acneLevel: analysis.acneLevel,
      confidence: analysis.confidence,
      regions: analysis.regions,
      skinType: analysis.skinType,
      imagePreview: imageBase64 ? imageBase64.slice(0, 1000) : null,
    }).returning();
    return res.json({ ...analysis, scanId: result.id, scannedAt: result.createdAt });
  } catch (err) {
    return res.status(500).json({ error: "Analysis failed" });
  }
});

router.get("/history", async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  try {
    const history = await db
      .select()
      .from(scanResultsTable)
      .where(eq(scanResultsTable.userId, userId))
      .orderBy(desc(scanResultsTable.createdAt))
      .limit(20);
    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch history" });
  }
});

export default router;
