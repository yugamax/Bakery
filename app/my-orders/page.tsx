"use client";
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface Order { id: string; status: string; total: number; createdAt: number }

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(()=>{
    const q = query(collection(db, 'orders'), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d=>({id:d.id, ...(d.data() as any)})))
    })
    return ()=>unsub()
  },[])

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">My Orders</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th>Order</th><th>Status</th><th>Total</th><th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o=> (
            <tr key={o.id} className="border-t">
              <td>{o.id}</td>
              <td>{o.status}</td>
              <td>₹{o.total}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
