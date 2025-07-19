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

// Root endpoint for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'CodeTales API Server is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Ping endpoint for health check
app.get('/ping', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Pong! Server is running' 
  });
});

// Routes
app.use('/api', storyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server for localhost development
app.listen(PORT, () => {
  console.log(`🚀 CodeTales API server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/`);
  console.log(`🏓 Ping endpoint: http://localhost:${PORT}/ping`);
  console.log(`📚 API routes: http://localhost:${PORT}/api/`);
});

export default app;