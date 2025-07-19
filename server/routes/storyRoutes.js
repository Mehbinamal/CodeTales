import express from 'express';
import { generateStory, healthCheck, rewriteStoryWithExperience } from '../controllers/storyController.js';

const router = express.Router();

// Story generation route
router.post('/generate-story', generateStory);

// Rewrite story with personal experience route
router.post('/rewrite-story', rewriteStoryWithExperience);

// Health check route
router.get('/health', healthCheck);

export default router; 