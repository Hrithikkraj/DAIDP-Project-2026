import { pgTable, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const routinesTable = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  routineData: jsonb("routine_data").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const insertRoutineSchema = createInsertSchema(routinesTable).omit({ id: true, savedAt: true });
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;
export type Routine = typeof routinesTable.$inferSelect;
