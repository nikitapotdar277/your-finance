import { useEffect, useMemo, useState } from 'react';
import { ACCOUNTS, CATEGORIES } from '../data/constants';
import { formatCurrency, formatMonthLabel } from '../utils/finance';

const PLANNED_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

function validatePlannedForm(form) {
  if (!form.monthKey) return 'Month is required.';
  if (!form.type) return 'Type is required.';
  if (!form.category) return 'Category is required.';
  if (!form.fromAccount) return 'From account is required.';
  if (!form.amount || Number(form.amount) <= 0) return 'Amount must be greater than 0.';
  return '';
}

function PlannedTransactionForm({
  monthKey,
  monthOptions,
  plannedTransactions,
  onAddPlannedTransaction,
  onDeletePlannedTransaction,
}) {
  const [form, setForm] = useState({
    monthKey: monthKey || '',
    type: 'expense',
    category: 'Groceries',
    fromAccount: 'Checking',
    amount: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm((f) => ({ ...f, monthKey: monthKey || f.monthKey }));
  }, [monthKey]);

  const filteredCategories = useMemo(() => {
    if (form.type === 'income') {
      return ['Paycheck', 'Bonus', 'Cashback', 'Interest'];
    }
    return CATEGORIES.filter(
      (c) => !['Paycheck', 'Bonus', 'Cashback', 'Interest', 'Transfer', 'Card Payment'].includes(c),
    );
  }, [form.type]);

  const listForMonth = useMemo(
    () => (plannedTransactions || []).filter((p) => p.monthKey === monthKey),
    [plannedTransactions, monthKey],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleTypeChange(nextType) {
    const nextCategory = nextType === 'income' ? 'Paycheck' : 'Groceries';
    setForm((current) => ({ ...current, type: nextType, category: nextCategory }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validatePlannedForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAddPlannedTransaction({
      ...form,
      amount: Number(form.amount),
    });
    setError('');
    setForm((current) => ({
      ...current,
      amount: '',
      notes: '',
    }));
  }

  return (
    <div className="panel-card">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Planned transactions</h2>
          <p className="panel-card__subtitle">Add planned income or expenses for a month.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6 col-lg-2">
          <label className="form-label">Month</label>
          <select
            className="form-select app-input"
            value={form.monthKey}
            onChange={(e) => updateField('monthKey', e.target.value)}
          >
            <option value="">Select month</option>
            {(monthOptions || []).map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <label className="form-label">Type</label>
          <select
            className="form-select app-input"
            value={form.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            {PLANNED_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <label className="form-label">Category</label>
          <select
            className="form-select app-input"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {filteredCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <label className="form-label">From account</label>
          <select
            className="form-select app-input"
            value={form.fromAccount}
            onChange={(e) => updateField('fromAccount', e.target.value)}
          >
            {ACCOUNTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <label className="form-label">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control app-input"
            placeholder="0"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
          />
        </div>
        <div className="col-md-6 col-lg-2 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            Add planned
          </button>
        </div>
        <div className="col-12">
          <label className="form-label">Notes (optional)</label>
          <input
            type="text"
            className="form-control app-input"
            placeholder="Optional"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>
        {error ? (
          <div className="col-12">
            <div className="alert alert-danger py-2 mb-0">{error}</div>
          </div>
        ) : null}
      </form>

      {listForMonth.length > 0 ? (
        <div className="table-responsive">
          <table className="table app-table align-middle mb-0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>From</th>
                <th>Amount</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listForMonth.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={`badge ${p.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                      {p.type}
                    </span>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.fromAccount}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td className="text-muted small">{p.notes || '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeletePlannedTransaction(p.id)}
                      aria-label="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted small mb-0">No planned transactions for this month yet.</p>
      )}
    </div>
  );
}

export default PlannedTransactionForm;
