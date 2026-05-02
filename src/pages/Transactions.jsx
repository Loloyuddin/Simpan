import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getMonthKey, getMonthLabel } from '../utils/formatCurrency'
import { CATEGORIES } from '../utils/categories'
import TransactionCard from '../components/TransactionCard'
import EmptyState from '../components/EmptyState'
import FAB from '../components/FAB'
import PageShell from '../components/PageShell'

function buildMonthOptions(transactions) {
  const keys = [...new Set(transactions.map(t => getMonthKey(t.date)))].sort().reverse()
  return keys.map(k => ({ value: k, label: getMonthLabel(k) }))
}

export default function Transactions() {
  const navigate = useNavigate()
  const { transactions, deleteTransaction } = useApp()

  const [monthKey, setMonthKey]     = useState(getMonthKey())
  const [category, setCategory]     = useState('all')
  const [search, setSearch]         = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const monthOptions = useMemo(() => buildMonthOptions(transactions), [transactions])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return transactions
      .filter(t => getMonthKey(t.date) === monthKey)
      .filter(t => category === 'all' || t.category === category)
      .filter(t => !q || t.note?.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [transactions, monthKey, category, search])

  function handleDelete(id) {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id)
  }

  return (
    <PageShell
      title="Transactions"
      right={
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      }
    >
      {/* Search bar */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions…"
          className="w-full bg-[#1E293B] text-slate-200 text-sm rounded-xl pl-9 pr-9 py-2.5
                     placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-indigo-500"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-3 space-y-2 animate-slide-up">
          <select
            value={monthKey}
            onChange={e => setMonthKey(e.target.value)}
            className="w-full bg-[#1E293B] text-slate-200 text-sm rounded-xl px-3 py-2.5
                       border border-slate-700 focus:outline-none focus:border-indigo-500"
          >
            {monthOptions.length === 0 && <option value={getMonthKey()}>{getMonthLabel(getMonthKey())}</option>}
            {monthOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${category === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              All
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${category === c.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month label when filters hidden */}
      {!showFilters && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-3">
          {monthOptions.slice(0, 6).map(o => (
            <button
              key={o.value}
              onClick={() => setMonthKey(o.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${monthKey === o.value ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No transactions found" subtitle="Try adjusting your filters" />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(tx => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              onDelete={handleDelete}
              onEdit={() => navigate(`/transactions/edit/${tx.id}`)}
            />
          ))}
        </div>
      )}

      <FAB />
    </PageShell>
  )
}
