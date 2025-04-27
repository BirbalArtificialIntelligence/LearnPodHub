import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content model for moderation
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  language: text("language").notNull(),
  source: text("source").default("web").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Moderation results
export const moderationResults = pgTable("moderation_results", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contents.id).notNull(),
  status: text("status").notNull(), // approved, rejected, needs_review
  categories: jsonb("categories").default([]).notNull().$type<string[]>(),
  confidence: integer("confidence").default(0), // 0-100
  languageDetected: text("language_detected"),
  moderatedBy: text("moderated_by"), // system, user_id, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Documents for tech stack components
export const techComponents = pgTable("tech_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // frontend, backend, ml
  description: text("description").notNull(),
  status: text("status").notNull(), // operational, in testing, under development, etc.
  license: text("license").notNull(),
  repositoryUrl: text("repository_url"),
  documentationUrl: text("documentation_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

export const insertContentSchema = createInsertSchema(contents).pick({
  text: true,
  language: true,
  source: true,
  userId: true,
});

export const insertModerationResultSchema = createInsertSchema(moderationResults).pick({
  contentId: true,
  status: true,
  categories: true,
  confidence: true,
  languageDetected: true,
  moderatedBy: true,
  notes: true,
});

export const insertTechComponentSchema = createInsertSchema(techComponents).pick({
  name: true,
  category: true,
  description: true,
  status: true,
  license: true,
  repositoryUrl: true, 
  documentationUrl: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

export type InsertModerationResult = z.infer<typeof insertModerationResultSchema>;
export type ModerationResult = typeof moderationResults.$inferSelect;

export type InsertTechComponent = z.infer<typeof insertTechComponentSchema>;
export type TechComponent = typeof techComponents.$inferSelect;

// Exported union types for shared use
export type ModerationStatus = 'approved' | 'rejected' | 'needs_review';
export type TechComponentCategory = 'frontend' | 'backend' | 'ml';
export type ComponentStatus = 'operational' | 'in_testing' | 'under_development' | 'complete' | 'limited_use' | 'in_integration' | 'mvp_complete' | 'active';
