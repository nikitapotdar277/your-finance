const PLANNED_TYPES = new Set(['income', 'expense']);

export function validatePlannedTransactionPayload(req, res, next) {
  const { monthKey, type, category, fromAccount, amount } = req.body;

  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    return res.status(400).json({ message: 'monthKey must look like YYYY-MM.' });
  }

  if (!type || !PLANNED_TYPES.has(type)) {
    return res.status(400).json({ message: 'type must be "income" or "expense".' });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'category is required.' });
  }

  if (!fromAccount || typeof fromAccount !== 'string') {
    return res.status(400).json({ message: 'fromAccount is required.' });
  }

  if (typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ message: 'amount must be a non-negative number.' });
  }

  return next();
}
