import { Trash2, Pencil } from 'lucide-react'
import { getCategoryById } from '../utils/categories'
import { formatCurrency, formatDate } from '../utils/formatCurrency'

export default function TransactionCard({ tx, onDelete, onEdit, showActions = true }) {
  const cat = getCategoryById(tx.category)
  const isIncome = tx.type === 'income'

  return (
    <div className="flex items-center gap-3 bg-[#1E293B] rounded-xl px-4 py-3 animate-slide-up">
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-slate-700/70 flex items-center justify-center text-xl shrink-0">
        {cat.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100 truncate">
          {tx.note || cat.label}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {cat.label} · {formatDate(tx.date)}
        </p>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-sm font-semibold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
        </span>

        {showActions && (
          <div className="flex gap-1 ml-1">
            <button
              onClick={() => onEdit?.(tx)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors"
              aria-label="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete?.(tx.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
