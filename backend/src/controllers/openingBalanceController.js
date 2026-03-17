import { OpeningBalance } from '../models/OpeningBalance.js';

export async function listOpeningBalances(req, res) {
  const { monthKey } = req.query;
  const query = monthKey ? { monthKey } : {};
  const balances = await OpeningBalance.find(query).sort({ account: 1 }).lean();
  res.json(balances);
}

export async function upsertOpeningBalance(req, res) {
  const { monthKey, account, amount } = req.body;

  if (!monthKey || !account || typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ message: 'monthKey, account and non-negative amount are required.' });
  }

  const balance = await OpeningBalance.findOneAndUpdate(
    { monthKey, account },
    { monthKey, account, amount },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(balance);
}
