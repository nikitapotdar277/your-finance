// Example frontend API helpers once you switch from localStorage to backend.
// You can move these into your React app later.

const API_BASE_URL = 'http://localhost:5001/api';

export async function fetchTransactions(monthKey) {
  const response = await fetch(`${API_BASE_URL}/transactions?monthKey=${monthKey}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

export async function createTransaction(payload) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create transaction');
  return response.json();
}

export async function deleteTransaction(id) {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete transaction');
}

export async function fetchMonthlySummary(monthKey) {
  const response = await fetch(`${API_BASE_URL}/summary?monthKey=${monthKey}`);
  if (!response.ok) throw new Error('Failed to fetch summary');
  return response.json();
}

export async function upsertOpeningBalance(payload) {
  const response = await fetch(`${API_BASE_URL}/opening-balances`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to save opening balance');
  return response.json();
}
