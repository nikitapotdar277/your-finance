import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { requireAuth } from './middleware/auth.js';
import transactionRoutes from './routes/transactionRoutes.js';
import openingBalanceRoutes from './routes/openingBalanceRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import plannedTransactionRoutes from './routes/plannedTransactionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const SESSION_MAX_AGE_MS = (Number(process.env.SESSION_MAX_AGE_DAYS) || 7) * 24 * 60 * 60 * 1000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: SESSION_MAX_AGE_MS,
    },
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'finance-tracker-backend' });
});

app.use('/api/auth', authRoutes);

app.use('/api/transactions', requireAuth, transactionRoutes);
app.use('/api/opening-balances', requireAuth, openingBalanceRoutes);
app.use('/api/summary', requireAuth, summaryRoutes);
app.use('/api/planned-transactions', requireAuth, plannedTransactionRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
