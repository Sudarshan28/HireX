import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c160e] text-[#dae6d8] flex items-center justify-center font-display">
        <div className="w-10 h-10 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = roleRequired === 'recruiter' ? '/recruiter/login' : '/student/login';
    return <Navigate to={redirectPath} replace />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    const redirectPath = user?.role === 'recruiter' ? '/recruiter/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
