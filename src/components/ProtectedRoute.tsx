import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/clients/dashboard" replace />;
  }

  // Redirection basée sur le rôle
  if (location.pathname === '/dashboard') {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/clients/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
