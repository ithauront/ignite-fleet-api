import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import historicRoutes from './routes/historic.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));

const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.length === 0 || allowed.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

const { MONGODB_URI, PORT = 3333 } = process.env;
await mongoose.connect(MONGODB_URI);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/historic', historicRoutes)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
