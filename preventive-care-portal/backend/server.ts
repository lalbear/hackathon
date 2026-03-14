import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Added for basic security/HIPAA concept requirements
app.use(express.json());
// CORS — allow the Vercel frontend and local dev
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3005',
  process.env.FRONTEND_URL,           // Set this in Render to your Vercel URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import goalRoutes from './routes/goalRoutes';
import providerRoutes from './routes/providerRoutes';
import healthRoutes from './routes/healthRoutes';
import reminderRoutes from './routes/reminderRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/reminders', reminderRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
