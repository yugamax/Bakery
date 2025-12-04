"use client";
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface Product { id: string; name: string; price: number; description?: string; imageUrl?: string }

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fake-1',
    name: 'Classic Chocolate Cake',
    price: 899,
    description: 'Rich, moist chocolate layers with silky ganache.',
    imageUrl: 'https://images.unsplash.com/photo-1606312618773-7c3b61a9ce79?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'fake-2',
    name: 'Vanilla Bean Cupcakes (6)',
    price: 499,
    description: 'Madagascar vanilla with cream cheese frosting.',
    imageUrl: 'https://images.unsplash.com/photo-1549572180-02b51f070b3f?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'fake-3',
    name: 'Whole Wheat Bread',
    price: 249,
    description: 'Hearty artisan loaf, perfect for everyday.',
    imageUrl: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop'
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)

  useEffect(()=>{
    (async ()=>{
      try {
        const snap = await getDocs(collection(db, 'products'))
        const list = snap.docs.map(d=>({id:d.id, ...(d.data() as any)})) as Product[]
        if (list.length) setProducts(list)
      } catch {
        // If Firestore isn't configured yet, keep fallback products
      }
    })()
  },[])

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {products.map(p=> (
        <div key={p.id} className="border rounded bg-white/50 overflow-hidden">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="w-full aspect-video object-cover" />
          ) : (
            <div className="aspect-video bg-forest/10" />
          )}
          <div className="p-3">
            <h3 className="font-display text-xl">{p.name}</h3>
            {p.description && <p className="text-slate mb-1">{p.description}</p>}
            <p className="text-forest font-semibold">₹{p.price}</p>
            <button className="mt-3 px-3 py-2 bg-forest text-cream rounded">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  )
}
