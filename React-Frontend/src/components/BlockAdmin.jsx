import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context'; // Adjust the import based on your auth context

const BlockAdmin = () => {
    const { user } = useAuth();

    // If the user is an admin, redirect to the admin dashboard
    if (user && user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    // If the user is a client or not logged in, allow access
    return <Outlet />;
};

export default BlockAdmin;
