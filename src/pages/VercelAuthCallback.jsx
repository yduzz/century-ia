import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vercelAuth } from '@/api/vercelAuth';
import { useAuth } from '@/lib/AuthContext';

const VercelAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAppState } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        // Check for errors from Vercel
        if (errorParam) {
          throw new Error(`Vercel OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Vercel');
        }

        // Verify state for CSRF protection
        if (!vercelAuth.verifyState(state)) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }

        // Exchange code for access token
        const tokenData = await vercelAuth.exchangeCodeForToken(code);
        
        // Store the access token
        vercelAuth.setAccessToken(tokenData.access_token);

        // Get user info from Vercel
        const userInfo = await vercelAuth.getUserInfo(tokenData.access_token);
        
        // Store user info in localStorage or context
        localStorage.setItem('vercel_user', JSON.stringify(userInfo));

        // Refresh app state to update auth context
        await checkAppState();

        // Redirect to dashboard
        navigate('/');
      } catch (err) {
        console.error('Vercel auth callback error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, checkAppState]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Connecting to Vercel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default VercelAuthCallback;
