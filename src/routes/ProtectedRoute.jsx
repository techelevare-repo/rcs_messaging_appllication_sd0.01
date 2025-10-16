import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (roles && roles.length > 0) {
        const hasRole = roles.some((r) => user?.roles?.includes(r));
        if (!hasRole) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;



