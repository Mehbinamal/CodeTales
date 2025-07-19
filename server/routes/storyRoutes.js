import express from 'express';
import { generateStory, healthCheck } from '../controllers/storyController.js';

const router = express.Router();

// Story generation route
router.post('/generate-story', generateStory);

// Health check route
router.get('/health', healthCheck);

export default router; 