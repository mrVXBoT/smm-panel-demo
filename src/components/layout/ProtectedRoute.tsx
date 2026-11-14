import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import type { UserRole } from '../../core/types/models';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children?: React.ReactNode;
}

/**
 * Protected Route & Role Authorization Guard:
 * 1. Unauthenticated visitors accessing /app or /admin are redirected to /login with state.from.
 * 2. Non-admin users attempting to access /admin routes are redirected to the customer workspace (/app).
 * 3. Logged-in users with matching permissions render the protected layout.
 */
export function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Non-admin attempting to access admin route
    if (requiredRole === 'admin' && currentUser.role !== 'admin') {
      return <Navigate to="/app" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
