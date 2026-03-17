import { formatCurrency } from '../utils/finance';

function SummaryCard({ title, value, hint, tone = 'default' }) {
  return (
    <div className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__title">{title}</div>
      <div className="summary-card__value">{formatCurrency(value)}</div>
      {hint ? <div className="summary-card__hint">{hint}</div> : null}
    </div>
  );
}

export default SummaryCard;
