import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc, setDoc,
  onSnapshot, getDocs, query, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { SEED_TRANSACTIONS } from '../utils/seedData'
import { getMonthKey } from '../utils/formatCurrency'

// ── reducer (pure — no side effects, no storage) ────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS': return { ...state, transactions: action.payload }
    case 'SET_BUDGETS':      return { ...state, budgets:      action.payload }
    case 'SET_SETTINGS':     return { ...state, settings:     action.payload }
    case 'SHOW_TOAST':       return { ...state, toast: action.payload }
    case 'HIDE_TOAST':       return { ...state, toast: null }
    default:                 return state
  }
}

const INITIAL_STATE = {
  transactions: [],
  budgets:      {},
  settings:     { currency: 'MYR', name: 'User' },
  toast:        null,
  loading:      true,
}

// ── context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ uid, children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  // ── toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((message, variant = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, variant } })
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000)
  }, [])

  // ── Firestore path helpers ─────────────────────────────────────────────────
  const txCol       = () => collection(db, 'users', uid, 'transactions')
  const txDoc       = (id) => doc(db, 'users', uid, 'transactions', id)
  const budgetDoc   = (mk) => doc(db, 'users', uid, 'budgets', mk)
  const settingsDoc = ()   => doc(db, 'users', uid, 'settings', 'prefs')

  // ── Real-time listeners ────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return

    // Transactions
    const unsubTx = onSnapshot(
      query(txCol(), orderBy('createdAt', 'desc')),
      async (snap) => {
        // Seed on first sign-in if collection is empty
        if (snap.empty) {
          await Promise.all(
            SEED_TRANSACTIONS.map(({ id: _id, ...tx }) => addDoc(txCol(), tx))
          )
          return
        }
        const txns = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        dispatch({ type: 'SET_TRANSACTIONS', payload: txns })
      }
    )

    // Budgets
    const unsubBudgets = onSnapshot(
      collection(db, 'users', uid, 'budgets'),
      (snap) => {
        const budgets = {}
        snap.docs.forEach(d => { budgets[d.id] = d.data() })
        dispatch({ type: 'SET_BUDGETS', payload: budgets })
      }
    )

    // Settings
    const unsubSettings = onSnapshot(settingsDoc(), (snap) => {
      if (snap.exists()) {
        dispatch({ type: 'SET_SETTINGS', payload: snap.data() })
      }
    })

    return () => { unsubTx(); unsubBudgets(); unsubSettings() }
  }, [uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD helpers ───────────────────────────────────────────────────────────
  const addTransaction = useCallback(async (tx) => {
    await addDoc(txCol(), { ...tx, createdAt: new Date().toISOString() })
    showToast('Transaction added')
  }, [uid, showToast]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateTransaction = useCallback(async (tx) => {
    const { id, ...data } = tx
    await updateDoc(txDoc(id), data)
    showToast('Transaction updated')
  }, [uid, showToast]) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteTransaction = useCallback(async (id) => {
    await deleteDoc(txDoc(id))
    showToast('Transaction deleted', 'error')
  }, [uid, showToast]) // eslint-disable-line react-hooks/exhaustive-deps

  const setBudget = useCallback(async ({ monthKey, category, amount }) => {
    await setDoc(budgetDoc(monthKey), { [category]: amount }, { merge: true })
    showToast('Budget saved')
  }, [uid, showToast]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateSettings = useCallback(async (prefs) => {
    await setDoc(settingsDoc(), prefs, { merge: true })
  }, [uid]) // eslint-disable-line react-hooks/exhaustive-deps

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

export function useMonthTransactions(monthKey) {
  const { transactions } = useApp()
  return transactions.filter(t => getMonthKey(t.date) === monthKey)
}
