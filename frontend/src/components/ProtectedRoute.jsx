import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, userRole, userEnterpriseId }) => {
  const location = useLocation();

  // If no user role is provided, redirect to login
  if (!userRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is admin, allow access to all routes
  if (userRole === 'admin') {
    return children;
  }

  // For non-admin users, check if they're trying to access their own profile or edit pages
  if (location.pathname.startsWith('/profile/')) {
    const requestedEnterpriseId = location.pathname.split('/profile/')[1];
    if (requestedEnterpriseId === userEnterpriseId) {
      return children;
    }
  }

  // Check edit routes - users can only edit their own profiles
  if (location.pathname.startsWith('/edit-user/') || location.pathname.startsWith('/edit-admin/')) {
    const requestedEnterpriseId = location.pathname.split('/').pop(); // Get the enterprise ID from the end of the URL
    if (requestedEnterpriseId === userEnterpriseId) {
      return children;
    }
  }

  // If none of the above conditions are met, redirect to their profile
  return <Navigate to={`/profile/${userEnterpriseId}`} replace />;
};

export default ProtectedRoute; 