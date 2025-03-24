import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertSkillSchema, insertResourceSchema, insertSkillRelationshipSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all skills (tree structure)
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Error fetching skills" });
    }
  });

  // Get a specific skill by ID
  app.get("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const skill = await storage.getSkill(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      console.error("Error fetching skill:", error);
      res.status(500).json({ message: "Error fetching skill" });
    }
  });

  // Create a new skill
  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid skill data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating skill" });
    }
  });

  // Update a skill
  app.patch("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const updated = await storage.updateSkill(id, validatedData);
      
      if (!updated) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating skill:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid skill data", errors: error.format() });
      }
      res.status(500).json({ message: "Error updating skill" });
    }
  });

  // Delete a skill
  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const deleted = await storage.deleteSkill(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Error deleting skill" });
    }
  });

  // Get skills for graph visualization
  app.get("/api/skills/graph", async (req, res) => {
    try {
      const graphData = await storage.getSkillsGraph();
      res.json(graphData);
    } catch (error) {
      console.error("Error fetching skills graph:", error);
      res.status(500).json({ message: "Error fetching skills graph" });
    }
  });

  // Add a relationship between skills
  app.post("/api/skills/relationships", async (req, res) => {
    try {
      const validatedData = insertSkillRelationshipSchema.parse(req.body);
      const relationship = await storage.createSkillRelationship(validatedData);
      res.status(201).json(relationship);
    } catch (error) {
      console.error("Error creating skill relationship:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid relationship data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating skill relationship" });
    }
  });

  // Search skills
  app.get("/api/skills/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchSkills(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching skills:", error);
      res.status(500).json({ message: "Error searching skills" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
