import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedData } from './seed.js';
import Asset from './models/Asset.js';

import authRoutes from './routes/auth.js';
import assetRoutes from './routes/assets.js';
import ticketRoutes from './routes/tickets.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'LabGuard - Campus Lab Equipment & Grievance Maintenance Desk',
    version: '2.0.0',
    timestamp: new Date(),
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

async function startServer() {
  try {
    await connectDB();

    // Auto-seed if database is fresh
    const count = await Asset.countDocuments();
    if (count === 0) {
      console.log('⚡ Initializing LabGuard default hardware assets & demo tickets...');
      await seedData();
    }

    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`\n=============================================================`);
        console.log(`🛠️ LabGuard Grievance API active at: http://localhost:${PORT}`);
        console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`=============================================================\n`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

export default app;
