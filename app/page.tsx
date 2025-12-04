interface Product { id: string; name: string; price: number; description?: string; imageUrl?: string }

const FEATURED: Product[] = [
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

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-display text-4xl mb-4">Homemade. Artisanal. Yours.</h2>
          <p className="text-slate">
            Discover small-batch cakes, cookies, and breads crafted with care. Sign up to order and enjoy doorstep delivery.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/auth" className="px-4 py-2 bg-forest text-cream rounded">Sign Up</a>
            <a href="/auth" className="px-4 py-2 border border-forest rounded">Login</a>
          </div>
        </div>
        <div className="aspect-video rounded overflow-hidden bg-forest/10">
          <img src={FEATURED[0].imageUrl} alt={FEATURED[0].name} className="w-full h-full object-cover" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl">Featured Bakes</h3>
          <a href="/products" className="text-forest underline">View all</a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED.map(p=> (
            <div key={p.id} className="border rounded bg-white/50 overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full aspect-video object-cover" />
              ) : (
                <div className="aspect-video bg-forest/10" />
              )}
              <div className="p-3">
                <h4 className="font-display text-xl">{p.name}</h4>
                {p.description && <p className="text-slate mb-1">{p.description}</p>}
                <p className="text-forest font-semibold">₹{p.price}</p>
                <a href="/products" className="mt-3 inline-block px-3 py-2 border border-forest rounded">Order now</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
