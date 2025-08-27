import React from 'react';
import { Navigate } from 'react-router-dom';
import { getValidToken } from '@utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getValidToken();
  
  if (!token) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
