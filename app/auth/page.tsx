"use client";
import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string|undefined>()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
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
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-4 mb-4">
        <button className={`px-3 py-2 rounded ${mode==='signup'?'bg-forest text-cream':'border border-forest'}`} onClick={()=>setMode('signup')}>Sign Up</button>
        <button className={`px-3 py-2 rounded ${mode==='login'?'bg-forest text-cream':'border border-forest'}`} onClick={()=>setMode('login')}>Login</button>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        {mode==='signup' && (
          <>
            <input required placeholder="Full Name" className="w-full border p-2" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value)} />
            <input required placeholder="Phone Number" className="w-full border p-2" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setPhone(e.target.value)} />
            <textarea required placeholder="Delivery Address" className="w-full border p-2" value={address} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setAddress(e.target.value)} />
            <p className="text-xs text-slate">Email optional. If omitted, a private login identifier is generated.</p>
          </>
        )}
        <input placeholder="Email (optional for signup)" className="w-full border p-2" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border p-2" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} />
        {error && <p className="text-rose text-sm">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-forest text-cream rounded w-full">{mode==='signup'?'Create Account':'Login'}</button>
      </form>
    </div>
  )
}
