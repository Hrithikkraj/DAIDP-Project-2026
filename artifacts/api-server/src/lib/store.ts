// In-memory data store — beginner-friendly, no database setup required.
// All data resets when the server restarts.

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  skinType: string | null;
  heritage: string | null;
  createdAt: string;
}

export interface ScanResult {
  id: string;
  userId: string;
  acneLevel: "Mild" | "Moderate" | "Severe";
  confidence: number;
  regions: string[];
  recommendations: string[];
  createdAt: string;
}

export interface RoutineStep {
  step: number;
  type: string;
  name: string;
  desc: string;
}

export interface Routine {
  userId: string;
  morning: RoutineStep[];
  night: RoutineStep[];
}

// In-memory collections
export const users: User[] = [];
export const scans: ScanResult[] = [];
export const routines: Routine[] = [];

// Helper — generate a short unique ID
export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
