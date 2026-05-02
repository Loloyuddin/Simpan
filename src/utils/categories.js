export const CATEGORIES = [
  { id: 'food',          label: 'Food',          labelBM: 'Makanan',         emoji: '🍔', type: 'both' },
  { id: 'transport',     label: 'Transport',     labelBM: 'Pengangkutan',    emoji: '🚗', type: 'both' },
  { id: 'shopping',      label: 'Shopping',      labelBM: 'Membeli-belah',   emoji: '🛍️', type: 'both' },
  { id: 'health',        label: 'Health',        labelBM: 'Kesihatan',       emoji: '💊', type: 'both' },
  { id: 'entertainment', label: 'Entertainment', labelBM: 'Hiburan',         emoji: '🎮', type: 'both' },
  { id: 'salary',        label: 'Salary',        labelBM: 'Gaji',            emoji: '💰', type: 'income' },
  { id: 'freelance',     label: 'Freelance',     labelBM: 'Bebas',           emoji: '💻', type: 'income' },
  { id: 'others',        label: 'Others',        labelBM: 'Lain-lain',       emoji: '📦', type: 'both' },
]

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}

export function getCategoriesForType(type) {
  return CATEGORIES.filter(c => c.type === 'both' || c.type === type)
}
