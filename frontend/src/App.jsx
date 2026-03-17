import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTransactions,
  getOpeningBalances,
  getPlannedTransactions,
  createTransaction as apiCreateTransaction,
  deleteTransaction as apiDeleteTransaction,
  createPlannedTransaction as apiCreatePlannedTransaction,
  deletePlannedTransaction as apiDeletePlannedTransaction,
  upsertOpeningBalance as apiUpsertOpeningBalance,
  logout as apiLogout,
  openingBalancesArrayToByMonth,
  normalizeTransaction,
} from './api';
import Dashboard from './components/Dashboard';
import OpeningBalancesForm from './components/OpeningBalancesForm';
import TransactionForm from './components/TransactionForm';
import TransactionsTable from './components/TransactionsTable';
import PlannedTransactionForm from './components/PlannedTransactionForm';
import Calculator from './components/Calculator';
import SummaryCard from './components/SummaryCard';
import VerticalNav from './components/VerticalNav';
import { DEFAULT_OPENING_BALANCES } from './data/constants';
import {
  buildMonthOptions,
  formatMonthLabel,
  getCurrentMonthKey,
  getPlannedIncome,
  getPlannedExpenses,
} from './utils/finance';

function App() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [plannedTransactions, setPlannedTransactions] = useState([]);
  const [openingBalancesByMonth, setOpeningBalancesByMonth] = useState(() => ({
    [getCurrentMonthKey()]: { ...DEFAULT_OPENING_BALANCES },
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedSection, setSelectedSection] = useState('overview');

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [txList, obList, plannedList] = await Promise.all([
        getTransactions(),
        getOpeningBalances(),
        getPlannedTransactions(),
      ]);
      setTransactions(txList);
      setOpeningBalancesByMonth(openingBalancesArrayToByMonth(obList));
      setPlannedTransactions(plannedList);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const monthOptions = useMemo(() => {
    const fromTx = buildMonthOptions(transactions);
    const fromPlanned = [...new Set((plannedTransactions || []).map((p) => p.monthKey).filter(Boolean))];
    const options = [...new Set([...fromTx, ...fromPlanned])].sort().reverse();
    if (!options.includes(getCurrentMonthKey())) options.unshift(getCurrentMonthKey());
    return options;
  }, [transactions, plannedTransactions]);

  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthKey());

  useEffect(() => {
    if (monthOptions.length && !monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0] || getCurrentMonthKey());
    }
  }, [monthOptions, selectedMonth]);

  const openingBalances = openingBalancesByMonth[selectedMonth] || DEFAULT_OPENING_BALANCES;
  const plannedIncome = getPlannedIncome(plannedTransactions, selectedMonth);
  const plannedExpenses = getPlannedExpenses(plannedTransactions, selectedMonth);

  async function handleAddTransaction(form) {
    try {
      setError(null);
      const created = await apiCreateTransaction({
        date: form.date,
        type: form.type,
        category: form.category,
        fromAccount: form.fromAccount,
        toAccount: form.toAccount ?? '',
        amount: form.amount,
        notes: form.notes ?? '',
      });
      const normalized = normalizeTransaction(created);
      setTransactions((current) => [...current, normalized]);
      const monthKey = form.date.slice(0, 7);
      if (!openingBalancesByMonth[monthKey]) {
        setOpeningBalancesByMonth((current) => ({
          ...current,
          [monthKey]: { ...DEFAULT_OPENING_BALANCES },
        }));
      }
    } catch (e) {
      setError(e.message || 'Failed to add transaction');
    }
  }

  async function handleDeleteTransaction(transactionId) {
    try {
      setError(null);
      await apiDeleteTransaction(transactionId);
      setTransactions((current) =>
        current.filter((t) => t.id !== transactionId),
      );
    } catch (e) {
      setError(e.message || 'Failed to delete transaction');
    }
  }

  async function handleAddPlannedTransaction(form) {
    try {
      setError(null);
      const created = await apiCreatePlannedTransaction({
        monthKey: form.monthKey,
        type: form.type,
        category: form.category,
        fromAccount: form.fromAccount,
        amount: form.amount,
        notes: form.notes ?? '',
      });
      setPlannedTransactions((current) => [...current, created]);
    } catch (e) {
      setError(e.message || 'Failed to add planned transaction');
    }
  }

  async function handleDeletePlannedTransaction(id) {
    try {
      setError(null);
      await apiDeletePlannedTransaction(id);
      setPlannedTransactions((current) => current.filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete planned transaction');
    }
  }

  async function handleOpeningBalanceChange(cardName, value) {
    const num = Number(value || 0);
    try {
      setError(null);
      await apiUpsertOpeningBalance(selectedMonth, cardName, num);
      setOpeningBalancesByMonth((current) => ({
        ...current,
        [selectedMonth]: {
          ...(current[selectedMonth] || DEFAULT_OPENING_BALANCES),
          [cardName]: num,
        },
      }));
    } catch (e) {
      setError(e.message || 'Failed to save opening balance');
    }
  }

  function clearAllData() {
    const confirmed = window.confirm(
      'This will reload data from the server. Continue?',
    );
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    setSelectedMonth(getCurrentMonthKey());
    loadData();
  }

  async function handleLogout() {
    try {
      await apiLogout();
      navigate('/login', { replace: true });
    } catch (e) {
      setError(e.message || 'Logout failed');
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <div className="container py-4 py-lg-5 text-center">
          <p className="text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="container py-4 py-lg-5">
        {error ? (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        ) : null}
        <div className="app-layout">
          <aside className="app-layout__nav">
            <VerticalNav selectedSection={selectedSection} onSelectSection={setSelectedSection} />
          </aside>

          <main className="app-layout__main">
            <div className="hero mb-4">
              <div>
                <div className="eyebrow">Finance tracker</div>
                <h1 className="hero__title">Money Flow</h1>
                <p className="hero__subtitle">
                  Expenses mean purchases. Card payments mean statement payoff. Reimbursements reduce net spend.
                </p>
              </div>

              <div className="hero__actions">
                <label className="form-label mb-1">Selected month</label>
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
                <button type="button" className="btn btn-outline-secondary mt-2" onClick={clearAllData}>
                  Reload from server
                </button>
                <button type="button" className="btn btn-outline-secondary mt-2 d-block" onClick={handleLogout}>
                  Log out
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary mt-2 d-block"
                  onClick={() => setShowCalculator(true)}
                >
                  Calculator
                </button>
              </div>
            </div>

            {showCalculator ? (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.3)' }}
                onClick={() => setShowCalculator(false)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Calculator onClose={() => setShowCalculator(false)} />
                </div>
              </div>
            ) : null}

            {selectedSection === 'overview' && (
              <Dashboard
                transactions={transactions}
                plannedTransactions={plannedTransactions}
                monthKey={selectedMonth}
                openingBalances={openingBalances}
              />
            )}

            {selectedSection === 'planned' && (
              <>
                <div className="row g-3 mb-3">
                  <div className="col-md-6 col-lg-3">
                    <SummaryCard title="Planned income" value={plannedIncome} tone="success" />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <SummaryCard title="Planned expenses" value={plannedExpenses} tone="danger" />
                  </div>
                </div>
                <div className="row g-4 mt-1">
                  <div className="col-xl-12">
                    <PlannedTransactionForm
                      monthKey={selectedMonth}
                      monthOptions={monthOptions}
                      plannedTransactions={plannedTransactions}
                      onAddPlannedTransaction={handleAddPlannedTransaction}
                      onDeletePlannedTransaction={handleDeletePlannedTransaction}
                    />
                  </div>
                </div>
              </>
            )}

            {selectedSection === 'transactions' && (
              <>
                <div className="row g-4 mt-1">
                  <div className="col-xl-7">
                    <TransactionForm onAddTransaction={handleAddTransaction} />
                  </div>
                  <div className="col-xl-5">
                    <OpeningBalancesForm
                      monthKey={formatMonthLabel(selectedMonth)}
                      openingBalances={openingBalances}
                      onChange={handleOpeningBalanceChange}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <TransactionsTable
                    transactions={transactions}
                    monthKey={selectedMonth}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </div>
              </>
            )}

            {selectedSection === 'tools' && (
              <div className="row g-4 mt-1">
                <div className="col-md-6 col-lg-4">
                  <Calculator />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
