import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Restricts access to routes based on authentication status and allowed user roles.
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {Array<string>} allowedRoles - Optional array of permitted roles (e.g., ['STUDENT', 'FACULTY'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 1. If user is not authenticated, redirect to Login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If allowedRoles is provided, verify the user's role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Resolve fallback dashboard based on user's active role
    const fallbackDashboard = `/${user.role.toLowerCase()}/dashboard`;
    return <Navigate to={fallbackDashboard} replace />;
  }

  // 3. Authorized access granted
  return children;
};

export default ProtectedRoute;