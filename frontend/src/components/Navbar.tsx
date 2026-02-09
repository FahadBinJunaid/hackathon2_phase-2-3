/**
 * Navbar Component - Responsive with mobile menu
 * Feature: 004-ui-refinement
 * User Story: US3 - Responsive Navigation
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileMenu from '@/components/MobileMenu';

export default function Navbar() {
  const { logout } = useAuth();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    setIsAuth(isAuthenticated());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-slate-200">
                Todo App
              </Link>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-24 bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-slate-200">
              Todo App
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-glass-danger text-sm min-h-[44px]"
                  aria-label="Logout from account"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  aria-label="Login to account"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-glass-primary text-sm min-h-[44px]"
                  aria-label="Create new account"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-400 min-h-[44px] min-w-[44px]"
              aria-label="Open mobile menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuth}
        onLogout={logout}
      />
    </nav>
  );
}
