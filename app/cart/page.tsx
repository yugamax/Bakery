export default function CartPage() {
  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Your Cart</h2>
      <p className="text-slate">Cart functionality to be wired to Firestore via server actions.</p>
      <a href="/checkout" className="mt-4 inline-block px-4 py-2 bg-forest text-cream rounded">Checkout</a>
    </div>
  )
}
