
import { z } from "zod";

// Skill categories
export const categories = [
  "core",
  "frontend",
  "backend",
  "data",
  "infra",
  "security",
  "practices"
] as const;

// Type definitions without DB specifics
export type Skill = {
  id: number;
  name: string;
  description?: string;
  category: string;
  level?: string;
  parentId?: number | null;
  isLeaf?: boolean;
  experience?: string[];
  relatedSkills?: string[];
  resources?: Array<{ title: string; url: string; type?: string }>;
};

export type Resource = {
  id: number;
  skillId: number;
  title: string;
  url: string;
  type?: string;
};

export type SkillRelationship = {
  id: number;
  sourceId: number;
  targetId: number;
  type: string;
};

export type SkillNode = {
  id: number;
  name: string;
  category: string;
  children?: SkillNode[];
};

// Zod schemas for validation
export const insertSkillSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  level: z.string().optional().default("Beginner"),
  parentId: z.number().optional().nullable(),
  isLeaf: z.boolean().optional().default(false),
  experience: z.array(z.string()).optional(),
  relatedSkills: z.array(z.string()).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.string().optional()
  })).optional()
});

export const insertResourceSchema = z.object({
  skillId: z.number(),
  title: z.string(),
  url: z.string(),
  type: z.string().optional()
});

export const insertSkillRelationshipSchema = z.object({
  sourceId: z.number(),
  targetId: z.number(),
  type: z.string().default("related")
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type InsertSkillRelationship = z.infer<typeof insertSkillRelationshipSchema>;
