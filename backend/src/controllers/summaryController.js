import { Transaction } from '../models/Transaction.js';
import { OpeningBalance } from '../models/OpeningBalance.js';
import { buildMonthlySummary } from '../utils/financeMath.js';

export async function getMonthlySummary(req, res) {
  const { monthKey } = req.query;

  if (!monthKey) {
    return res.status(400).json({ message: 'monthKey query param is required.' });
  }

  const [transactions, openingBalances] = await Promise.all([
    Transaction.find({ monthKey }).lean(),
    OpeningBalance.find({ monthKey }).lean(),
  ]);

  const summary = buildMonthlySummary({ monthKey, transactions, openingBalances });
  return res.json(summary);
}
