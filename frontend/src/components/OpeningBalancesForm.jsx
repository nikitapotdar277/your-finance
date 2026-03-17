import { CARD_ACCOUNTS } from '../data/constants';

function OpeningBalancesForm({ monthKey, openingBalances, onChange }) {
  return (
    <div className="panel-card h-100">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Opening balances</h2>
          <p className="panel-card__subtitle">Set the statement balance you were carrying into {monthKey}.</p>
        </div>
      </div>

      <div className="row g-3">
        {CARD_ACCOUNTS.map((card) => (
          <div className="col-md-6" key={card}>
            <label className="form-label">{card}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control app-input"
              value={openingBalances[card] ?? 0}
              onChange={(e) => onChange(card, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpeningBalancesForm;
