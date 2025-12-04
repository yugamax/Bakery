"use client";
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useUserProfile } from '../../lib/user'

export default function CheckoutPage() {
  const [note, setNote] = useState('')
  const [popup, setPopup] = useState(false)
  const { profile } = useUserProfile()

  async function placeOrder() {
    await addDoc(collection(db, 'orders'), {
      items: [], // TODO: wire cart items
      total: 0,  // TODO: compute from cart
      status: 'Placed',
      createdAt: Date.now(),
      note,
      user: {
        uid: profile?.uid,
        name: profile?.name,
        phone: profile?.phone,
        address: profile?.address,
        email: profile?.email || null,
      }
    })
    setPopup(true)
    setTimeout(()=>setPopup(false), 3000)
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Checkout</h2>
      <textarea className="w-full border p-2" placeholder="Notes for Aditi" value={note} onChange={e=>setNote(e.target.value)} />
      <button onClick={placeOrder} className="mt-4 px-4 py-2 bg-forest text-cream rounded">Place Order</button>

      {popup && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center animate-fade">
          <div className="bg-cream text-forest p-6 rounded shadow-xl">
            <p className="font-display text-xl">Thank you for your order! Aditi's Bakery will contact you shortly to confirm delivery details.</p>
          </div>
        </div>
      )}
    </div>
  )
}
