import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { generateId } from '../utils/generateId'
import { SEED_TRANSACTIONS } from '../utils/seedData'
import { getMonthKey } from '../utils/formatCurrency'

const LS_TRANSACTIONS = 'mm_transactions'
const LS_BUDGETS      = 'mm_budgets'
const LS_SETTINGS     = 'mm_settings'
const LS_SEEDED       = 'mm_seeded'

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ── initial state ────────────────────────────────────────────────────────────
function buildInitial() {
  let transactions = readLS(LS_TRANSACTIONS, null)
  const seeded = readLS(LS_SEEDED, false)
  if (!seeded || transactions === null) {
    transactions = SEED_TRANSACTIONS
    writeLS(LS_TRANSACTIONS, transactions)
    writeLS(LS_SEEDED, true)
  }
  return {
    transactions,
    budgets:  readLS(LS_BUDGETS,  {}),
    settings: readLS(LS_SETTINGS, { currency: 'MYR', name: 'User' }),
    toast: null,
  }
}

// ── reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'ADD_TRANSACTION': {
      const tx = { ...action.payload, id: generateId(), createdAt: new Date().toISOString() }
      const transactions = [tx, ...state.transactions]
      writeLS(LS_TRANSACTIONS, transactions)
      return { ...state, transactions }
    }

    case 'UPDATE_TRANSACTION': {
      const transactions = state.transactions.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      )
      writeLS(LS_TRANSACTIONS, transactions)
      return { ...state, transactions }
    }

    case 'DELETE_TRANSACTION': {
      const transactions = state.transactions.filter(t => t.id !== action.payload)
      writeLS(LS_TRANSACTIONS, transactions)
      return { ...state, transactions }
    }

    case 'SET_BUDGET': {
      const { monthKey, category, amount } = action.payload
      const budgets = {
        ...state.budgets,
        [monthKey]: { ...(state.budgets[monthKey] || {}), [category]: amount },
      }
      writeLS(LS_BUDGETS, budgets)
      return { ...state, budgets }
    }

    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.payload }
      writeLS(LS_SETTINGS, settings)
      return { ...state, settings }
    }

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }

    case 'HIDE_TOAST':
      return { ...state, toast: null }

    default:
      return state
  }
}

// ── context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitial)

  const showToast = useCallback((message, variant = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, variant } })
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000)
  }, [])

  // helpers so consumers don't have to know action names
  const addTransaction    = useCallback((tx) => { dispatch({ type: 'ADD_TRANSACTION',    payload: tx });           showToast('Transaction added') },    [showToast])
  const updateTransaction = useCallback((tx) => { dispatch({ type: 'UPDATE_TRANSACTION', payload: tx });           showToast('Transaction updated') },  [showToast])
  const deleteTransaction = useCallback((id) => { dispatch({ type: 'DELETE_TRANSACTION', payload: id });           showToast('Transaction deleted', 'error') }, [showToast])
  const setBudget         = useCallback((p)  => { dispatch({ type: 'SET_BUDGET',         payload: p });            showToast('Budget saved') },          [showToast])
  const updateSettings    = useCallback((p)  => { dispatch({ type: 'UPDATE_SETTINGS',    payload: p }) },          [])

  return (
    <AppContext.Provider value={{
      ...state,
      addTransaction, updateTransaction, deleteTransaction,
      setBudget, updateSettings, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

// Derived helpers
export function useMonthTransactions(monthKey) {
  const { transactions } = useApp()
  return transactions.filter(t => getMonthKey(t.date) === monthKey)
}
