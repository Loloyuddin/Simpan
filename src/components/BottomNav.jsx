import { NavLink } from 'react-router-dom'
import { Home, ArrowLeftRight, PieChart, BarChart2 } from 'lucide-react'

const NAV = [
  { to: '/',            icon: Home,           label: 'Home' },
  { to: '/transactions',icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budget',      icon: PieChart,       label: 'Budget' },
  { to: '/reports',     icon: BarChart2,      label: 'Reports' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40
                    bg-[#1E293B] border-t border-slate-700/60
                    flex items-stretch"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors
             ${isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`
          }
        >
          <Icon size={20} strokeWidth={1.8} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
