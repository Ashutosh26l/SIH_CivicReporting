import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import issueRoutes from './routes/issueRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api', issueRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
