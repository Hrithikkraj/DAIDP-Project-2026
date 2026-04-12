import { pgTable, serial, integer, text, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scanResultsTable = pgTable("scan_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  acneLevel: text("acne_level").notNull(),
  confidence: real("confidence").notNull(),
  regions: jsonb("regions").$type<string[]>().notNull(),
  skinType: text("skin_type"),
  imagePreview: text("image_preview"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanResultSchema = createInsertSchema(scanResultsTable).omit({ id: true, createdAt: true });
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;
export type ScanResult = typeof scanResultsTable.$inferSelect;
