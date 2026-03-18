import { Transaction } from '../models/Transaction.js';

export async function listTransactions(req, res) {
  const { monthKey, type, category } = req.query;
  const query = {};

  if (monthKey) query.monthKey = monthKey;
  if (type) query.type = type;
  if (category) query.category = category;

  const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 }).lean();
  res.json(transactions);
}

export async function createTransaction(req, res) {
  const transaction = await Transaction.create(req.body);
  res.status(201).json(transaction);
}

export async function updateTransaction(req, res) {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found.' });
  }

  return res.json(transaction);
}

export async function deleteTransaction(req, res) {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found.' });
  }

  return res.status(204).send();
}
