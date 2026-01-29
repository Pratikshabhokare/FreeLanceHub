import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/api";

const ProtectedRoute = ({ role }) => {
    const user = getCurrentUser();

    if (!user) {
        // Not logged in -> Redirect to Login
        console.log("ProtectedRoute: User not logged in, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Logged in but wrong role -> Redirect to Home (or specific dashboard)
        console.log(`ProtectedRoute: User role '${user.role}' does not match required role '${role}', redirecting to /`);
        return <Navigate to="/" replace />;
    }

    // Authorized -> Render child routes
    console.log(`ProtectedRoute: Access granted for role '${user.role}'`);
    return <Outlet />;
};

export default ProtectedRoute;
