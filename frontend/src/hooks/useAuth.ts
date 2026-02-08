/**
 * useAuth hook - Authentication logic
 * Feature: 003-nextjs-frontend-integration
 * Agent: auth-agent
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import { setToken, clearToken } from '@/lib/auth';
import { AuthResponse, SignupRequest, LoginRequest } from '@/lib/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/signup', {
        email,
        password,
      } as SignupRequest);

      setToken(response.data.access_token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = extractErrorMessage(error);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      } as LoginRequest);

      setToken(response.data.access_token);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = extractErrorMessage(error);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    signup,
    login,
    logout,
    loading,
  };
}

// Helper function to extract user-friendly error messages
function extractErrorMessage(error: any): string {
  if (error.response?.data?.detail) {
    // Standard error response
    if (typeof error.response.data.detail === 'string') {
      return error.response.data.detail;
    }

    // Validation error response
    if (Array.isArray(error.response.data.detail)) {
      const firstError = error.response.data.detail[0];
      return firstError.msg || 'Validation error';
    }
  }

  // Network error
  if (error.message === 'Network Error') {
    return 'Unable to connect to server. Please check your connection.';
  }

  // Generic error
  return 'An unexpected error occurred. Please try again.';
}
