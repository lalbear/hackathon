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
app.use(cors());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
