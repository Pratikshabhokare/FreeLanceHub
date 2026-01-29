import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        const token = getUrlParameter("token");
        const error = getUrlParameter("error");

        if (token) {
            localStorage.setItem("token", token);
            // In a real app, you might want to fetch user details here 
            // to ensure the token is valid and set the user in context
            navigate("/discover", { replace: true });
        } else {
            console.error("OAuth2 Redirect Error:", error);
            navigate("/login", { replace: true, state: { error: error || "Social login failed" } });
        }
    }, [location, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white', flexDirection: 'column', gap: '20px' }}>
            <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Completing secure login...</p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
