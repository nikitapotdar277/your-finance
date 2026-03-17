import clsx from 'clsx';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'planned', label: 'Planned' },
  { id: 'tools', label: 'Tools' },
];

function VerticalNav({ selectedSection, onSelectSection }) {
  return (
    <nav className="app-vertical-nav">
      <div className="app-vertical-nav__brand mb-4">
        <span className="app-vertical-nav__dot" />
        <span className="app-vertical-nav__brand-text">Money Flow</span>
      </div>
      <ul className="app-vertical-nav__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={clsx(
                'app-vertical-nav__item',
                selectedSection === item.id && 'app-vertical-nav__item--active',
              )}
              onClick={() => onSelectSection(item.id)}
            >
              <span className="app-vertical-nav__bullet" />
              <span className="app-vertical-nav__label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default VerticalNav;

