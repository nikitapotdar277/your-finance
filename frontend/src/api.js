const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function normalizeTransaction(t) {
  if (!t) return t;
  const raw =
    typeof t.date === 'string' ? t.date : t.date?.toISOString?.();
  const date = raw ? raw.slice(0, 10) : t.date;
  return { ...t, id: t._id ?? t.id, date };
}

export function openingBalancesArrayToByMonth(arr) {
  const byMonth = {};
  (arr || []).forEach(({ monthKey, account, amount }) => {
    if (!byMonth[monthKey]) byMonth[monthKey] = {};
    byMonth[monthKey][account] = amount;
  });
  return byMonth;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || res.statusText || 'Request failed');
  }
  if (res.status === 204) return;
  return res.json();
}

export async function login(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return request('/api/auth/me');
}

export async function getTransactions(monthKey) {
  const query = monthKey ? `?monthKey=${encodeURIComponent(monthKey)}` : '';
  const list = await request(`/api/transactions${query}`);
  return (list || []).map(normalizeTransaction);
}

export async function createTransaction(payload) {
  const body = {
    date: payload.date,
    monthKey: payload.date.slice(0, 7),
    type: payload.type,
    category: payload.category,
    fromAccount: payload.fromAccount,
    toAccount: payload.toAccount ?? '',
    amount: Number(payload.amount),
    notes: payload.notes ?? '',
  };
  const created = await request('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return normalizeTransaction(created);
}

export async function updateTransaction(id, payload) {
  const body = {
    date: payload.date,
    monthKey: payload.date.slice(0, 7),
    type: payload.type,
    category: payload.category,
    fromAccount: payload.fromAccount,
    toAccount: payload.toAccount ?? '',
    amount: Number(payload.amount),
    notes: payload.notes ?? '',
  };
  const updated = await request(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return normalizeTransaction(updated);
}

export async function deleteTransaction(id) {
  await request(`/api/transactions/${id}`, { method: 'DELETE' });
}

export async function getOpeningBalances(monthKey) {
  const query = monthKey ? `?monthKey=${encodeURIComponent(monthKey)}` : '';
  return request(`/api/opening-balances${query}`);
}

export async function upsertOpeningBalance(monthKey, account, amount) {
  return request('/api/opening-balances', {
    method: 'PUT',
    body: JSON.stringify({ monthKey, account, amount: Number(amount) }),
  });
}

function normalizePlannedTransaction(pt) {
  if (!pt) return pt;
  return { ...pt, id: pt._id ?? pt.id };
}

export async function getPlannedTransactions(monthKey) {
  const query = monthKey ? `?monthKey=${encodeURIComponent(monthKey)}` : '';
  const list = await request(`/api/planned-transactions${query}`);
  return (list || []).map(normalizePlannedTransaction);
}

export async function createPlannedTransaction(payload) {
  const body = {
    monthKey: payload.monthKey,
    type: payload.type,
    category: payload.category,
    fromAccount: payload.fromAccount,
    amount: Number(payload.amount),
    notes: payload.notes ?? '',
  };
  const created = await request('/api/planned-transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return normalizePlannedTransaction(created);
}

export async function updatePlannedTransaction(id, payload) {
  const body = {
    monthKey: payload.monthKey,
    type: payload.type,
    category: payload.category,
    fromAccount: payload.fromAccount,
    amount: Number(payload.amount),
    notes: payload.notes ?? '',
  };
  const updated = await request(`/api/planned-transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return normalizePlannedTransaction(updated);
}

export async function deletePlannedTransaction(id) {
  await request(`/api/planned-transactions/${id}`, { method: 'DELETE' });
}

export { normalizeTransaction };
