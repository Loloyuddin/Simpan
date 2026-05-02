import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FAB() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/transactions/new')}
      aria-label="Add transaction"
      className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full
                 bg-indigo-500 hover:bg-indigo-400 active:scale-95
                 flex items-center justify-center shadow-lg shadow-indigo-500/40
                 transition-all duration-150"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <Plus size={26} strokeWidth={2.5} className="text-white" />
    </button>
  )
}
