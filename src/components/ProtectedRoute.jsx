import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()

  // Still checking auth state — show nothing to avoid flash
  if (currentUser === undefined) {
    return (
      <div className="min-h-svh w-full max-w-[430px] mx-auto bg-[#0F172A]
                      flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}
