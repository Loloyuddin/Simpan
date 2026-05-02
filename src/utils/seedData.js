import { generateId } from './generateId'
import { todayStr } from './formatCurrency'

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const SEED_TRANSACTIONS = [
  {
    id: generateId(),
    type: 'income',
    amount: 4500,
    category: 'salary',
    date: daysAgo(20),
    note: 'Monthly salary',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 320.50,
    category: 'food',
    date: daysAgo(5),
    note: 'Groceries at Aeon',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 88,
    category: 'transport',
    date: daysAgo(3),
    note: 'Petrol & Touch n Go',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 199,
    category: 'entertainment',
    date: daysAgo(2),
    note: 'Netflix & Spotify',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: generateId(),
    type: 'income',
    amount: 750,
    category: 'freelance',
    date: daysAgo(1),
    note: 'Logo design project',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]
