const VALID_TYPES = new Set(['expense', 'income', 'card_payment', 'reimbursement', 'transfer']);

export function validateTransactionPayload(req, res, next) {
  const { date, monthKey, type, category, fromAccount, amount } = req.body;

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'A valid date is required.' });
  }

  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    return res.status(400).json({ message: 'monthKey must look like YYYY-MM.' });
  }

  if (!type || !VALID_TYPES.has(type)) {
    return res.status(400).json({ message: 'Invalid transaction type.' });
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
