import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register, API_BASE_URL } from "../../services/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [isRegistering, setIsRegistering] = useState(false); // Default to false
  const [error, setError] = useState("");

  // Sync state with navigation updates (e.g. clicking 'Sign Up' while already on /login)
  useEffect(() => {
    if (location.state && location.state.isRegistering !== undefined) {
      setIsRegistering(location.state.isRegistering);
    }
  }, [location.state]);

  // Form Fields
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("FREELANCER"); // Default role

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        // --- REGISTER FLOW ---
        const payload = {
          name,
          userName: userName || email.split("@")[0], // Fallback username
          email,
          password,
          role,
          enabled: true
        };
        const msg = await register(payload);
        alert(msg || "Registration successful! Please log in.");
        setIsRegistering(false); // Switch back to login
      } else {
        // --- LOGIN FLOW ---
        // Pass 'email' state as 'userName' to match backend LoginRequest
        const user = await login(email, password);
        if (user && user.role === "CLIENT") {
          navigate("/");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError(isRegistering ? "Registration failed. " + (err.message || "") : "Invalid Username or Password");
    }
  }

  function toggleMode() {
    setIsRegistering(!isRegistering);
    setError("");
    // Clear inputs on toggle if desired, or keep them
  }

  return (
    <>
      <Navbar />
      <div className="login-page-body">
        <div className="container">

          {/* LEFT SIDE: Active Form (Login or Register) */}
          <div className="login">
            <h1>{isRegistering ? "Join Us Today" : "Welcome Back"}</h1>
            <p className="subtitle">
              {isRegistering
                ? "Experience the future of freelancing. Create your account."
                : "Log in to your account and continue your journey."}
            </p>

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                  />
                  <div className="role-select-wrapper">
                    <label className="role-label" style={{ textAlign: 'left' }}>Role :</label>
                    <select
                      className="role-select"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="FREELANCER">Work as a Freelancer</option>
                      <option value="CLIENT">Hire Talent (Client)</option>
                    </select>
                  </div>
                </>
              )}

              <input
                type={isRegistering ? "email" : "text"}
                placeholder={isRegistering ? "Email Address" : "Username or Email"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}

              {!isRegistering && (
                <div className="login-options">
                  <label className="remember-me">
                    <input type="checkbox" id="rememberMe" />
                    <span>Remember me</span>
                  </label>
                  <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                </div>
              )}

              <button type="submit">
                {isRegistering ? "Get Started" : "Sign In"}
              </button>
            </form>

            <div className="social-login">
              <div className="social-divider">
                <span>Or continue with</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google"
                  onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/google`}
                >
                  <i className="fab fa-google"></i>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  className="social-btn github"
                  onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/github`}
                >
                  <i className="fab fa-github"></i>
                  <span>Sign in with GitHub</span>
                </button>
              </div>

              <div className="minor-socials">
                <button type="button" className="minor-btn" title="Sign in with Apple">
                  <i className="fab fa-apple"></i>
                </button>
                <button type="button" className="minor-btn" title="Sign in with LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Dynamic Info Panel */}
          <div className="register" style={{ order: isRegistering ? -1 : 1 }}>
            <i className={`fas ${isRegistering ? 'fa-rocket' : 'fa-fingerprint'}`}></i>
            <h2>{isRegistering ? "Already One of Us?" : "New Here?"}</h2>
            <p>
              {isRegistering
                ? "To keep connected with us please login with your personal info."
                : "Enter your personal details and start your journey with us."}
            </p>
            <button onClick={toggleMode}>
              {isRegistering ? "Sign In Instead" : "Create Account"}
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
