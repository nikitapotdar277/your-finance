import { useState, useCallback } from 'react';

function Calculator({ onClose }) {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState(null);
  const [op, setOp] = useState(null);
  const [readyNew, setReadyNew] = useState(true);

  const inputDigit = useCallback(
    (d) => {
      if (readyNew) {
        setDisplay(String(d));
        setReadyNew(false);
      } else {
        setDisplay((cur) => (cur === '0' ? String(d) : cur + d));
      }
    },
    [readyNew],
  );

  const inputDecimal = useCallback(() => {
    if (readyNew) {
      setDisplay('0.');
      setReadyNew(false);
    } else if (!display.includes('.')) {
      setDisplay((cur) => cur + '.');
    }
  }, [readyNew, display]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPrevious(null);
    setOp(null);
    setReadyNew(true);
  }, []);

  const performOp = useCallback(
    (nextOp) => {
      const num = parseFloat(display);
      if (previous === null) {
        setPrevious(num);
        setOp(nextOp);
        setReadyNew(true);
        return;
      }
      if (op) {
        let result = previous;
        if (op === '+') result = previous + num;
        else if (op === '−') result = previous - num;
        else if (op === '×') result = previous * num;
        else if (op === '÷') result = num === 0 ? 0 : previous / num;
        setDisplay(String(result));
        setPrevious(result);
        setOp(nextOp);
        setReadyNew(true);
      }
    },
    [display, previous, op],
  );

  const equals = useCallback(() => {
    const num = parseFloat(display);
    if (previous === null || !op) return;
    let result = previous;
    if (op === '+') result = previous + num;
    else if (op === '−') result = previous - num;
    else if (op === '×') result = previous * num;
    else if (op === '÷') result = num === 0 ? 0 : previous / num;
    setDisplay(String(result));
    setPrevious(null);
    setOp(null);
    setReadyNew(true);
  }, [display, previous, op]);

  const copyResult = useCallback(() => {
    navigator.clipboard.writeText(display);
  }, [display]);

  return (
    <div className="panel-card p-3" style={{ minWidth: '500px' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="eyebrow">Calculator</span>
        {onClose ? (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
      <div
        className="form-control app-input text-end mb-3 font-monospace"
        style={{ fontSize: '1.5rem', minHeight: '2.5rem' }}
      >
        {display}
      </div>
      <div className="row g-2 mb-2">
        {[7, 8, 9].map((n) => (
          <div key={n} className="col-3">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => inputDigit(n)}>
              {n}
            </button>
          </div>
        ))}
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => performOp('÷')}>
            ÷
          </button>
        </div>
      </div>
      <div className="row g-2 mb-2">
        {[4, 5, 6].map((n) => (
          <div key={n} className="col-3">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => inputDigit(n)}>
              {n}
            </button>
          </div>
        ))}
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => performOp('×')}>
            ×
          </button>
        </div>
      </div>
      <div className="row g-2 mb-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="col-3">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => inputDigit(n)}>
              {n}
            </button>
          </div>
        ))}
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => performOp('−')}>
            −
          </button>
        </div>
      </div>
      <div className="row g-2 mb-2">
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => inputDigit(0)}>
            0
          </button>
        </div>
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={inputDecimal}>
            .
          </button>
        </div>
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={equals}>
            =
          </button>
        </div>
        <div className="col-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => performOp('+')}>
            +
          </button>
        </div>
      </div>
      <div className="row g-2">
        <div className="col-6">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={clear}>
            Clear
          </button>
        </div>
        <div className="col-6">
          <button type="button" className="btn btn-outline-primary w-100" onClick={copyResult}>
            Copy result
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
