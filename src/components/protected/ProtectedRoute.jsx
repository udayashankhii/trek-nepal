// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/auth/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ✅ CRITICAL: Wait for auth to initialize
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Only redirect after loading is complete
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login');
    return (
      <Navigate 
        to="/login" 
        state={{ backgroundLocation: location }} 
        replace 
      />
    );
  }

  console.log('✅ Authenticated, rendering protected content');
  return children;
}
