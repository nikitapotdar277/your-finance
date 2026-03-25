import ExpenseBreakdown from './ExpenseBreakdown';

function AnalysisPage({ transactions, categoryGroups }) {
  return (
    <div className="row g-4 mt-1">
      <div className="col-12">
        <div className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Expense Analysis</h2>
              <p className="panel-card__subtitle">
                Breakdown of expenses by editable parent groups.
              </p>
            </div>
          </div>

          <ExpenseBreakdown
            transactions={transactions}
            categoryGroups={categoryGroups}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;