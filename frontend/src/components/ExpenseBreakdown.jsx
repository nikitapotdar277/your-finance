import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  buildMonthOptions,
  formatCurrency,
  formatMonthLabel,
  getExpenseGroupTotals,
  getCurrentMonthKey,
  getMonthlyIncome,
} from '../utils/finance';

function ExpenseBreakdown({ transactions, categoryGroups }) {
  const monthOptions = useMemo(() => {
    const months = buildMonthOptions(transactions || []);
    const currentMonth = getCurrentMonthKey();
    return months.includes(currentMonth) ? months : [currentMonth, ...months];
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  const chartData = useMemo(() => {
    return getExpenseGroupTotals(transactions || [], selectedMonth, categoryGroups || []);
  }, [transactions, selectedMonth, categoryGroups]);

  const monthlyIncome = useMemo(() => {
    return getMonthlyIncome(transactions || [], selectedMonth);
  }, [transactions, selectedMonth]);

  const totalExpenses = useMemo(
    () => chartData.reduce((sum, item) => sum + Number(item.value || 0), 0),
    [chartData],
  );

  if (!chartData.length || totalExpenses <= 0) {
    return (
      <div>
        <div className="mb-3" style={{ maxWidth: 280 }}>
          <label className="form-label">Month</label>
          <select
            className="form-select app-input"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        </div>

        <p className="text-muted mb-0">No expense data for this month.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3" style={{ maxWidth: 280 }}>
        <label className="form-label">Month</label>
        <select
          className="form-select app-input"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>
      </div>
      <div className="small text-muted mb-3">
        Monthly income: {formatCurrency(monthlyIncome)}
      </div>

      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label={({ name, value }) => {
                const incomePercent = monthlyIncome > 0 ? ((value / monthlyIncome) * 100).toFixed(0) : 0;
                return `${name} ${incomePercent}%`;
              }}            
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3">
        {chartData.map((item) => {
          const percentOfIncome = monthlyIncome > 0
            ? ((item.value / monthlyIncome) * 100).toFixed(1)
            : '0.0';

          return (
            <div key={item.name} className="d-flex justify-content-between small py-1">
              <span>{item.name}</span>
              <span>{formatCurrency(item.value)} ({percentOfIncome}% of income)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseBreakdown;