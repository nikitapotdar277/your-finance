import { formatCurrency } from '../utils/finance';

function TransactionsTable({ transactions, monthKey, onDeleteTransaction }) {
  const filtered = transactions
    .filter((transaction) => transaction.date.startsWith(monthKey))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="panel-card">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Transactions</h2>
          <p className="panel-card__subtitle">You only need to keep this list clean.</p>
        </div>
      </div>

      {filtered.length ? (
        <div className="table-responsive">
          <table className="table app-table align-middle mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td><span className={`type-pill type-pill--${transaction.type}`}>{transaction.type.replace('_', ' ')}</span></td>
                  <td>{transaction.category}</td>
                  <td>{transaction.fromAccount}</td>
                  <td>{transaction.toAccount || '—'}</td>
                  <td className="fw-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="text-muted">{transaction.notes || '—'}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteTransaction(transaction.id)}
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
        <div className="empty-state">No transactions yet for this month.</div>
      )}
    </div>
  );
}

export default TransactionsTable;
