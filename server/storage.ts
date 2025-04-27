import { users, type User, type InsertUser, 
         contents, type Content, type InsertContent, 
         moderationResults, type ModerationResult, type InsertModerationResult,
         techComponents, type TechComponent, type InsertTechComponent } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContents(filters?: { language?: string, userId?: number }): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Moderation operations
  getModerationResult(contentId: number): Promise<ModerationResult | undefined>;
  createModerationResult(result: InsertModerationResult): Promise<ModerationResult>;
  updateModerationResult(contentId: number, result: Partial<InsertModerationResult>): Promise<ModerationResult | undefined>;
  
  // Tech component operations
  getTechComponents(category?: string): Promise<TechComponent[]>;
  getTechComponent(id: number): Promise<TechComponent | undefined>;
  createTechComponent(component: InsertTechComponent): Promise<TechComponent>;
  updateTechComponent(id: number, component: Partial<InsertTechComponent>): Promise<TechComponent | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private moderationResults: Map<number, ModerationResult>;
  private techComponents: Map<number, TechComponent>;
  
  private userId: number;
  private contentId: number;
  private moderationId: number;
  private componentId: number;

  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.moderationResults = new Map();
    this.techComponents = new Map();
    
    this.userId = 1;
    this.contentId = 1;
    this.moderationId = 1;
    this.componentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async getContents(filters?: { language?: string, userId?: number }): Promise<Content[]> {
    let contents = Array.from(this.contents.values());
    
    if (filters?.language) {
      contents = contents.filter(c => c.language === filters.language);
    }
    
    if (filters?.userId) {
      contents = contents.filter(c => c.userId === filters.userId);
    }
    
    return contents;
  }
  
  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentId++;
    const now = new Date();
    const content: Content = {
      ...insertContent,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.contents.set(id, content);
    return content;
  }
  
  async updateContent(id: number, updateContent: Partial<InsertContent>): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    const updated: Content = {
      ...content,
      ...updateContent,
      updatedAt: new Date()
    };
    
    this.contents.set(id, updated);
    return updated;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    // Delete related moderation results first
    const moderationResults = Array.from(this.moderationResults.values())
      .filter(mr => mr.contentId === id);
    
    for (const mr of moderationResults) {
      this.moderationResults.delete(mr.id);
    }
    
    return this.contents.delete(id);
  }
  
  // Moderation operations
  async getModerationResult(contentId: number): Promise<ModerationResult | undefined> {
    return Array.from(this.moderationResults.values()).find(
      mr => mr.contentId === contentId
    );
  }
  
  async createModerationResult(insertResult: InsertModerationResult): Promise<ModerationResult> {
    const id = this.moderationId++;
    const now = new Date();
    const result: ModerationResult = {
      ...insertResult,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.moderationResults.set(id, result);
    return result;
  }
  
  async updateModerationResult(contentId: number, updateResult: Partial<InsertModerationResult>): Promise<ModerationResult | undefined> {
    const result = Array.from(this.moderationResults.values()).find(
      mr => mr.contentId === contentId
    );
    
    if (!result) return undefined;
    
    const updated: ModerationResult = {
      ...result,
      ...updateResult,
      updatedAt: new Date()
    };
    
    this.moderationResults.set(result.id, updated);
    return updated;
  }
  
  // Tech component operations
  async getTechComponents(category?: string): Promise<TechComponent[]> {
    let components = Array.from(this.techComponents.values());
    
    if (category) {
      components = components.filter(c => c.category === category);
    }
    
    return components;
  }
  
  async getTechComponent(id: number): Promise<TechComponent | undefined> {
    return this.techComponents.get(id);
  }
  
  async createTechComponent(insertComponent: InsertTechComponent): Promise<TechComponent> {
    const id = this.componentId++;
    const now = new Date();
    const component: TechComponent = {
      ...insertComponent,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.techComponents.set(id, component);
    return component;
  }
  
  async updateTechComponent(id: number, updateComponent: Partial<InsertTechComponent>): Promise<TechComponent | undefined> {
    const component = this.techComponents.get(id);
    if (!component) return undefined;
    
    const updated: TechComponent = {
      ...component,
      ...updateComponent,
      updatedAt: new Date()
    };
    
    this.techComponents.set(id, updated);
    return updated;
  }
}

// Export storage instance
export const storage = new MemStorage();
