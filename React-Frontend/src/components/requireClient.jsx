
import { useAuth } from "../contexts/auth-context";
import { Navigate } from "react-router-dom";

const RequireClient = ({ children }) => {
    const { user } = useAuth();

    if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default RequireClient;
