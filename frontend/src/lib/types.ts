/**
 * TypeScript interfaces for Next.js Frontend
 * Feature: 003-nextjs-frontend-integration
 */

// Authentication Types
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Todo Types
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface TodoCreateRequest {
  title: string;
  description?: string;
}

export interface TodoUpdateRequest {
  title?: string;
  description?: string;
}

// Error Types
export interface ApiError {
  detail: string;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}
