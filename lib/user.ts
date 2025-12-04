"use client";
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export interface UserProfile {
  uid: string
  email?: string|null
  name: string
  phone: string
  address: string
  role?: 'customer'|'admin'
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (user)=>{
      if (!user) { setProfile(null); setLoading(false); return }
      const snap = await getDoc(doc(db,'users', user.uid))
      const data = snap.data() as any
      setProfile({
        uid: user.uid,
        email: user.email,
        name: data?.name || '',
        phone: data?.phone || '',
        address: data?.address || '',
        role: data?.role || 'customer'
      })
      setLoading(false)
    })
    return ()=>unsub()
  }, [])

  return { profile, loading }
}
