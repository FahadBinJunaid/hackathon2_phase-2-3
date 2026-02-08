/**
 * Landing Page
 * Feature: 004-ui-refinement
 * User Story: US1 - Landing Page Experience
 */

import HeroSection from '@/components/HeroSection';
import FeatureGrid from '@/components/FeatureGrid';

export const metadata = {
  title: 'TodoApp - Master Your Productivity',
  description: 'Organize your tasks, stay focused, and achieve more every day. Simple, powerful task management for everyone.',
  openGraph: {
    title: 'TodoApp - Master Your Productivity',
    description: 'Organize your tasks, stay focused, and achieve more every day',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeatureGrid />
    </main>
  );
}
