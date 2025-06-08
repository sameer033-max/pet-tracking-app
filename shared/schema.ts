import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "dog", "cat", etc.
  breed: text("breed").notNull(),
  age: integer("age").notNull(),
  photoUrl: text("photo_url"),
  userId: integer("user_id").notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  time: text("time"), // "7:00 AM"
  completed: boolean("completed").default(false),
  date: text("date").notNull(), // YYYY-MM-DD format
  isRecurring: boolean("is_recurring").default(true),
});

export const vaccines = pgTable("vaccines", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull(),
  name: text("name").notNull(),
  dueDate: text("due_date").notNull(), // YYYY-MM-DD format
  completed: boolean("completed").default(false),
  notes: text("notes"),
  veterinarian: text("veterinarian"),
});

export const diaryEntries = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull(),
  content: text("content").notNull(),
  mood: text("mood"), // "happy", "content", "tired", etc.
  energy: text("energy"), // "high", "medium", "low"
  activity: text("activity"), // "playing", "resting", "eating", etc.
  photoUrl: text("photo_url"),
  date: text("date").notNull(), // YYYY-MM-DD format
  time: text("time").notNull(), // HH:MM format
});

// Insert schemas
export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  userId: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const insertVaccineSchema = createInsertSchema(vaccines).omit({
  id: true,
});

export const insertDiaryEntrySchema = createInsertSchema(diaryEntries).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Pet = typeof pets.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertVaccine = z.infer<typeof insertVaccineSchema>;
export type Vaccine = typeof vaccines.$inferSelect;

export type InsertDiaryEntry = z.infer<typeof insertDiaryEntrySchema>;
export type DiaryEntry = typeof diaryEntries.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
