import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { getMonthKey, getMonthLabel, formatCurrency } from '../utils/formatCurrency'
import { CATEGORIES, getCategoryById } from '../utils/categories'
import PageShell from '../components/PageShell'
import EmptyState from '../components/EmptyState'

const PIE_COLORS = [
  '#6366f1','#22c55e','#ef4444','#f59e0b','#3b82f6','#ec4899','#14b8a6','#a855f7',
]

function last6Months() {
  const keys = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200">
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ color: p.color }}>●</span>
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const { transactions } = useApp()
  const currentMonth = getMonthKey()

  // Pie: current month expense by category
  const pieData = useMemo(() => {
    const map = {}
    transactions
      .filter(t => t.type === 'expense' && getMonthKey(t.date) === currentMonth)
      .forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount) })
    return Object.entries(map)
      .map(([id, value]) => ({ name: getCategoryById(id).label, value, emoji: getCategoryById(id).emoji }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, currentMonth])

  // Bar: last 6 months income vs expense
  const barData = useMemo(() => {
    return last6Months().map(key => {
      const txns = transactions.filter(t => getMonthKey(t.date) === key)
      const income  = txns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
      const [, m] = key.split('-')
      const label = new Date(2000, Number(m) - 1).toLocaleString('en', { month: 'short' })
      return { label, income, expense }
    })
  }, [transactions])

  const totalExpense = pieData.reduce((s, d) => s + d.value, 0)

  return (
    <PageShell title="Reports">
      {/* Pie chart */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-slate-400 mb-3">
          Spending Breakdown · {getMonthLabel(currentMonth)}
        </h2>

        {pieData.length === 0 ? (
          <EmptyState icon="🍩" title="No expense data" subtitle="Add some expenses to see the breakdown" />
        ) : (
          <div className="bg-[#1E293B] rounded-2xl p-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-2 mt-2">
              {pieData.map((d, i) => {
                const pct = totalExpense > 0 ? ((d.value / totalExpense) * 100).toFixed(1) : '0'
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-base">{d.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{d.name}</span>
                        <span className="text-slate-400">{pct}% · {formatCurrency(d.value)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Bar chart */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-slate-400 mb-3">Income vs Expense · Last 6 Months</h2>
        <div className="bg-[#1E293B] rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={12} barGap={4}>
              <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="income"  name="Income"  fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Income</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Expense</span>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
