import { formatCurrency } from '../utils/formatCurrency'

export default function ProgressBar({ label, emoji, spent, budget }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const over = budget > 0 && spent > budget
  const remaining = budget - spent

  return (
    <div className="bg-[#1E293B] rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium text-slate-200">{label}</span>
        </div>
        <span className={`text-xs font-semibold ${over ? 'text-red-400' : 'text-slate-400'}`}>
          {over ? `Over by ${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} left`}
        </span>
      </div>

      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-500' : pct > 75 ? 'bg-amber-400' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>Spent: {formatCurrency(spent)}</span>
        <span>Budget: {formatCurrency(budget)}</span>
      </div>
    </div>
  )
}
