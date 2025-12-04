import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: "Aditi's Bakery",
  description: 'Homemade, artisan bakes delivered to you'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-forest">
        <header className="border-b border-forest/20 bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl">Aditi's Bakery</h1>
            <nav className="flex gap-4 text-sm">
              <a href="/products">Products</a>
              <a href="/cart">Cart</a>
              <a href="/my-orders">My Orders</a>
              <a href="/admin" className="text-rose">Admin</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
