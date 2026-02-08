/**
 * Hero Section Component
 * Feature: 004-ui-refinement
 * User Story: US1 - Landing Page Experience
 */

'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white py-20 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-100 animate-slide-up">
          Organize Your Day, One Task at a Time
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-slate-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Stay focused, track progress, and achieve more every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/signup"
            className="btn-glass-primary"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
