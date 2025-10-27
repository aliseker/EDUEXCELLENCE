/**
 * Authenticated Fetch Wrapper
 * Automatically adds Authorization header with valid access token
 * Handles token refresh on 401 errors
 */

import { tokenManager } from './tokenManager';

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get valid access token (automatically refreshes if needed)
  const token = await tokenManager.getValidAccessToken();

  if (!token) {
    // No token available, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
    throw new Error('No access token available');
  }

  // Add Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401 (Unauthorized), try to refresh token and retry
  if (response.status === 401) {
    try {
      // Refresh access token
      const newToken = await tokenManager.refreshAccessToken();

      // Retry the request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    } catch (error) {
      // Refresh failed, logout
      tokenManager.logout();
      throw new Error('Authentication failed');
    }
  }

  return response;
}

/**
 * Convenience methods for common HTTP methods
 */
export const authFetch = {
  get: (url: string, options?: RequestInit) =>
    authenticatedFetch(url, { ...options, method: 'GET' }),

  post: (url: string, body?: unknown, options?: RequestInit) =>
    authenticatedFetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: (url: string, body?: unknown, options?: RequestInit) =>
    authenticatedFetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: (url: string, options?: RequestInit) =>
    authenticatedFetch(url, { ...options, method: 'DELETE' }),
};
















