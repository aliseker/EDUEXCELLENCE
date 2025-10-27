/**
 * Token Manager
 * Manages access and refresh tokens with automatic refresh
 * Access Token: 10 minutes in localStorage
 * Refresh Token: 30 days in localStorage
 */

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load tokens from localStorage on initialization
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      
      // Check if access token needs refresh on page load
      if (this.accessToken && this.refreshToken) {
        this.scheduleTokenRefresh();
      }
    }
  }

  /**
   * Set access and refresh tokens
   */
  setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Schedule token refresh before expiration (1 minute before)
    const refreshTime = (expiresIn - 60) * 1000; // Convert to milliseconds
    this.scheduleTokenRefresh(refreshTime);
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(timeout: number = 60000) {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Schedule refresh
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        console.error('Auto-refresh failed:', error);
        this.logout();
      }
    }, timeout);
  }

  /**
   * Check if token is expired or about to expire
   */
  private isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeLeft = expiresAt - now;
      
      // Return true if less than 60 seconds left
      return timeLeft < 60000;
    } catch {
      return true;
    }
  }

  /**
   * Get a valid access token (refreshes if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      return null;
    }

    // Check if token is expiring soon
    if (this.isTokenExpiringSoon(this.accessToken)) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      }
    }

    return this.accessToken;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    // If refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch('https://localhost:7166/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Refresh token expired or invalid');
        }

        const data = await response.json();
        
        // Update tokens
        this.setTokens(data.accessToken, data.refreshToken, data.expiresIn);
        
        return data.accessToken;
      } catch (error) {
        // Refresh failed, logout user
        this.logout();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Clear tokens and logout
   */
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminLoggedIn');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null && this.refreshToken !== null;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();









