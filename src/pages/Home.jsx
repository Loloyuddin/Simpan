import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Wallet, ChevronRight, LogOut } from 'lucide-react'
import { useApp, useMonthTransactions } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, getMonthKey, getMonthLabel } from '../utils/formatCurrency'
import TransactionCard from '../components/TransactionCard'
import EmptyState from '../components/EmptyState'
import FAB from '../components/FAB'

function SummaryChip({ icon: Icon, label, amount, color }) {
  return (
    <div className="flex-1 bg-slate-800/60 rounded-xl p-3 flex flex-col gap-1">
      <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
        <Icon size={13} strokeWidth={2} />
        {label}
      </div>
      <p className={`text-base font-bold ${color}`}>{formatCurrency(amount)}</p>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { deleteTransaction } = useApp()
  const { currentUser, signOut } = useAuth()
  const [showSignOut, setShowSignOut] = useState(false)

  const monthKey  = getMonthKey()
  const monthTxns = useMonthTransactions(monthKey)

  const { income, expense, balance } = useMemo(() => {
    let income = 0, expense = 0
    for (const t of monthTxns) {
      if (t.type === 'income') income  += Number(t.amount)
      else                     expense += Number(t.amount)
    }
    return { income, expense, balance: income - expense }
  }, [monthTxns])

  const recent = useMemo(() =>
    [...monthTxns]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10),
    [monthTxns]
  )

  function handleDelete(id) {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id)
  }

  const firstName = currentUser?.displayName?.split(' ')[0] ?? 'there'
  const photoURL  = currentUser?.photoURL

  return (
    <div className="flex flex-col flex-1 pt-12 pb-4 animate-fade-in">
      {/* Header row */}
      <div className="px-4 mb-4 flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">Good {greeting()}, {firstName} 👋</p>
          <p className="text-slate-100 font-semibold text-lg">{getMonthLabel(monthKey)}</p>
        </div>

        {/* Avatar / sign-out */}
        <div className="relative">
          <button
            onClick={() => setShowSignOut(v => !v)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-600 hover:border-indigo-400 transition-colors"
            aria-label="Account menu"
          >
            {photoURL
              ? <img src={photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {firstName[0].toUpperCase()}
                </div>
            }
          </button>

          {showSignOut && (
            <div className="absolute right-0 top-11 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-xs font-medium text-slate-200 truncate">{currentUser.displayName}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
              </div>
              <button
                onClick={() => { setShowSignOut(false); signOut() }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Balance card */}
      <div className="mx-4 mb-4 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 shadow-lg shadow-indigo-900/40">
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={16} className="text-indigo-200" />
          <span className="text-indigo-200 text-xs font-medium">Total Balance</span>
        </div>
        <p className="text-white text-3xl font-bold tracking-tight mb-4">
          {formatCurrency(balance)}
        </p>
        <div className="flex gap-3">
          <SummaryChip icon={TrendingUp}   label="Income"  amount={income}  color="text-green-400" />
          <SummaryChip icon={TrendingDown} label="Expense" amount={expense} color="text-red-400"   />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-4 flex-1 overflow-y-auto no-scrollbar"
           style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom,0px))' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300">Recent Transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-0.5 text-xs text-indigo-400 font-medium"
          >
            View all <ChevronRight size={13} />
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState icon="💸" title="No transactions yet" subtitle="Tap the + button to add your first transaction" />
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map(tx => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                onDelete={handleDelete}
                onEdit={() => navigate(`/transactions/edit/${tx.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Close sign-out dropdown when clicking outside */}
      {showSignOut && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSignOut(false)} />
      )}

      <FAB />
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning ☀️'
  if (h < 17) return 'afternoon 🌤️'
  return 'evening 🌙'
}
