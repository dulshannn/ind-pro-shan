// components/ProtectedRoute.jsx – Route guard for authenticated/admin routes
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRoles, allowedPermission }) => {
    const { user, loading, isAdmin, permissions } = useAuth();

    if (loading) return <Spinner text="Authenticating..." />;
    if (!user) return <Navigate to="/login" replace />;

    // Check Role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Check Dynamic Permission (Admin ignores this)
    if (allowedPermission && !isAdmin) {
        if (!permissions.includes(allowedPermission)) {
            // Redirect to home if they lack specific permission to avoid infinite loop on dashboard itself
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
