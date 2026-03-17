# Finance Tracker Backend

This backend adds:
- Express API
- MongoDB persistence
- transaction CRUD
- opening balance storage
- monthly summary endpoint using the same math as the frontend

## Run locally

1. Copy `.env.example` to `.env`
2. Make sure MongoDB is running locally or use Atlas
3. Install deps
4. Start the server

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Endpoints

### Health
- `GET /api/health`

### Transactions
- `GET /api/transactions?monthKey=2026-03`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

Example body:

```json
{
  "date": "2026-03-15T00:00:00.000Z",
  "monthKey": "2026-03",
  "type": "card_payment",
  "category": "Card Payment",
  "fromAccount": "Checking",
  "toAccount": "Discover",
  "amount": 2528,
  "notes": "Paid last statement"
}
```

### Opening balances
- `GET /api/opening-balances?monthKey=2026-03`
- `PUT /api/opening-balances`

Example body:

```json
{
  "monthKey": "2026-03",
  "account": "Discover",
  "amount": 2528
}
```

### Monthly summary
- `GET /api/summary?monthKey=2026-03`

## Math

- Spending = sum(type === "expense")
- Income = sum(type === "income")
- Reimbursements = sum(type === "reimbursement")
- Net Spend = spending - reimbursements
- Net Inflow = income + reimbursements - spending
- Card Closing Balance = opening + new charges - payments
