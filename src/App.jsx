import { Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import TransactionForm from './pages/TransactionForm'
import Budget from './pages/Budget'
import Reports from './pages/Reports'

const HIDE_NAV_PREFIXES = ['/transactions/new', '/transactions/edit']

function Inner() {
  const location = useLocation()
  const hideNav = HIDE_NAV_PREFIXES.some(p => location.pathname.startsWith(p))

  return (
    <div className="relative mx-auto flex flex-col min-h-svh w-full max-w-[430px] bg-[#0F172A] overflow-hidden">
      <Routes>
        <Route path="/"                       element={<Home />} />
        <Route path="/transactions"           element={<Transactions />} />
        <Route path="/transactions/new"       element={<TransactionForm />} />
        <Route path="/transactions/edit/:id"  element={<TransactionForm />} />
        <Route path="/budget"                 element={<Budget />} />
        <Route path="/reports"               element={<Reports />} />
      </Routes>

      {!hideNav && <BottomNav />}
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}
