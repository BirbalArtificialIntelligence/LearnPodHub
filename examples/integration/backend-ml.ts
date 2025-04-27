/**
 * Example of Backend-ML Pipeline Integration
 * This file demonstrates how to connect the Express backend to ML services
 */

import axios from 'axios';
import amqp from 'amqplib';
import { Content, ModerationResult } from '@shared/types';
import { db } from '../db';
import { contents, moderationResults } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Environment variables
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = 'moderation_queue';

/**
 * Publish content to the moderation queue for asynchronous processing
 */
export async function publishToModerationQueue(content: {
  contentId: number;
  text: string;
  language: string;
}): Promise<void> {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Ensure queue exists
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Send to queue
    const success = channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(content)),
      { persistent: true }
    );
    
    console.log(`Content ${content.contentId} queued for moderation: ${success}`);
    
    // Close connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing to moderation queue:', error);
    throw new Error('Failed to queue content for moderation');
  }
}

/**
 * Consume messages from the moderation queue and process them
 */
export async function startModerationQueueConsumer(): Promise<void> {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Ensure queue exists
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Set prefetch to limit concurrent processing
    channel.prefetch(1);
    
    console.log(`Waiting for messages in ${QUEUE_NAME}`);
    
    // Consume messages
    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;
      
      try {
        // Parse message content
        const content = JSON.parse(msg.content.toString());
        console.log(`Processing content ${content.contentId}`);
        
        // Call ML service for moderation
        const result = await moderateContent(content.text, content.language);
        
        // Store moderation result
        await storeModerationResult(content.contentId, result);
        
        // Acknowledge message
        channel.ack(msg);
        
        console.log(`Content ${content.contentId} processed successfully`);
      } catch (error) {
        console.error('Error processing moderation message:', error);
        
        // Reject and requeue message for retry
        // In production, implement dead letter queue and retry limits
        channel.nack(msg, false, true);
      }
    });
    
    // Handle connection closure
    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });
  } catch (error) {
    console.error('Error starting moderation queue consumer:', error);
    throw new Error('Failed to start moderation queue consumer');
  }
}

/**
 * Call ML service to moderate content
 */
export async function moderateContent(
  text: string,
  language: string
): Promise<{
  status: 'approved' | 'rejected' | 'needs_review';
  categories: string[];
  confidence: number;
  language_detected: string;
}> {
  try {
    // Call ML service API
    const response = await axios.post(`${ML_SERVICE_URL}/api/moderate`, {
      text,
      language,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling ML service:', error);
    
    // Fallback to manual review if ML service fails
    return {
      status: 'needs_review',
      categories: [],
      confidence: 0,
      language_detected: language,
    };
  }
}

/**
 * Store moderation result in database
 */
export async function storeModerationResult(
  contentId: number,
  result: {
    status: 'approved' | 'rejected' | 'needs_review';
    categories: string[];
    confidence: number;
    language_detected: string;
  }
): Promise<void> {
  try {
    // Check if content exists
    const [existingContent] = await db
      .select()
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);
    
    if (!existingContent) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Check if moderation result already exists
    const [existingResult] = await db
      .select()
      .from(moderationResults)
      .where(eq(moderationResults.contentId, contentId))
      .limit(1);
    
    if (existingResult) {
      // Update existing result
      await db
        .update(moderationResults)
        .set({
          status: result.status,
          categories: result.categories,
          confidence: result.confidence,
          languageDetected: result.language_detected,
          updatedAt: new Date(),
        })
        .where(eq(moderationResults.contentId, contentId));
    } else {
      // Insert new result
      await db.insert(moderationResults).values({
        contentId: contentId,
        status: result.status,
        categories: result.categories,
        confidence: result.confidence,
        languageDetected: result.language_detected,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error storing moderation result:', error);
    throw new Error('Failed to store moderation result');
  }
}

/**
 * Initialize the ML integration
 * This should be called when the server starts
 */
export async function initializeMLIntegration(): Promise<void> {
  try {
    // Check if ML service is available
    await axios.get(`${ML_SERVICE_URL}/health`);
    console.log('ML service is available');
    
    // Start consumer for moderation queue
    await startModerationQueueConsumer();
    console.log('Moderation queue consumer started');
  } catch (error) {
    console.error('Error initializing ML integration:', error);
    console.warn('ML service integration will be limited or unavailable');
  }
}

/**
 * Get summary statistics for moderation
 * This can be used for dashboards and reporting
 */
export async function getModerationStats(): Promise<{
  total: number;
  approved: number;
  rejected: number;
  needsReview: number;
  averageConfidence: number;
}> {
  try {
    // This is a simplified implementation
    // In production, use more efficient queries
    
    const allResults = await db
      .select()
      .from(moderationResults);
    
    const approved = allResults.filter((r) => r.status === 'approved').length;
    const rejected = allResults.filter((r) => r.status === 'rejected').length;
    const needsReview = allResults.filter((r) => r.status === 'needs_review').length;
    
    const totalConfidence = allResults.reduce((sum, r) => sum + (r.confidence || 0), 0);
    const averageConfidence = allResults.length > 0 
      ? totalConfidence / allResults.length 
      : 0;
    
    return {
      total: allResults.length,
      approved,
      rejected,
      needsReview,
      averageConfidence,
    };
  } catch (error) {
    console.error('Error getting moderation stats:', error);
    throw new Error('Failed to get moderation statistics');
  }
}
