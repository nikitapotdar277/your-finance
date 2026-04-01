import ExpenseBreakdown from './ExpenseBreakdown';

function AnalysisPage({ transactions, categoryGroups }) {
  return (
    <div className="row g-4 mt-1">
      <div className="col-12">
        <div className="panel-card mb-4">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Category Groups Reference</h2>
              <p className="panel-card__subtitle">
                Categories and Sub Categories
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-2">
                <h5 className="fw-semibold">Needs</h5>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {needsCategories.length ? (
                  needsCategories.map((category) => (
                    <span key={category} className="badge bg-info">
                      {category}
                    </span>
                  ))
                ) : (
                  <p className="text-muted small">No categories configured</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <h5 className="fw-semibold">Wants</h5>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {wantsCategories.length ? (
                  wantsCategories.map((category) => (
                    <span key={category} className="badge bg-warning">
                      {category}
                    </span>
                  ))
                ) : (
                  <p className="text-muted small">No categories configured</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
