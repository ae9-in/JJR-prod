import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import verticalRoutes from './routes/verticalRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import panchangaRoutes from './routes/panchangaRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const allowedOrigins = [
  ...env.frontendUrl.split(',').map(o => o.trim().replace(/\/$/, '')),
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // In development, allow any origin to simplify local + LAN testing.
      if (env.nodeEnv !== 'production') return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, origin); // Echo EXACT string back to browser
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'Jaya Janardhana backend is running'
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verticals', verticalRoutes);
app.use('/api/products', productRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/panchanga', panchangaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
