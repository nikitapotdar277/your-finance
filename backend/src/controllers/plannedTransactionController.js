import { PlannedTransaction } from '../models/PlannedTransaction.js';

export async function listPlannedTransactions(req, res) {
  const { monthKey, type } = req.query;
  const query = {};

  if (monthKey) query.monthKey = monthKey;
  if (type) query.type = type;

  const list = await PlannedTransaction.find(query).sort({ createdAt: 1 }).lean();
  res.json(list);
}

export async function createPlannedTransaction(req, res) {
  const doc = await PlannedTransaction.create(req.body);
  res.status(201).json(doc);
}

export async function updatePlannedTransaction(req, res) {
  const doc = await PlannedTransaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return res.status(404).json({ message: 'Planned transaction not found.' });
  }

  return res.json(doc);
}

export async function deletePlannedTransaction(req, res) {
  const doc = await PlannedTransaction.findByIdAndDelete(req.params.id);

  if (!doc) {
    return res.status(404).json({ message: 'Planned transaction not found.' });
  }

  return res.status(204).send();
}
