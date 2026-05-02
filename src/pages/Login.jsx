import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError('Sign-in cancelled or failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh w-full max-w-[430px] mx-auto bg-[#0F172A]
                    flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <span className="text-6xl">💰</span>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Simpan</h1>
        <p className="text-slate-400 text-sm text-center">
          Your private money manager.<br />Sign in to sync across all your devices.
        </p>
      </div>

      {/* Google button */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3
                   bg-white hover:bg-slate-100 active:scale-95
                   text-slate-800 font-semibold text-sm
                   py-3.5 rounded-2xl shadow-lg
                   transition-all duration-150 disabled:opacity-60"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
        ) : (
          <GoogleLogo />
        )}
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      {error && (
        <p className="mt-4 text-red-400 text-xs text-center">{error}</p>
      )}

      <p className="mt-8 text-slate-600 text-xs text-center px-4">
        Your data is stored privately in the cloud and never shared.
      </p>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
