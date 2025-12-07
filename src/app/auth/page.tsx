"use client";
import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string|undefined>()
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setError(undefined)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: result.user.displayName || 'User',
          phone: phone || '',
          address: address || '',
          email: result.user.email,
          createdAt: Date.now(),
          role: 'customer'
        })
      }
      
      location.href = '/products'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email || `${Date.now()}@aditis-bakery.local`, password || Math.random().toString(36).slice(2))
        await setDoc(doc(db, 'users', cred.user.uid), {
          name, phone, address, email: email || null, createdAt: Date.now(), role: 'customer'
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      location.href = '/products'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-forest/10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl text-forest mb-2">
            {mode === 'signup' ? 'Join Aditi\'s Bakery' : 'Welcome Back'}
          </h2>
          <p className="text-slate text-sm">
            {mode === 'signup' 
              ? 'Create an account to start ordering delicious treats' 
              : 'Sign in to continue your bakery journey'}
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-forest/20 rounded-xl hover:bg-forest/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-forest">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-forest/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate">or</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 bg-cream p-1 rounded-xl">
          <button 
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              mode === 'signup'
                ? 'bg-forest text-cream shadow-md'
                : 'text-forest hover:bg-forest/5'
            }`} 
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
          <button 
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              mode === 'login'
                ? 'bg-forest text-cream shadow-md'
                : 'text-forest hover:bg-forest/5'
            }`} 
            onClick={() => setMode('login')}
          >
            Login
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Full Name</label>
                <input 
                  required 
                  placeholder="Enter your name" 
                  className="w-full border-2 border-forest/20 rounded-xl p-3 focus:outline-none focus:border-forest transition-colors" 
                  value={name} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Phone Number</label>
                <input 
                  required 
                  placeholder="10-digit mobile number" 
                  className="w-full border-2 border-forest/20 rounded-xl p-3 focus:outline-none focus:border-forest transition-colors" 
                  value={phone} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Delivery Address</label>
                <textarea 
                  required 
                  placeholder="Street address, apartment, city, pincode" 
                  className="w-full border-2 border-forest/20 rounded-xl p-3 focus:outline-none focus:border-forest transition-colors min-h-[80px]" 
                  value={address} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)} 
                />
              </div>
              <p className="text-xs text-slate bg-cream p-2 rounded-lg">
                💡 Email is optional. If omitted, we'll create a secure account for you.
              </p>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-forest mb-1.5">
              Email {mode === 'signup' && <span className="text-slate text-xs">(optional)</span>}
            </label>
            <input 
              type="email"
              placeholder="your@email.com" 
              className="w-full border-2 border-forest/20 rounded-xl p-3 focus:outline-none focus:border-forest transition-colors" 
              value={email} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
              required={mode === 'login'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-forest mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="Create a secure password" 
              className="w-full border-2 border-forest/20 rounded-xl p-3 focus:outline-none focus:border-forest transition-colors" 
              value={password} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
              required={mode === 'login'}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-rose/10 border-2 border-rose/30 rounded-xl">
              <p className="text-rose text-sm">{error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-3.5 bg-forest text-cream rounded-xl font-medium hover:bg-forest-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'signup' ? '🎂 Create Account' : '🔓 Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate mt-6">
          {mode === 'signup' ? 'Already have an account?' : 'New to Aditi\'s Bakery?'}
          {' '}
          <button 
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-forest font-medium hover:underline"
          >
            {mode === 'signup' ? 'Login' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
