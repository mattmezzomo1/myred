/**
 * Utility functions for navigation and routing
 */

/**
 * Get the current authentication state
 */
export function getAuthState() {
  const currentUser = localStorage.getItem('currentUser');
  const authToken = localStorage.getItem('authToken');
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
  
  return {
    isAuthenticated: !!(currentUser && authToken),
    hasSeenOnboarding: !!hasSeenOnboarding,
    currentUser: currentUser ? JSON.parse(currentUser) : null
  };
}

/**
 * Clear all authentication data
 */
export function clearAuthData() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
}

/**
 * Reset onboarding state (for testing)
 */
export function resetOnboarding() {
  localStorage.removeItem('hasSeenOnboarding');
}

/**
 * Get the appropriate redirect URL based on auth state
 */
export function getRedirectUrl() {
  const { isAuthenticated, hasSeenOnboarding } = getAuthState();
  
  if (isAuthenticated) {
    return 'Home';
  }
  
  if (hasSeenOnboarding) {
    return 'ChooseType';
  }
  
  return 'Onboarding';
}

