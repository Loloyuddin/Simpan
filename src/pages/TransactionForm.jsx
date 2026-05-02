import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { todayStr } from '../utils/formatCurrency'
import { getCategoriesForType } from '../utils/categories'
import CategoryPicker from '../components/CategoryPicker'

const DEFAULT_FORM = {
  type: 'expense',
  amount: '',
  category: 'food',
  date: todayStr(),
  note: '',
}

export default function TransactionForm() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const isEdit    = Boolean(id)

  const { transactions, addTransaction, updateTransaction } = useApp()

  const [form, setForm] = useState(DEFAULT_FORM)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      const tx = transactions.find(t => t.id === id)
      if (tx) setForm({ type: tx.type, amount: String(tx.amount), category: tx.category, date: tx.date, note: tx.note || '' })
      else navigate('/transactions', { replace: true })
    }
  }, [id, isEdit, transactions, navigate])

  // Reset category when type changes if current category not valid
  function handleTypeChange(type) {
    const valid = getCategoriesForType(type).map(c => c.id)
    setForm(f => ({
      ...f,
      type,
      category: valid.includes(f.category) ? f.category : valid[0],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) { setError('Please enter a valid amount'); return }
    setError('')

    const payload = { type: form.type, amount, category: form.category, date: form.date, note: form.note.trim() }
    if (isEdit) {
      updateTransaction({ id, ...payload })
    } else {
      addTransaction(payload)
    }
    navigate(-1)
  }

  return (
    <div className="flex flex-col flex-1 pt-12 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-100 flex-1">
          {isEdit ? 'Edit Transaction' : 'Add Transaction'}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-5"
            style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom,0px))' }}>

        {/* Type toggle */}
        <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
          {['expense', 'income'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors
                ${form.type === t
                  ? t === 'income' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount (MYR)</label>
          <div className="flex items-center bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden
                          focus-within:border-indigo-500 transition-colors">
            <span className="px-3 text-slate-400 text-sm font-medium">RM</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
              className="flex-1 bg-transparent text-slate-100 text-2xl font-bold py-3 pr-3 focus:outline-none placeholder-slate-700"
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
          <CategoryPicker type={form.type} value={form.category} onChange={cat => setForm(f => ({ ...f, category: cat }))} />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full bg-[#1E293B] text-slate-200 text-sm rounded-xl px-3 py-2.5
                       border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Note <span className="text-slate-600">(optional)</span></label>
          <input
            type="text"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="e.g. Lunch with friends"
            maxLength={120}
            className="w-full bg-[#1E293B] text-slate-200 text-sm rounded-xl px-3 py-2.5
                       border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400
                     active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-indigo-500/30"
        >
          <Check size={18} strokeWidth={2.5} />
          {isEdit ? 'Save Changes' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}
