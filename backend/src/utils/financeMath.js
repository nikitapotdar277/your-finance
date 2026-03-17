const CARD_ACCOUNTS = ['Discover', 'Chase', 'Amex', 'Citi'];

function sumAmounts(items) {
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function groupSum(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] || 0) + Number(item.amount || 0);
    return acc;
  }, {});
}

export function buildMonthlySummary({ monthKey, transactions, openingBalances = [] }) {
  const inMonth = transactions.filter((t) => t.monthKey === monthKey);

  const expenses = inMonth.filter((t) => t.type === 'expense');
  const income = inMonth.filter((t) => t.type === 'income');
  const reimbursements = inMonth.filter((t) => t.type === 'reimbursement');
  const cardPayments = inMonth.filter((t) => t.type === 'card_payment');
  const transfers = inMonth.filter((t) => t.type === 'transfer');

  const monthlyIncome = sumAmounts(income);
  const monthlySpending = sumAmounts(expenses);
  const monthlyReimbursements = sumAmounts(reimbursements);
  const monthlyCardPayments = sumAmounts(cardPayments);
  const netSpend = monthlySpending - monthlyReimbursements;
  const netInflow = monthlyIncome + monthlyReimbursements - monthlySpending;

  const categoryTotals = groupSum(expenses, (t) => t.category);
  const accountSpendTotals = groupSum(expenses, (t) => t.fromAccount);

  const openingMap = openingBalances.reduce((acc, item) => {
    acc[item.account] = Number(item.amount || 0);
    return acc;
  }, {});

  const cardSummaries = CARD_ACCOUNTS.map((card) => {
    const opening = openingMap[card] || 0;
    const newCharges = sumAmounts(expenses.filter((t) => t.fromAccount === card));
    const payments = sumAmounts(cardPayments.filter((t) => t.toAccount === card));
    const closing = opening + newCharges - payments;

    return {
      card,
      opening,
      newCharges,
      payments,
      closing,
    };
  });

  return {
    monthKey,
    totals: {
      income: monthlyIncome,
      spending: monthlySpending,
      reimbursements: monthlyReimbursements,
      cardPayments: monthlyCardPayments,
      transfers: sumAmounts(transfers),
      netSpend,
      netInflow,
    },
    categoryTotals,
    accountSpendTotals,
    cardSummaries,
  };
}
