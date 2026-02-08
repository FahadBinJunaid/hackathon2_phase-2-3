/**
 * Signup Page
 * Feature: 003-nextjs-frontend-integration
 * Agent: auth-agent
 */

'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Password confirmation validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Real-time validation
    if (value && password !== value) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else {
      setErrors(prev => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(email, password);
    } catch (error) {
      // Error handling is done in useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-100">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start organizing your tasks today
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800 placeholder-slate-400 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent sm:text-sm"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800 placeholder-slate-400 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent sm:text-sm"
                placeholder="Min 8 characters"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="appearance-none block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800 placeholder-slate-400 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent sm:text-sm"
                placeholder="Confirm your password"
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glass-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
