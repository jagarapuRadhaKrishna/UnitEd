import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import apiRoutes from './routes/index.js';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined')); // Logging
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}`, apiRoutes);

// Root redirect
app.get('/', (_req, res) => {
  res.json({
    message: 'United Platform API',
    version: API_VERSION,
    status: 'running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`
┌────────────────────────────────────────────┐
│  United Platform Backend Server Started    │
├────────────────────────────────────────────┤
│  🚀 Server: http://${HOST}:${PORT}
│  📡 API Routes: /api/${API_VERSION}
│  🗄️  Database: Connected
│  📚 Documentation: Check routes/
└────────────────────────────────────────────┘
  `);
});

export default app;
