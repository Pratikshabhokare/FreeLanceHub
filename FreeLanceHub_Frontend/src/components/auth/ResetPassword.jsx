import { useState, useEffect } from "react";
import { resetPassword } from "../../services/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../others/Navbar";
import Footer from "../others/Footer";
import "../others/Login.css";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get("token");
        if (t) {
            setToken(t);
        } else {
            setError("Invalid or missing reset token.");
        }
    }, [location.search]);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await resetPassword(token, password);
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. The link may have expired.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="login-page-body">
                <div className="container" style={{ maxWidth: '500px', height: 'auto', minHeight: '400px' }}>
                    <div className="login" style={{ width: '100%', padding: '2rem' }}>
                        <h1>Reset Password</h1>
                        <p className="subtitle">Enter your new password below.</p>

                        {!token ? (
                            <p style={{ color: '#ef4444' }}>Invalid Link. Please try requesting a new one.</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />

                                {message && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{message}</p>}
                                {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

                                <button type="submit">Set New Password</button>
                            </form>
                        )}

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
