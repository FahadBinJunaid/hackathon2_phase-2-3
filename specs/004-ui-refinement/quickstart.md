# Quickstart Guide: UI Refinement & Responsive Design Enhancement

**Feature**: 004-ui-refinement
**Branch**: `004-ui-refinement`
**Date**: 2026-02-07

## Overview

This guide helps developers set up, develop, and test the UI refinement feature. This feature adds a landing page, password confirmation to signup, and mobile-responsive navigation.

## Prerequisites

- Node.js 18+ installed
- Backend server running on port 8001
- Frontend dependencies installed (`npm install` in frontend directory)
- Git branch `004-ui-refinement` checked out

## Quick Start

### 1. Verify Environment

```bash
# Check you're on the correct branch
git branch --show-current
# Should output: 004-ui-refinement

# Verify backend is running
curl http://localhost:8001/health
# Should return: {"status":"healthy"}

# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install
```

### 2. Start Development Server

```bash
# From frontend directory
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Verify Existing Pages Work

Before making changes, verify the existing application works:

- Navigate to `http://localhost:3000/signup` - Should see signup page
- Navigate to `http://localhost:3000/login` - Should see login page
- Navigate to `http://localhost:3000/dashboard` - Should redirect to login (if not authenticated)

## Development Workflow

### Phase D2: Landing Page

**Goal**: Create landing page at root URL

**Files to Create**:
```bash
frontend/src/app/page.tsx
frontend/src/components/HeroSection.tsx
frontend/src/components/FeatureGrid.tsx
```

**Development Steps**:

1. **Create HeroSection Component**:
   ```typescript
   // src/components/HeroSection.tsx
   'use client';

   import Link from 'next/link';

   export default function HeroSection() {
     return (
       <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">
             Organize Your Life with Todo App
           </h1>
           <p className="text-xl md:text-2xl mb-8 text-blue-100">
             Simple, powerful task management for everyone
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link
               href="/signup"
               className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
             >
               Get Started
             </Link>
             <Link
               href="/login"
               className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
             >
               Sign In
             </Link>
           </div>
         </div>
       </section>
     );
   }
   ```

2. **Create FeatureGrid Component**:
   ```typescript
   // src/components/FeatureGrid.tsx
   export default function FeatureGrid() {
     const features = [
       {
         title: 'Task Management',
         description: 'Create, organize, and track your tasks efficiently',
         icon: '✓',
       },
       {
         title: 'Stay Organized',
         description: 'Keep all your todos in one place, accessible anywhere',
         icon: '📋',
       },
       {
         title: 'Boost Productivity',
         description: 'Complete more tasks and achieve your goals faster',
         icon: '🚀',
       },
     ];

     return (
       <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-center mb-12">
             Why Choose Todo App?
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {features.map((feature) => (
               <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md">
                 <div className="text-4xl mb-4">{feature.icon}</div>
                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                 <p className="text-gray-600">{feature.description}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
   }
   ```

3. **Create Landing Page**:
   ```typescript
   // src/app/page.tsx
   import HeroSection from '@/components/HeroSection';
   import FeatureGrid from '@/components/FeatureGrid';

   export const metadata = {
     title: 'Todo App - Organize Your Life',
     description: 'Simple, powerful task management for everyone',
   };

   export default function LandingPage() {
     return (
       <main>
         <HeroSection />
         <FeatureGrid />
       </main>
     );
   }
   ```

**Testing**:
- Navigate to `http://localhost:3000/`
- Verify hero section displays with headline and CTAs
- Verify feature grid shows 3 cards
- Click "Get Started" → should navigate to `/signup`
- Click "Sign In" → should navigate to `/login`
- Resize browser to mobile size → verify responsive layout

---

### Phase D3: Password Confirmation

**Goal**: Add password confirmation to signup page

**Files to Modify**:
```bash
frontend/src/app/signup/page.tsx
```

**Development Steps**:

1. **Add State for Confirm Password**:
   ```typescript
   const [confirmPassword, setConfirmPassword] = useState('');
   const [errors, setErrors] = useState<{
     email?: string;
     password?: string;
     confirmPassword?: string;
   }>({});
   ```

2. **Add Validation Logic**:
   ```typescript
   const validateForm = (): boolean => {
     const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

     // Existing email validation...

     // Existing password validation...

     // NEW: Password confirmation validation
     if (!confirmPassword) {
       newErrors.confirmPassword = 'Please confirm your password';
     } else if (password !== confirmPassword) {
       newErrors.confirmPassword = 'Passwords do not match';
     }

     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
   ```

3. **Add Confirm Password Input**:
   ```typescript
   <div>
     <label htmlFor="confirmPassword" className="sr-only">
       Confirm Password
     </label>
     <input
       id="confirmPassword"
       name="confirmPassword"
       type="password"
       autoComplete="new-password"
       required
       value={confirmPassword}
       onChange={(e) => setConfirmPassword(e.target.value)}
       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
       placeholder="Confirm Password"
       aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
       aria-invalid={!!errors.confirmPassword}
     />
     {errors.confirmPassword && (
       <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
         {errors.confirmPassword}
       </p>
     )}
   </div>
   ```

**Testing**:
- Navigate to `http://localhost:3000/signup`
- Enter email and password
- Enter different password in confirm field → should show error
- Enter matching password → error should clear
- Submit form with mismatched passwords → should prevent submission
- Submit form with matching passwords → should create account successfully

---

### Phase D4: Mobile Navigation

**Goal**: Add responsive mobile menu

**Files to Create**:
```bash
frontend/src/components/MobileMenu.tsx
```

**Files to Modify**:
```bash
frontend/src/components/Navbar.tsx
```

**Development Steps**:

1. **Create MobileMenu Component**:
   ```typescript
   // src/components/MobileMenu.tsx
   'use client';

   import { useEffect } from 'react';
   import Link from 'next/link';

   interface MobileMenuProps {
     isOpen: boolean;
     onClose: () => void;
     userEmail?: string;
     onLogout: () => void;
   }

   export default function MobileMenu({ isOpen, onClose, userEmail, onLogout }: MobileMenuProps) {
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

     return (
       <>
         {/* Backdrop */}
         {isOpen && (
           <div
             className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
             onClick={onClose}
           />
         )}

         {/* Menu */}
         <div
           className={`
             fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50
             transform transition-transform duration-300 ease-in-out
             md:hidden
             ${isOpen ? 'translate-x-0' : '-translate-x-full'}
           `}
         >
           <div className="p-4">
             <button
               onClick={onClose}
               className="mb-4 text-gray-600 hover:text-gray-900"
               aria-label="Close menu"
             >
               ✕
             </button>

             <nav className="space-y-4">
               <Link
                 href="/dashboard"
                 onClick={onClose}
                 className="block py-2 text-gray-700 hover:text-blue-600"
               >
                 Dashboard
               </Link>

               {userEmail && (
                 <>
                   <div className="border-t pt-4">
                     <p className="text-sm text-gray-600 mb-2">{userEmail}</p>
                     <button
                       onClick={() => {
                         onLogout();
                         onClose();
                       }}
                       className="text-red-600 hover:text-red-700"
                     >
                       Logout
                     </button>
                   </div>
                 </>
               )}
             </nav>
           </div>
         </div>
       </>
     );
   }
   ```

2. **Update Navbar Component**:
   ```typescript
   // Add state for mobile menu
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   // Add hamburger button (visible on mobile only)
   <button
     onClick={() => setIsMobileMenuOpen(true)}
     className="md:hidden text-white"
     aria-label="Open menu"
   >
     ☰
   </button>

   // Hide desktop nav on mobile
   <div className="hidden md:flex items-center space-x-4">
     {/* existing nav links */}
   </div>

   // Add MobileMenu component
   <MobileMenu
     isOpen={isMobileMenuOpen}
     onClose={() => setIsMobileMenuOpen(false)}
     userEmail={user?.email}
     onLogout={logout}
   />
   ```

**Testing**:
- Resize browser to mobile (< 768px)
- Verify hamburger icon appears
- Click hamburger → menu should slide in from left
- Click outside menu → menu should close
- Press ESC → menu should close
- Click navigation link → should navigate and close menu
- Resize to desktop → hamburger should hide, desktop nav should show

---

## Testing Checklist

### Functional Testing

- [ ] Landing page loads at root URL (/)
- [ ] Hero section displays with correct content
- [ ] Feature grid shows 3 feature cards
- [ ] "Get Started" button navigates to /signup
- [ ] "Sign In" button navigates to /login
- [ ] Signup page has password confirmation field
- [ ] Password mismatch shows error message
- [ ] Form prevents submission with mismatched passwords
- [ ] Mobile menu appears on screens < 768px
- [ ] Hamburger icon opens mobile menu
- [ ] Mobile menu closes on outside click
- [ ] Mobile menu closes on ESC key
- [ ] Mobile menu closes after navigation

### Responsive Testing

Test on these screen sizes:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 768px (iPad)
- [ ] 1024px (Desktop)
- [ ] 1920px (Large Desktop)

Verify:
- [ ] No horizontal scrolling on any size
- [ ] Text is readable on all sizes
- [ ] Buttons are touch-friendly (44px min)
- [ ] Layout adapts appropriately

### Accessibility Testing

- [ ] All interactive elements accessible via keyboard
- [ ] Tab order follows visual flow
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Error messages announced to screen readers
- [ ] Hamburger menu has aria-label
- [ ] Form inputs have labels (visible or sr-only)

### Performance Testing

- [ ] Landing page loads in < 2 seconds on 3G
- [ ] Mobile menu animation < 300ms
- [ ] Form validation feedback < 500ms
- [ ] No console errors or warnings
- [ ] Lighthouse score 90+ (mobile and desktop)

### Cross-Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Common Issues & Solutions

### Issue: Module not found '@/components/...'

**Solution**: Verify tsconfig.json has correct path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Mobile menu doesn't close on outside click

**Solution**: Ensure backdrop has onClick handler:
```typescript
<div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50" />
```

### Issue: Password confirmation error doesn't clear

**Solution**: Update validation logic to remove error when passwords match:
```typescript
if (password === confirmPassword) {
  const { confirmPassword: _, ...rest } = errors;
  setErrors(rest);
}
```

### Issue: Responsive layout breaks on certain sizes

**Solution**: Use Tailwind's responsive utilities consistently:
```typescript
// Mobile first, then larger screens
className="flex-col md:flex-row"
```

---

## Development Tips

1. **Use Browser DevTools**: Toggle device toolbar to test responsive layouts
2. **Hot Reload**: Next.js automatically reloads on file changes
3. **Console Logs**: Check browser console for errors
4. **Network Tab**: Verify API calls are working correctly
5. **Accessibility Tab**: Use Lighthouse or axe DevTools for accessibility checks

---

## Next Steps

After completing development and testing:

1. Run full test suite: `npm run build` to verify production build
2. Create commit with changes
3. Push to remote branch
4. Create pull request for review
5. Address any review feedback
6. Merge to main after approval

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Hooks Reference](https://react.dev/reference/react)

---

## Support

If you encounter issues:
1. Check this quickstart guide
2. Review the research.md for technology decisions
3. Consult the plan.md for architecture details
4. Ask in team chat or create an issue
