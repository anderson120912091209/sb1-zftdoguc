import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
  requireProfile?: boolean;
  checkProfileExists?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/login',
  requireProfile = true,
  checkProfileExists
}) => {
  const { user, profile, loading } = useAuth();

  // If auth is still loading, show nothing or a loading spinner
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If we require a profile and user doesn't have one, redirect to onboarding
  if (requireProfile && !profile && checkProfileExists !== false) {
    return <Navigate to="/onboarding" replace />;
  }

  // If children are provided, render them instead of using Outlet
  if (children) {
    return <>{children}</>;
  }

  // Otherwise, use Outlet (for Route-based usage)
  return <Outlet />;
};

// Add default export for compatibility
export default ProtectedRoute; 