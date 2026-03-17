import { CARD_ACCOUNTS, DEFAULT_OPENING_BALANCES } from '../data/constants';

export function getMonthKey(dateString) {
  if (!dateString) return '';
  return String(dateString).slice(0, 7);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatMonthLabel(monthKey) {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function sumAmounts(items) {
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

export function getPlannedIncome(plannedTransactions, monthKey) {
  return sumAmounts(
    (plannedTransactions || []).filter((t) => t.monthKey === monthKey && t.type === 'income'),
  );
}

export function getPlannedExpenses(plannedTransactions, monthKey) {
  return sumAmounts(
    (plannedTransactions || []).filter((t) => t.monthKey === monthKey && t.type === 'expense'),
  );
}

export function filterTransactionsByMonth(transactions, monthKey) {
  return transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey);
}

export function getMonthlyIncome(transactions, monthKey) {
  return sumAmounts(
    filterTransactionsByMonth(transactions, monthKey).filter((t) => t.type === 'income'),
  );
}

export function getMonthlySpending(transactions, monthKey) {
  return sumAmounts(
    filterTransactionsByMonth(transactions, monthKey).filter((t) => t.type === 'expense'),
  );
}

export function getMonthlyReimbursements(transactions, monthKey) {
  return sumAmounts(
    filterTransactionsByMonth(transactions, monthKey).filter((t) => t.type === 'reimbursement'),
  );
}

export function getMonthlyCardPayments(transactions, monthKey) {
  return sumAmounts(
    filterTransactionsByMonth(transactions, monthKey).filter((t) => t.type === 'card_payment'),
  );
}

export function getNetSpend(transactions, monthKey) {
  return getMonthlySpending(transactions, monthKey) - getMonthlyReimbursements(transactions, monthKey);
}

export function getNetInflow(transactions, monthKey) {
  return (
    getMonthlyIncome(transactions, monthKey) +
    getMonthlyReimbursements(transactions, monthKey) -
    getMonthlySpending(transactions, monthKey)
  );
}

export function getCategoryTotals(transactions, monthKey) {
  const totals = {};

  filterTransactionsByMonth(transactions, monthKey)
    .filter((t) => t.type === 'expense')
    .forEach((transaction) => {
      totals[transaction.category] = (totals[transaction.category] || 0) + Number(transaction.amount || 0);
    });

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getAccountSpendTotals(transactions, monthKey) {
  const totals = {};

  filterTransactionsByMonth(transactions, monthKey)
    .filter((t) => t.type === 'expense')
    .forEach((transaction) => {
      totals[transaction.fromAccount] = (totals[transaction.fromAccount] || 0) + Number(transaction.amount || 0);
    });

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getCardSummary(transactions, monthKey, openingBalances = DEFAULT_OPENING_BALANCES) {
  const monthTransactions = filterTransactionsByMonth(transactions, monthKey);

  return CARD_ACCOUNTS.map((card) => {
    const opening = Number(openingBalances?.[card] || 0);
    const newCharges = sumAmounts(
      monthTransactions.filter((t) => t.type === 'expense' && t.fromAccount === card),
    );
    const payments = sumAmounts(
      monthTransactions.filter((t) => t.type === 'card_payment' && t.toAccount === card),
    );

    return {
      name: card,
      opening,
      newCharges,
      payments,
      closing: opening + newCharges - payments,
    };
  });
}

export function buildMonthOptions(transactions) {
  const keys = [...new Set(transactions.map((t) => getMonthKey(t.date)).filter(Boolean))].sort().reverse();
  return keys;
}

export function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function createTransaction(payload) {
  return {
    id: crypto.randomUUID(),
    ...payload,
    amount: Number(payload.amount),
  };
}

export function validateTransaction(form) {
  if (!form.date) return 'Date is required.';
  if (!form.type) return 'Type is required.';
  if (!form.category) return 'Category is required.';
  if (!form.fromAccount) return 'From account is required.';
  if (!form.amount || Number(form.amount) <= 0) return 'Amount must be greater than 0.';

  if (form.type === 'card_payment' || form.type === 'transfer') {
    if (!form.toAccount) return 'To account is required.';
    if (form.toAccount === form.fromAccount) return 'From account and To account cannot be the same.';
  }

  return '';
}
