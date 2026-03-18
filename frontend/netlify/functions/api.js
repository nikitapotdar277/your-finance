import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import morgan from 'morgan';

// Adjust these paths to point to your actual backend folders
import { connectDB } from './config/db.js'; 
import { requireAuth } from './middleware/auth.js';
import transactionRoutes from './routes/transactionRoutes.js';
import openingBalanceRoutes from './routes/openingBalanceRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import plannedTransactionRoutes from './routes/plannedTransactionRoutes.js';

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(morgan('dev'));

// Session with Persistent MongoDB Store (Required for Serverless)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: true, // Netlify is always HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Router to handle the Netlify Function pathing
const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));
router.use('/auth', authRoutes);
router.use('/transactions', requireAuth, transactionRoutes);
router.use('/opening-balances', requireAuth, openingBalanceRoutes);
router.use('/summary', requireAuth, summaryRoutes);
router.use('/planned-transactions', requireAuth, plannedTransactionRoutes);

// Apply router to the specific Netlify Function endpoint
app.use('/.netlify/functions/api', router);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

// EXPORT THE HANDLER (Crucial: Replace app.listen)
const serverlessHandler = serverless(app);
export const handler = async (event, context) => {
  await connectDB(); // Ensure DB is connected for every request
  return await serverlessHandler(event, context);
};
