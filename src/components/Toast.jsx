import { useApp } from '../context/AppContext'
import { CheckCircle, XCircle, Info } from 'lucide-react'

const ICONS = {
  success: <CheckCircle size={16} className="text-green-400 shrink-0" />,
  error:   <XCircle    size={16} className="text-red-400 shrink-0" />,
  info:    <Info       size={16} className="text-blue-400 shrink-0" />,
}

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]
                    flex items-center gap-2 px-4 py-3 rounded-xl
                    bg-slate-800 border border-slate-700 shadow-xl
                    text-sm text-slate-100 whitespace-nowrap animate-toast-in"
         style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}>
      {ICONS[toast.variant] ?? ICONS.success}
      {toast.message}
    </div>
  )
}
