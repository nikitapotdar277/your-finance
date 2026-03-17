import { useMemo, useState } from 'react';
import { ACCOUNTS, CATEGORIES, DEFAULT_FORM, TRANSACTION_TYPES } from '../data/constants';
import { validateTransaction } from '../utils/finance';

function TransactionForm({ onAddTransaction }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');

  const filteredCategories = useMemo(() => {
    if (form.type === 'income') {
      return ['Paycheck', 'Bonus', 'Cashback', 'Interest'];
    }

    if (form.type === 'card_payment') {
      return ['Card Payment'];
    }

    if (form.type === 'transfer') {
      return ['Transfer'];
    }

    if (form.type === 'reimbursement') {
      return ['Shared Expense', 'Misc'];
    }

    return CATEGORIES.filter(
      (category) => !['Paycheck', 'Bonus', 'Cashback', 'Interest', 'Transfer', 'Card Payment'].includes(category),
    );
  }, [form.type]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleTypeChange(nextType) {
    const nextCategory =
      nextType === 'income'
        ? 'Paycheck'
        : nextType === 'card_payment'
          ? 'Card Payment'
          : nextType === 'transfer'
            ? 'Transfer'
            : nextType === 'reimbursement'
              ? 'Shared Expense'
              : 'Groceries';

    setForm((current) => ({
      ...current,
      type: nextType,
      category: nextCategory,
      toAccount: nextType === 'expense' || nextType === 'income' || nextType === 'reimbursement' ? '' : current.toAccount,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateTransaction(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    onAddTransaction(form);
    setError('');
    setForm({
      ...DEFAULT_FORM,
      date: form.date,
    });
  }

  return (
    <div className="panel-card h-100">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Add transaction</h2>
          <p className="panel-card__subtitle">One form. Everything else updates automatically.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control app-input"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Type</label>
          <select
            className="form-select app-input"
            value={form.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            {TRANSACTION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Category</label>
          <select
            className="form-select app-input"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {filteredCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control app-input"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">From account</label>
          <select
            className="form-select app-input"
            value={form.fromAccount}
            onChange={(e) => updateField('fromAccount', e.target.value)}
          >
            {ACCOUNTS.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>

        {(form.type === 'card_payment' || form.type === 'transfer') && (
          <div className="col-md-6">
            <label className="form-label">To account</label>
            <select
              className="form-select app-input"
              value={form.toAccount}
              onChange={(e) => updateField('toAccount', e.target.value)}
            >
              <option value="">Select account</option>
              {ACCOUNTS.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-12">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control app-input"
            rows="3"
            placeholder="Optional context"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>

        {error ? (
          <div className="col-12">
            <div className="alert alert-danger py-2 mb-0">{error}</div>
          </div>
        ) : null}

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-app-primary btn-lg">
            Save transaction
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
