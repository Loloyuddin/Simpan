import { Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import Login from './pages/Login'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import TransactionForm from './pages/TransactionForm'
import Budget from './pages/Budget'
import Reports from './pages/Reports'

const HIDE_NAV_PREFIXES = ['/transactions/new', '/transactions/edit']

// Single layout wrapping all protected pages — one AppProvider, one set of listeners
function ProtectedLayout() {
  const { currentUser } = useAuth()
  const location = useLocation()

  // Still resolving auth state
  if (currentUser === undefined) {
    return (
      <div className="min-h-svh w-full max-w-[430px] mx-auto bg-[#0F172A] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentUser) return <Navigate to="/login" replace />

  const hideNav = HIDE_NAV_PREFIXES.some(p => location.pathname.startsWith(p))

  return (
    <AppProvider uid={currentUser.uid}>
      <div className="relative mx-auto flex flex-col min-h-svh w-full max-w-[430px] bg-[#0F172A] overflow-hidden">
        <Outlet />
        {!hideNav && <BottomNav />}
        <Toast />
      </div>
    </AppProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="relative mx-auto flex flex-col min-h-svh w-full max-w-[430px] bg-[#0F172A] overflow-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/"                      element={<Home />} />
            <Route path="/transactions"          element={<Transactions />} />
            <Route path="/transactions/new"      element={<TransactionForm />} />
            <Route path="/transactions/edit/:id" element={<TransactionForm />} />
            <Route path="/budget"                element={<Budget />} />
            <Route path="/reports"               element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}
