// Vercel OAuth Configuration
const VERCEL_CLIENT_ID = import.meta.env.VITE_VERCEL_CLIENT_ID;
const VERCEL_REDIRECT_URI = import.meta.env.VITE_VERCEL_REDIRECT_URI || `${window.location.origin}/auth/vercel/callback`;
const VERCEL_AUTH_URL = 'https://vercel.com/oauth/authorize';
const VERCEL_TOKEN_URL = 'https://api.vercel.com/oauth/access_token';
const VERCEL_USER_URL = 'https://api.vercel.com/www/user';

export const vercelAuth = {
  /**
   * Redirect user to Vercel login page
   */
  redirectToVercelLogin: () => {
    if (!VERCEL_CLIENT_ID) {
      console.error('VITE_VERCEL_CLIENT_ID is not configured');
      throw new Error('Vercel Client ID is not configured');
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('vercel_auth_state', state);

    const params = new URLSearchParams({
      client_id: VERCEL_CLIENT_ID,
      redirect_uri: VERCEL_REDIRECT_URI,
      response_type: 'code',
      state: state,
      scope: 'read', // or customize based on your needs
    });

    window.location.href = `${VERCEL_AUTH_URL}?${params.toString()}`;
  },

  /**
   * Exchange authorization code for access token
   * This should be called from your backend/API endpoint
   */
  exchangeCodeForToken: async (code) => {
    try {
      const response = await fetch('/api/auth/vercel/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // { access_token, token_type, expires_in }
    } catch (error) {
      console.error('Failed to exchange code for token:', error);
      throw error;
    }
  },

  /**
   * Get authenticated user info from Vercel
   */
  getUserInfo: async (accessToken) => {
    try {
      const response = await fetch(VERCEL_USER_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user info from Vercel:', error);
      throw error;
    }
  },

  /**
   * Store access token in localStorage
   */
  setAccessToken: (token) => {
    localStorage.setItem('vercel_access_token', token);
  },

  /**
   * Get stored access token
   */
  getAccessToken: () => {
    return localStorage.getItem('vercel_access_token');
  },

  /**
   * Remove access token
   */
  clearAccessToken: () => {
    localStorage.removeItem('vercel_access_token');
  },

  /**
   * Check if user is authenticated with Vercel
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('vercel_access_token');
  },

  /**
   * Verify state parameter for CSRF protection
   */
  verifyState: (state) => {
    const savedState = sessionStorage.getItem('vercel_auth_state');
    sessionStorage.removeItem('vercel_auth_state');
    return state === savedState;
  },
};
