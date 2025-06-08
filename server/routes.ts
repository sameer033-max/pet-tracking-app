import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPetSchema, insertTaskSchema, insertVaccineSchema, insertDiaryEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const currentUserId = 1; // For demo purposes, using a fixed user ID

  // Pet routes
  app.get("/api/pets", async (req, res) => {
    try {
      const pets = await storage.getPets(currentUserId);
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });

  app.post("/api/pets", async (req, res) => {
    try {
      const petData = insertPetSchema.parse(req.body);
      const pet = await storage.createPet({ ...petData, userId: currentUserId });
      res.json(pet);
    } catch (error) {
      res.status(400).json({ message: "Invalid pet data" });
    }
  });

  app.put("/api/pets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const petData = insertPetSchema.partial().parse(req.body);
      const pet = await storage.updatePet(id, petData);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.json(pet);
    } catch (error) {
      res.status(400).json({ message: "Invalid pet data" });
    }
  });

  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePet(id);
      if (!deleted) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pet" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const tasks = await storage.getAllTasksForDate(currentUserId, date);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/pets/:petId/tasks", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const tasks = await storage.getTasks(petId, date);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Vaccine routes
  app.get("/api/vaccines", async (req, res) => {
    try {
      const vaccines = await storage.getAllVaccines(currentUserId);
      res.json(vaccines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccines" });
    }
  });

  app.get("/api/pets/:petId/vaccines", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const vaccines = await storage.getVaccines(petId);
      res.json(vaccines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccines" });
    }
  });

  app.post("/api/vaccines", async (req, res) => {
    try {
      const vaccineData = insertVaccineSchema.parse(req.body);
      const vaccine = await storage.createVaccine(vaccineData);
      res.json(vaccine);
    } catch (error) {
      res.status(400).json({ message: "Invalid vaccine data" });
    }
  });

  app.put("/api/vaccines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vaccineData = insertVaccineSchema.partial().parse(req.body);
      const vaccine = await storage.updateVaccine(id, vaccineData);
      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found" });
      }
      res.json(vaccine);
    } catch (error) {
      res.status(400).json({ message: "Invalid vaccine data" });
    }
  });

  app.delete("/api/vaccines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVaccine(id);
      if (!deleted) {
        return res.status(404).json({ message: "Vaccine not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vaccine" });
    }
  });

  // Diary routes
  app.get("/api/diary", async (req, res) => {
    try {
      const entries = await storage.getAllDiaryEntries(currentUserId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diary entries" });
    }
  });

  app.get("/api/pets/:petId/diary", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const entries = await storage.getDiaryEntries(petId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diary entries" });
    }
  });

  app.post("/api/diary", async (req, res) => {
    try {
      const entryData = insertDiaryEntrySchema.parse(req.body);
      const entry = await storage.createDiaryEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid diary entry data" });
    }
  });

  app.put("/api/diary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entryData = insertDiaryEntrySchema.partial().parse(req.body);
      const entry = await storage.updateDiaryEntry(id, entryData);
      if (!entry) {
        return res.status(404).json({ message: "Diary entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid diary entry data" });
    }
  });

  app.delete("/api/diary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDiaryEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Diary entry not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete diary entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
