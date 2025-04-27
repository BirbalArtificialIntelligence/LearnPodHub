import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { contents, moderationResults } from '../schema';
import { publishToModerationQueue } from '../services/queue';

const router = express.Router();

/**
 * Content validation schema
 */
const contentSchema = z.object({
  text: z.string().min(1).max(10000),
  language: z.string().min(2).max(5),
  source: z.string().optional(),
});

/**
 * GET /api/contents
 * Retrieve all contents with optional filters
 */
router.get('/contents', async (req, res) => {
  try {
    const { language, status } = req.query;
    
    let query = db.select().from(contents);
    
    if (language) {
      query = query.where(eq(contents.language, language as string));
    }
    
    if (status) {
      query = query.innerJoin(
        moderationResults, 
        eq(contents.id, moderationResults.contentId)
      ).where(eq(moderationResults.status, status as string));
    }
    
    const results = await query;
    
    res.json({ data: results });
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
});

/**
 * POST /api/contents
 * Create new content and queue for moderation
 */
router.post('/contents', async (req, res) => {
  try {
    // Validate request body
    const validatedData = contentSchema.parse(req.body);
    
    // Insert into database
    const [newContent] = await db.insert(contents)
      .values({
        text: validatedData.text,
        language: validatedData.language,
        source: validatedData.source || 'web',
        createdAt: new Date(),
      })
      .returning();
    
    // Queue for moderation
    await publishToModerationQueue({
      contentId: newContent.id,
      text: newContent.text,
      language: newContent.language,
    });
    
    res.status(201).json({ 
      data: newContent,
      message: 'Content created and queued for moderation' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating content:', error);
      res.status(500).json({ error: 'Failed to create content' });
    }
  }
});

/**
 * GET /api/contents/:id
 * Retrieve specific content with moderation results
 */
router.get('/contents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [content] = await db.select()
      .from(contents)
      .where(eq(contents.id, parseInt(id)))
      .limit(1);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const [moderationResult] = await db.select()
      .from(moderationResults)
      .where(eq(moderationResults.contentId, content.id))
      .limit(1);
    
    res.json({
      data: {
        ...content,
        moderation: moderationResult || null,
      }
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

/**
 * DELETE /api/contents/:id
 * Delete content and associated moderation results
 */
router.delete('/contents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contentId = parseInt(id);
    
    // Delete moderation results first (foreign key constraint)
    await db.delete(moderationResults)
      .where(eq(moderationResults.contentId, contentId));
    
    // Delete content
    const [deletedContent] = await db.delete(contents)
      .where(eq(contents.id, contentId))
      .returning();
    
    if (!deletedContent) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json({ 
      data: deletedContent,
      message: 'Content deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router;
