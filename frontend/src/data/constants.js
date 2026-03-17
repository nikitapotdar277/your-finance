export const TRANSACTION_TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'card_payment', label: 'Card Payment' },
  { value: 'reimbursement', label: 'Reimbursement' },
  { value: 'transfer', label: 'Transfer' },
];

export const CATEGORIES = [
  'Rent',
  'Groceries',
  'Eating Out',
  'Utilities',
  'Shopping',
  'Travel',
  'Subscriptions',
  'Insurance',
  'Gas',
  'Medical',
  'Send Home',
  'Shared Expense',
  'Misc',
  'Paycheck',
  'Bonus',
  'Cashback',
  'Interest',
  'Transfer',
  'Card Payment',
];

export const ACCOUNTS = [
  'Checking',
  'Savings',
  'Cash',
  'Discover',
  'Chase',
  'Amex',
  'Citi',
  'External',
];

export const CARD_ACCOUNTS = ['Discover', 'Chase', 'Amex', 'Citi'];

export const DEFAULT_OPENING_BALANCES = {
  Discover: 0,
  Chase: 0,
  Amex: 0,
  Citi: 0,
};

export const DEFAULT_FORM = {
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  category: 'Groceries',
  fromAccount: 'Checking',
  toAccount: '',
  amount: '',
  notes: '',
};
