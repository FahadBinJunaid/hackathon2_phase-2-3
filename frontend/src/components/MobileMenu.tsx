/**
 * Mobile Menu Component
 * Feature: 004-ui-refinement
 * User Story: US3 - Responsive Navigation
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function MobileMenu({ isOpen, onClose, isAuthenticated, onLogout }: MobileMenuProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      const menuElement = document.getElementById('mobile-menu');
      if (menuElement) {
        const focusableElements = menuElement.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        };

        document.addEventListener('keydown', handleTab);
        firstElement?.focus();

        return () => document.removeEventListener('keydown', handleTab);
      }
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        id="mobile-menu"
        className={`
          fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Sidebar Container - Flex Column with Full Height */}
        <div className="flex flex-col h-screen p-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="mb-6 text-slate-300 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded self-end"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Top Section - Navigation Links */}
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="block py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg font-medium transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Bottom Section - Logout Button (mt-auto pushes to bottom) */}
          {isAuthenticated && (
            <div className="mt-auto mb-10">
              {/* Logout Button - Full Width, Red Theme, with Icon */}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full btn-glass-danger flex items-center justify-center gap-2"
                aria-label="Logout from account"
              >
                {/* Logout Icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
