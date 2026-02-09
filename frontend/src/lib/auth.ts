/**
 * Authentication helper functions
 * Feature: 003-nextjs-frontend-integration
 */

/**
 * Get JWT token from cookies
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));

  if (authCookie) {
    return authCookie.split('=')[1];
  }

  return null;
}

/**
 * Set JWT token in cookies (accessible to middleware)
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;

  // Set cookie with 7 days expiry
  const expiryDays = 7;
  const date = new Date();
  date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;

  // Set cookie with path=/ to make it accessible across the entire site
  document.cookie = `auth_token=${token}; ${expires}; path=/; SameSite=Lax`;
}

/**
 * Clear JWT token from cookies
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;

  // Set cookie with past expiry date to delete it
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
