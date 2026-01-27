import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register } from "../../services/api";
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
        await register(payload);
        alert("Registration successful! Please log in.");
        setIsRegistering(false); // Switch back to login
      } else {
        // --- LOGIN FLOW ---
        const user = await login(email, password);
        if (user.role === "CLIENT") {
          navigate("/client/jobs");
        } else {
          navigate("/discover");
        }
      }
    } catch (err) {
      console.error(err);
      setError(isRegistering ? "Registration failed. Email might differ." : "Invalid Email or Password");
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
            <div className="container">
              <h1>{isRegistering ? "Create Account" : "Log in"}</h1>

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
                      <label className="role-label" style={{ textAlign: 'left' }}>I want to:</label>
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
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />

                {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

                <br />
                {!isRegistering && (
                  <>
                    <input type="checkbox" id="rememberMe" />
                    <label htmlFor="rememberMe">Remember me</label>
                    <a href="#">Forgot password?</a>
                  </>
                )}

                <button type="submit" style={{ marginTop: 20 }}>
                  {isRegistering ? "Register Now" : "Log in"}
                </button>
              </form>

              <hr />
              <p>Or Connect With</p>
              <hr />

              <ul>
                <li><i className="fab fa-facebook-f fa-2x"></i></li>
                <li><i className="fab fa-twitter fa-2x"></i></li>
                <li><i className="fab fa-github fa-2x"></i></li>
                <li><i className="fab fa-linkedin-in fa-2x"></i></li>
              </ul>

              <div className="clearfix"></div>
            </div>
          </div>

          {/* RIGHT SIDE: Green Toggle Panel */}
          <div className="register">
            <div className="container">
              <i className={`fas ${isRegistering ? 'fa-user-check' : 'fa-user-plus'} fa-5x`}></i>
              <h2>{isRegistering ? "Welcome Back!" : "Hello, friend!"}</h2>
              <p style={{ marginTop: 20, marginBottom: 30 }}>
                {isRegistering
                  ? "To keep connected with us please login with your personal info."
                  : "Enter your personal details and start your journey with us."}
              </p>
              <button onClick={toggleMode}>
                {isRegistering ? "Log In" : "Register"} <i className="fas fa-arrow-circle-right"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
