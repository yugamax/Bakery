'use client';

// ...existing imports...
import { useAuth } from '@/context/AuthContext';
import AvatarMenu from './AvatarMenu';
import Link from 'next/link';

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="bg-[#FFF8DC] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-serif text-green-700 font-bold">
            Aditi's Bakery
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-green-700 transition-colors">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-green-700 transition-colors">
              Cart
            </Link>
            <Link href="/my-orders" className="text-gray-700 hover:text-green-700 transition-colors">
              My Orders
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-green-700 transition-colors">
              Admin
            </Link>

            {/* Auth Section */}
            {currentUser ? (
              <AvatarMenu />
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
