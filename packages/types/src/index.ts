/**
 * Shared TypeScript types across the monorepo
 * These types ensure consistency between frontend, Python API, and Node.js API
 */

// Common API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  uptime?: number;
}

// User Types (shared across services)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
}

export interface UserUpdate {
  email?: string;
  name?: string;
}

// Item Types (example resource)
export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ItemCreate {
  name: string;
  description?: string;
  price: number;
  tags?: string[];
}

// Task Types (Node.js service)
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  completed?: boolean;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

// Error Types
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

// Utility Types
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
