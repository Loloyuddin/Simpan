import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getMonthKey, getMonthLabel } from '../utils/formatCurrency'
import { CATEGORIES } from '../utils/categories'
import ProgressBar from '../components/ProgressBar'
import EmptyState from '../components/EmptyState'
import PageShell from '../components/PageShell'

function prevMonth(key) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function nextMonth(key) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function Budget() {
  const { transactions, budgets, setBudget } = useApp()
  const [monthKey, setMonthKey] = useState(getMonthKey())
  const [editing, setEditing]   = useState(null) // category id
  const [inputVal, setInputVal] = useState('')

  const spent = useMemo(() => {
    const map = {}
    transactions
      .filter(t => t.type === 'expense' && getMonthKey(t.date) === monthKey)
      .forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount) })
    return map
  }, [transactions, monthKey])

  const monthBudgets = budgets[monthKey] || {}
  const expenseCategories = CATEGORIES.filter(c => c.type === 'both')

  function startEdit(catId) {
    setEditing(catId)
    setInputVal(String(monthBudgets[catId] || ''))
  }

  function saveEdit(catId) {
    const amount = parseFloat(inputVal)
    if (amount > 0) setBudget({ monthKey, category: catId, amount })
    setEditing(null)
  }

  const hasBudgets = Object.keys(monthBudgets).length > 0

  return (
    <PageShell title="Budget">
      {/* Month navigator */}
      <div className="flex items-center justify-between bg-[#1E293B] rounded-xl px-4 py-3 mb-4">
        <button onClick={() => setMonthKey(prevMonth(monthKey))} className="p-1 text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-200">{getMonthLabel(monthKey)}</span>
        <button
          onClick={() => setMonthKey(nextMonth(monthKey))}
          disabled={monthKey >= getMonthKey()}
          className="p-1 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Budget items */}
      <div className="space-y-3 mb-6">
        {expenseCategories.map(cat => {
          const budget  = monthBudgets[cat.id] || 0
          const catSpent = spent[cat.id] || 0
          const isEditing = editing === cat.id

          return (
            <div key={cat.id}>
              {budget > 0 ? (
                <div
                  className="cursor-pointer"
                  onClick={() => !isEditing && startEdit(cat.id)}
                >
                  <ProgressBar
                    label={cat.label}
                    emoji={cat.emoji}
                    spent={catSpent}
                    budget={budget}
                  />
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 bg-[#1E293B] rounded-xl p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                  onClick={() => !isEditing && startEdit(cat.id)}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300">{cat.label}</p>
                    <p className="text-xs text-slate-500">Tap to set budget</p>
                  </div>
                  <span className="text-xs text-slate-500">{catSpent > 0 ? `Spent RM ${catSpent.toFixed(2)}` : 'No budget set'}</span>
                </div>
              )}

              {/* Inline edit */}
              {isEditing && (
                <div className="mt-2 flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2 border border-indigo-500/50 animate-slide-up">
                  <span className="text-slate-400 text-sm font-medium">RM</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    autoFocus
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditing(null) }}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-slate-100 text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors"
                  >
                    <Check size={14} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!hasBudgets && (
        <EmptyState icon="🎯" title="No budgets set" subtitle="Tap any category above to set a monthly budget" />
      )}
    </PageShell>
  )
}
