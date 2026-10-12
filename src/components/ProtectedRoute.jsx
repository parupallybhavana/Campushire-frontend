import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="spinner" style={{ margin: '100px auto' }} />;
  }

  if (!user) {
    // Redirect admins to admin login, students to student login
    const isAdminRoute = allowedRole === 'ROLE_ADMIN';
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} replace />;
  }

  if (allowedRole) {
    const normUserRole = user.role?.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;
    const normAllowedRole = allowedRole.startsWith('ROLE_') ? allowedRole : `ROLE_${allowedRole}`;

    if (normUserRole !== normAllowedRole) {
      if (normUserRole === 'ROLE_ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
