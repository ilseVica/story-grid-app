import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChapterSchema, insertCharacterSchema, insertCardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chapters
  app.get("/api/chapters", async (req, res) => {
    try {
      const chapters = await storage.getChapters();
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  app.post("/api/chapters", async (req, res) => {
    try {
      const validatedData = insertChapterSchema.parse(req.body);
      const chapter = await storage.createChapter(validatedData);
      res.status(201).json(chapter);
    } catch (error) {
      res.status(400).json({ message: "Invalid chapter data" });
    }
  });

  app.put("/api/chapters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertChapterSchema.partial().parse(req.body);
      const chapter = await storage.updateChapter(id, validatedData);
      res.json(chapter);
    } catch (error) {
      res.status(400).json({ message: "Failed to update chapter" });
    }
  });

  app.delete("/api/chapters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteChapter(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to delete chapter" });
    }
  });

  // Characters
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      res.status(400).json({ message: "Invalid character data" });
    }
  });

  app.put("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCharacterSchema.partial().parse(req.body);
      const character = await storage.updateCharacter(id, validatedData);
      res.json(character);
    } catch (error) {
      res.status(400).json({ message: "Failed to update character" });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCharacter(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to delete character" });
    }
  });

  // Cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.get("/api/cards/:characterId/:chapterId", async (req, res) => {
    try {
      const { characterId, chapterId } = req.params;
      const card = await storage.getCard(characterId, chapterId);
      if (card) {
        res.json(card);
      } else {
        res.status(404).json({ message: "Card not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch card" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(validatedData);
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ message: "Invalid card data" });
    }
  });

  app.put("/api/cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCardSchema.partial().parse(req.body);
      const card = await storage.updateCard(id, validatedData);
      res.json(card);
    } catch (error) {
      res.status(400).json({ message: "Failed to update card" });
    }
  });

  app.patch("/api/cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCardSchema.partial().parse(req.body);
      const card = await storage.updateCard(id, validatedData);
      res.json(card);
    } catch (error) {
      res.status(400).json({ message: "Failed to move card" });
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCard(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to delete card" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
