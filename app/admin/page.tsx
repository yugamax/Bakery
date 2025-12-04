"use client";
import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useUserProfile } from '../../lib/user'

interface Product { id?: string; name: string; price: number; description?: string; imageUrl?: string }
interface Order { id: string; status: string; total: number; createdAt: number }

export default function AdminPage() {
  const { profile, loading } = useUserProfile()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [newProduct, setNewProduct] = useState<Product>({ name:'', price:0 })

  async function load() {
    const ps = await getDocs(collection(db,'products'))
    setProducts(ps.docs.map((d: any)=>({id:d.id, ...(d.data() as any)})))
    const os = await getDocs(collection(db,'orders'))
    setOrders(os.docs.map((d: any)=>({id:d.id, ...(d.data() as any)})))
  }

  useEffect(()=>{ if (!loading && profile?.role==='admin') load() },[loading, profile])

  async function addProduct() {
    await addDoc(collection(db,'products'), newProduct)
    setNewProduct({ name:'', price:0 })
    load()
  }
  async function updateProduct(p: Product) {
    if (!p.id) return
    await updateDoc(doc(db,'products', p.id), p as any)
    load()
  }
  async function removeProduct(id?: string) {
    if (!id) return
    await deleteDoc(doc(db,'products', id))
    load()
  }

  async function toggleDelivered(order: Order) {
    await updateDoc(doc(db,'orders', order.id), { status: order.status === 'Placed' ? 'Delivered' : 'Placed' })
    load()
  }

  if (loading) return (<p>Loading...</p>)
  if (!profile || profile.role !== 'admin') {
    return (
      <div>
        <h2 className="font-display text-2xl mb-2">Admin Only</h2>
        <p className="text-slate">You must be an admin to view this page.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <section>
        <h2 className="font-display text-2xl mb-4">Products</h2>
        <div className="space-y-2">
          <input className="border p-2 w-full" placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name:e.target.value})} />
          <input type="number" className="border p-2 w-full" placeholder="Price" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price:Number(e.target.value)})} />
          <input className="border p-2 w-full" placeholder="Image URL" value={newProduct.imageUrl||''} onChange={e=>setNewProduct({...newProduct, imageUrl:e.target.value})} />
          <textarea className="border p-2 w-full" placeholder="Description" value={newProduct.description||''} onChange={e=>setNewProduct({...newProduct, description:e.target.value})} />
          <button className="px-3 py-2 bg-forest text-cream rounded" onClick={addProduct}>Add Product</button>
        </div>
        <ul className="mt-4 space-y-3">
          {products.map(p=> (
            <li key={p.id} className="border p-3 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <strong>{p.name}</strong> — ₹{p.price}
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border rounded" onClick={()=>updateProduct(p)}>Save</button>
                  <button className="px-2 py-1 border rounded" onClick={()=>removeProduct(p.id)}>Delete</button>
                </div>
              </div>
              <input className="border p-2 w-full mt-2" value={p.name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setProducts(products.map(x=>x.id===p.id?{...x,name:e.target.value}:x))} />
              <input type="number" className="border p-2 w-full mt-2" value={p.price} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setProducts(products.map(x=>x.id===p.id?{...x,price:Number(e.target.value)}:x))} />
              <input className="border p-2 w-full mt-2" value={p.imageUrl||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setProducts(products.map(x=>x.id===p.id?{...x,imageUrl:e.target.value}:x))} />
              <textarea className="border p-2 w-full mt-2" value={p.description||''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setProducts(products.map(x=>x.id===p.id?{...x,description:e.target.value}:x))} />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left"><th>Order</th><th>Status</th><th>Total</th><th>Toggle</th></tr>
          </thead>
          <tbody>
            {orders.map(o=> (
              <tr key={o.id} className="border-t">
                <td>{o.id}</td>
                <td>{o.status}</td>
                <td>₹{o.total}</td>
                <td>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={o.status==='Delivered'} onChange={()=>toggleDelivered(o)} />
                    Delivered
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
