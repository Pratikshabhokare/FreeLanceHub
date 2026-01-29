import { useState } from "react";
import { resetPasswordDirectly } from "../../services/api";
import { Link } from "react-router-dom";
import Navbar from "../others/Navbar";
import Footer from "../others/Footer";
import "../others/Login.css"; // Reuse login styles

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await resetPasswordDirectly(email, password);
            setMessage("Password updated successfully! You can now login.");
        } catch (err) {
            console.error(err);
            setError("Failed to update password. Please check if the email is correct.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="login-page-body">
                <div className="container" style={{ maxWidth: '500px', height: 'auto', minHeight: '400px' }}>
                    <div className="login" style={{ width: '100%', padding: '2rem' }}>
                        <h1>Reset Password</h1>
                        <p className="subtitle">Enter your email and new password.</p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
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

                            <button type="submit">Update Password</button>
                        </form>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                                <i className="fas fa-arrow-left" style={{ marginRight: '5px' }}></i>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
