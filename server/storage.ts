import { 
  users, pets, tasks, vaccines, diaryEntries,
  type User, type InsertUser,
  type Pet, type InsertPet,
  type Task, type InsertTask,
  type Vaccine, type InsertVaccine,
  type DiaryEntry, type InsertDiaryEntry
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pet methods
  getPets(userId: number): Promise<Pet[]>;
  getPet(id: number): Promise<Pet | undefined>;
  createPet(pet: InsertPet & { userId: number }): Promise<Pet>;
  updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet | undefined>;
  deletePet(id: number): Promise<boolean>;

  // Task methods
  getTasks(petId: number, date: string): Promise<Task[]>;
  getAllTasksForDate(userId: number, date: string): Promise<(Task & { petName: string })[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Vaccine methods
  getVaccines(petId: number): Promise<Vaccine[]>;
  getAllVaccines(userId: number): Promise<(Vaccine & { petName: string })[]>;
  createVaccine(vaccine: InsertVaccine): Promise<Vaccine>;
  updateVaccine(id: number, vaccine: Partial<InsertVaccine>): Promise<Vaccine | undefined>;
  deleteVaccine(id: number): Promise<boolean>;

  // Diary methods
  getDiaryEntries(petId: number): Promise<DiaryEntry[]>;
  getAllDiaryEntries(userId: number): Promise<(DiaryEntry & { petName: string })[]>;
  createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry>;
  updateDiaryEntry(id: number, entry: Partial<InsertDiaryEntry>): Promise<DiaryEntry | undefined>;
  deleteDiaryEntry(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pets: Map<number, Pet>;
  private tasks: Map<number, Task>;
  private vaccines: Map<number, Vaccine>;
  private diaryEntries: Map<number, DiaryEntry>;
  private currentUserId: number;
  private currentPetId: number;
  private currentTaskId: number;
  private currentVaccineId: number;
  private currentDiaryId: number;

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.tasks = new Map();
    this.vaccines = new Map();
    this.diaryEntries = new Map();
    this.currentUserId = 1;
    this.currentPetId = 1;
    this.currentTaskId = 1;
    this.currentVaccineId = 1;
    this.currentDiaryId = 1;

    // Initialize with a default user for demo purposes
    this.users.set(1, { id: 1, username: "demo", password: "demo" });
    this.currentUserId = 2;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pet methods
  async getPets(userId: number): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(pet => pet.userId === userId);
  }

  async getPet(id: number): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async createPet(petData: InsertPet & { userId: number }): Promise<Pet> {
    const id = this.currentPetId++;
    const pet: Pet = { ...petData, id };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: number, petData: Partial<InsertPet>): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    if (!pet) return undefined;
    
    const updatedPet = { ...pet, ...petData };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  async deletePet(id: number): Promise<boolean> {
    return this.pets.delete(id);
  }

  // Task methods
  async getTasks(petId: number, date: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.petId === petId && task.date === date
    );
  }

  async getAllTasksForDate(userId: number, date: string): Promise<(Task & { petName: string })[]> {
    const userPets = await this.getPets(userId);
    const petIds = userPets.map(pet => pet.id);
    
    return Array.from(this.tasks.values())
      .filter(task => petIds.includes(task.petId) && task.date === date)
      .map(task => {
        const pet = userPets.find(p => p.id === task.petId);
        return { ...task, petName: pet?.name || 'Unknown Pet' };
      });
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { ...taskData, id };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Vaccine methods
  async getVaccines(petId: number): Promise<Vaccine[]> {
    return Array.from(this.vaccines.values()).filter(
      vaccine => vaccine.petId === petId
    );
  }

  async getAllVaccines(userId: number): Promise<(Vaccine & { petName: string })[]> {
    const userPets = await this.getPets(userId);
    const petIds = userPets.map(pet => pet.id);
    
    return Array.from(this.vaccines.values())
      .filter(vaccine => petIds.includes(vaccine.petId))
      .map(vaccine => {
        const pet = userPets.find(p => p.id === vaccine.petId);
        return { ...vaccine, petName: pet?.name || 'Unknown Pet' };
      });
  }

  async createVaccine(vaccineData: InsertVaccine): Promise<Vaccine> {
    const id = this.currentVaccineId++;
    const vaccine: Vaccine = { ...vaccineData, id };
    this.vaccines.set(id, vaccine);
    return vaccine;
  }

  async updateVaccine(id: number, vaccineData: Partial<InsertVaccine>): Promise<Vaccine | undefined> {
    const vaccine = this.vaccines.get(id);
    if (!vaccine) return undefined;
    
    const updatedVaccine = { ...vaccine, ...vaccineData };
    this.vaccines.set(id, updatedVaccine);
    return updatedVaccine;
  }

  async deleteVaccine(id: number): Promise<boolean> {
    return this.vaccines.delete(id);
  }

  // Diary methods
  async getDiaryEntries(petId: number): Promise<DiaryEntry[]> {
    return Array.from(this.diaryEntries.values())
      .filter(entry => entry.petId === petId)
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
  }

  async getAllDiaryEntries(userId: number): Promise<(DiaryEntry & { petName: string })[]> {
    const userPets = await this.getPets(userId);
    const petIds = userPets.map(pet => pet.id);
    
    return Array.from(this.diaryEntries.values())
      .filter(entry => petIds.includes(entry.petId))
      .map(entry => {
        const pet = userPets.find(p => p.id === entry.petId);
        return { ...entry, petName: pet?.name || 'Unknown Pet' };
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
  }

  async createDiaryEntry(entryData: InsertDiaryEntry): Promise<DiaryEntry> {
    const id = this.currentDiaryId++;
    const entry: DiaryEntry = { ...entryData, id };
    this.diaryEntries.set(id, entry);
    return entry;
  }

  async updateDiaryEntry(id: number, entryData: Partial<InsertDiaryEntry>): Promise<DiaryEntry | undefined> {
    const entry = this.diaryEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...entryData };
    this.diaryEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteDiaryEntry(id: number): Promise<boolean> {
    return this.diaryEntries.delete(id);
  }
}

export const storage = new MemStorage();
