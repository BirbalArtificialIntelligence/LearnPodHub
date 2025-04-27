import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { 
  insertContentSchema, 
  insertModerationResultSchema, 
  insertTechComponentSchema 
} from '@shared/schema';

const router = express.Router();

// Tech Components API
router.get('/components', async (req, res) => {
  try {
    const { category } = req.query;
    const components = await storage.getTechComponents(category as string | undefined);
    res.json({ data: components });
  } catch (error) {
    console.error('Error fetching tech components:', error);
    res.status(500).json({ error: 'Failed to fetch tech components' });
  }
});

router.get('/components/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const component = await storage.getTechComponent(id);
    
    if (!component) {
      return res.status(404).json({ error: 'Tech component not found' });
    }
    
    res.json({ data: component });
  } catch (error) {
    console.error('Error fetching tech component:', error);
    res.status(500).json({ error: 'Failed to fetch tech component' });
  }
});

router.post('/components', async (req, res) => {
  try {
    const validatedData = insertTechComponentSchema.parse(req.body);
    const component = await storage.createTechComponent(validatedData);
    res.status(201).json({ data: component });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating tech component:', error);
    res.status(500).json({ error: 'Failed to create tech component' });
  }
});

router.patch('/components/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertTechComponentSchema.partial().parse(req.body);
    
    const component = await storage.updateTechComponent(id, validatedData);
    
    if (!component) {
      return res.status(404).json({ error: 'Tech component not found' });
    }
    
    res.json({ data: component });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating tech component:', error);
    res.status(500).json({ error: 'Failed to update tech component' });
  }
});

// Content API
router.get('/contents', async (req, res) => {
  try {
    const { language, userId } = req.query;
    const filters: any = {};
    
    if (language) filters.language = language as string;
    if (userId) filters.userId = parseInt(userId as string);
    
    const contents = await storage.getContents(filters);
    
    // Fetch moderation results for each content
    const contentsWithModeration = await Promise.all(
      contents.map(async (content) => {
        const moderation = await storage.getModerationResult(content.id);
        return {
          ...content,
          moderation: moderation || null
        };
      })
    );
    
    res.json({ data: contentsWithModeration });
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
});

router.get('/contents/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const content = await storage.getContent(id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const moderation = await storage.getModerationResult(id);
    
    res.json({ 
      data: {
        ...content,
        moderation: moderation || null
      }
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.post('/contents', async (req, res) => {
  try {
    const validatedData = insertContentSchema.parse(req.body);
    const content = await storage.createContent(validatedData);
    
    // Mock ML queue publication (in a real app, this would use a message queue)
    console.log(`Content ${content.id} queued for moderation`);
    
    res.status(201).json({ 
      data: content,
      message: 'Content created and queued for moderation'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

router.patch('/contents/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertContentSchema.partial().parse(req.body);
    
    const content = await storage.updateContent(id, validatedData);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json({ data: content });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

router.delete('/contents/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const content = await storage.getContent(id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    await storage.deleteContent(id);
    
    res.json({ 
      data: content,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Moderation API
router.post('/contents/:id/moderation', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const content = await storage.getContent(contentId);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const validatedData = insertModerationResultSchema.partial().parse({
      ...req.body,
      contentId,
    });
    
    // Check if moderation already exists
    const existingModeration = await storage.getModerationResult(contentId);
    
    let moderation;
    if (existingModeration) {
      moderation = await storage.updateModerationResult(contentId, validatedData);
    } else {
      moderation = await storage.createModerationResult(validatedData as any);
    }
    
    res.status(201).json({ 
      data: moderation,
      message: 'Moderation result saved successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating/updating moderation result:', error);
    res.status(500).json({ error: 'Failed to save moderation result' });
  }
});

export default router;
