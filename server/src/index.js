import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedData } from './seed.js';
import Asset from './models/Asset.js';
import User from './models/User.js';

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

// API Catalog & Route Directory
const getApiCatalog = (req) => {
  const host = req.get('host') || `localhost:${PORT}`;
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;

  return {
    project: 'LabGuard - Campus Lab Equipment & Grievance SLA Desk',
    institution: 'St. Francis Institute of Technology (SFIT), Department of Information Technology (INFT)',
    status: 'online',
    version: '2.0.0',
    exposedRoutes: {
      tickets: `${baseUrl}/api/tickets`,
      assets: `${baseUrl}/api/assets`,
      analytics: `${baseUrl}/api/analytics`,
      analyticsOverview: `${baseUrl}/api/analytics/overview`,
      users: `${baseUrl}/api/users`,
      health: `${baseUrl}/api/health`,
    },
    demoCredentials: [
      { role: 'student', name: 'Veer', usn: 'PID-241034', email: 'veer@sfit.ac.in', password: 'student123' },
      { role: 'technician', name: 'Ramesh Kumar', usn: 'SFIT-TECH-04', email: 'ramesh.tech@sfit.ac.in', password: 'tech123' },
      { role: 'admin', name: 'Dr. S. N. Sharma', roleDesc: 'HOD INFT', email: 'hod.inft@sfit.ac.in', password: 'admin123' },
    ],
  };
};

app.get('/', (req, res) => res.json(getApiCatalog(req)));
app.get('/api', (req, res) => res.json(getApiCatalog(req)));

// Exposed users route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ role: 1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'LabGuard - Campus Lab Equipment & Grievance Maintenance Desk',
    institution: 'SFIT Mumbai (INFT)',
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
