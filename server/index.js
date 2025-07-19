import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import storyRoutes from './routes/storyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', storyRoutes);

app.listen(PORT, () => {
  console.log(`🚀 CodeTales API server running on port ${PORT}`);
});