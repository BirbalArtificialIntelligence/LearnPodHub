import express from 'express';
import apiRoutes from './api';
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../storage";
import path from 'path';

// Add sample tech stack components to storage
async function seedInitialData() {
  // Check if we already have components
  const existingComponents = await storage.getTechComponents();
  if (existingComponents.length > 0) {
    return;
  }

  // Frontend components
  await storage.createTechComponent({
    name: "React.js",
    category: "frontend",
    description: "Main UI framework for building component-based interfaces",
    status: "under_development",
    license: "MIT",
    repositoryUrl: "https://github.com/facebook/react",
    documentationUrl: "https://react.dev"
  });
  
  await storage.createTechComponent({
    name: "Tailwind CSS",
    category: "frontend",
    description: "Utility-first CSS framework for responsive designs",
    status: "complete",
    license: "MIT",
    repositoryUrl: "https://github.com/tailwindlabs/tailwindcss",
    documentationUrl: "https://tailwindcss.com"
  });
  
  await storage.createTechComponent({
    name: "Next.js",
    category: "frontend",
    description: "React framework providing server-side rendering, routing, and more",
    status: "complete",
    license: "MIT",
    repositoryUrl: "https://github.com/vercel/next.js",
    documentationUrl: "https://nextjs.org"
  });
  
  await storage.createTechComponent({
    name: "I18next",
    category: "frontend",
    description: "Internationalization framework for multilingual support",
    status: "in_integration",
    license: "MIT",
    repositoryUrl: "https://github.com/i18next/i18next",
    documentationUrl: "https://www.i18next.com"
  });
  
  // Backend components
  await storage.createTechComponent({
    name: "Node.js",
    category: "backend",
    description: "JavaScript runtime for server-side applications",
    status: "complete",
    license: "MIT",
    repositoryUrl: "https://github.com/nodejs/node",
    documentationUrl: "https://nodejs.org"
  });
  
  await storage.createTechComponent({
    name: "Express.js",
    category: "backend",
    description: "Web framework for building APIs and web applications",
    status: "complete",
    license: "MIT",
    repositoryUrl: "https://github.com/expressjs/express",
    documentationUrl: "https://expressjs.com"
  });
  
  await storage.createTechComponent({
    name: "PostgreSQL",
    category: "backend",
    description: "Open source relational database management system",
    status: "operational",
    license: "PostgreSQL",
    repositoryUrl: "https://github.com/postgres/postgres",
    documentationUrl: "https://www.postgresql.org"
  });
  
  await storage.createTechComponent({
    name: "MongoDB",
    category: "backend",
    description: "NoSQL database for document-based storage",
    status: "operational",
    license: "SSPL",
    repositoryUrl: "https://github.com/mongodb/mongo",
    documentationUrl: "https://www.mongodb.com"
  });
  
  // ML components
  await storage.createTechComponent({
    name: "Hugging Face Transformers",
    category: "ml",
    description: "State-of-the-art Natural Language Processing library",
    status: "active",
    license: "Apache 2.0",
    repositoryUrl: "https://github.com/huggingface/transformers",
    documentationUrl: "https://huggingface.co/docs/transformers/index"
  });
  
  await storage.createTechComponent({
    name: "MLflow",
    category: "ml",
    description: "Platform for the machine learning lifecycle",
    status: "operational",
    license: "Apache 2.0",
    repositoryUrl: "https://github.com/mlflow/mlflow",
    documentationUrl: "https://mlflow.org"
  });
  
  await storage.createTechComponent({
    name: "Label Studio",
    category: "ml",
    description: "Open source data labeling tool",
    status: "active",
    license: "Apache 2.0",
    repositoryUrl: "https://github.com/heartexlabs/label-studio",
    documentationUrl: "https://labelstud.io"
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed initial data
  await seedInitialData();
  
  // API routes
  app.use('/api', apiRoutes);
  
  // Static routes for documentation
  app.use('/docs', express.static(path.join(import.meta.dirname, '../../docs')));
  app.use('/setup', express.static(path.join(import.meta.dirname, '../../setup')));
  
  // Create server
  const httpServer = createServer(app);
  
  return httpServer;
}
