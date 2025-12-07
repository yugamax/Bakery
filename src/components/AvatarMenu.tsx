'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AvatarMenu() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Get first letter of display name or email
  const getInitial = () => {
    if (currentUser.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-green-700 hover:border-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-green-700 font-serif font-semibold text-lg">
            {getInitial()}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser.email}
            </p>
          </div>

          {/* Menu Items */}
          <Link
            href="/my-orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            My Orders
          </Link>
          <Link
            href="/admin"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
