import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ role }) => {
    const user = getCurrentUser();

    if (!user) {
        // Not logged in -> Redirect to Login
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Logged in but wrong role -> Redirect to Home (or specific dashboard)
        return <Navigate to="/" replace />;
    }

    // Authorized -> Render child routes
    return <Outlet />;
};

export default ProtectedRoute;
