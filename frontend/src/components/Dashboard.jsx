import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SummaryCard from './SummaryCard';
import {
  formatCurrency,
  getAccountSpendTotals,
  getCardSummary,
  getCategoryTotals,
  getMonthlyCardPayments,
  getMonthlyIncome,
  getMonthlyReimbursements,
  getMonthlySpending,
  getNetInflow,
  getNetSpend,
  getPlannedIncome,
  getPlannedExpenses,
} from '../utils/finance';

const PIE_COLORS = ['#4F46E5', '#0F766E', '#DC2626', '#C2410C', '#7C3AED', '#2563EB', '#A16207', '#BE185D'];

function Dashboard({ transactions, plannedTransactions, monthKey, openingBalances }) {
  const income = getMonthlyIncome(transactions, monthKey);
  const spending = getMonthlySpending(transactions, monthKey);
  const reimbursements = getMonthlyReimbursements(transactions, monthKey);
  const cardPayments = getMonthlyCardPayments(transactions, monthKey);
  const netSpend = getNetSpend(transactions, monthKey);
  const netInflow = getNetInflow(transactions, monthKey);
  const plannedIncome = getPlannedIncome(plannedTransactions || [], monthKey);
  const plannedExpenses = getPlannedExpenses(plannedTransactions || [], monthKey);
  const categoryTotals = getCategoryTotals(transactions, monthKey);
  const accountTotals = getAccountSpendTotals(transactions, monthKey);
  const cardSummary = getCardSummary(transactions, monthKey, openingBalances);

  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-md-6 col-xl-4"><SummaryCard title="Income" value={income} hint="Only true income" tone="success" /></div>
        <div className="col-md-6 col-xl-4"><SummaryCard title="Spending" value={spending} hint="Only expense transactions" tone="danger" /></div>
        <div className="col-md-6 col-xl-4"><SummaryCard title="Reimbursements" value={reimbursements} hint="Pays you back without inflating income" tone="violet" /></div>
        <div className="col-md-6 col-xl-4"><SummaryCard title="Net spend" value={netSpend} hint="Spending - reimbursements" tone="primary" /></div>
        <div className="col-md-6 col-xl-4"><SummaryCard title="Card payments" value={cardPayments} hint="Cash flow only, not spending" tone="sky" /></div>
        <div className="col-md-6 col-xl-4"><SummaryCard title="Net inflow" value={netInflow} hint="Income + reimbursements - spending" tone="neutral" /></div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div className="panel-card p-3">
            <h2 className="panel-card__title mb-3">Planned</h2>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <SummaryCard title="Planned income" value={plannedIncome} tone="success" />
              </div>
              <div className="col-md-6 col-lg-3">
                <SummaryCard title="Planned expenses" value={plannedExpenses} tone="danger" />
              </div>
              <div className="col-md-6 col-lg-3">
                <SummaryCard title="Planned cash" value={plannedIncome - plannedExpenses} tone="success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-6">
          <div className="panel-card chart-card h-100">
            <div className="panel-card__header">
              <div>
                <h2 className="panel-card__title">Spending by category</h2>
                <p className="panel-card__subtitle">This excludes card payments.</p>
              </div>
            </div>

            {categoryTotals.length ? (
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryTotals} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={3}>
                      {categoryTotals.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-state">No expense data yet for this month.</div>
            )}

            <div className="legend-list mt-3">
              {categoryTotals.slice(0, 6).map((item) => (
                <div className="legend-list__row" key={item.name}>
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="panel-card chart-card h-100">
            <div className="panel-card__header">
              <div>
                <h2 className="panel-card__title">Where spending was charged</h2>
                <p className="panel-card__subtitle">Useful for Discover / Chase / Checking split.</p>
              </div>
            </div>

            {accountTotals.length ? (
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={accountTotals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" />
                    <YAxis stroke="#64748B" tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-state">No charge data yet for this month.</div>
            )}
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Card tracker</h2>
            <p className="panel-card__subtitle">Closing = opening balance + new charges - payments.</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table app-table align-middle mb-0">
            <thead>
              <tr>
                <th>Card</th>
                <th>Opening</th>
                <th>New charges</th>
                <th>Payments</th>
                <th>Closing</th>
              </tr>
            </thead>
            <tbody>
              {cardSummary.map((card) => (
                <tr key={card.name}>
                  <td className="fw-semibold">{card.name}</td>
                  <td>{formatCurrency(card.opening)}</td>
                  <td>{formatCurrency(card.newCharges)}</td>
                  <td>{formatCurrency(card.payments)}</td>
                  <td className="fw-semibold">{formatCurrency(card.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
