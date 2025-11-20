import React, { useEffect } from 'react';
import { createPageUrl } from '../utils';
import { getRedirectUrl } from '../utils/navigation';

/**
 * Landing page - handles initial routing based on auth state
 * This prevents infinite redirect loops
 */
export default function Landing() {
  useEffect(() => {
    const redirectUrl = getRedirectUrl();
    
    // Small delay to prevent flash
    setTimeout(() => {
      window.location.href = createPageUrl(redirectUrl);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Carregando...</p>
      </div>
    </div>
  );
}

