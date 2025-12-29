import React from "react";
import "./Login.css"; 

export default function Login() {
  return (
    <div className="container">
      {/* Login Section */}
      <div className="login">
        <div className="container">
          <h1>Log in</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <br />
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
          <a href="#">Forgot password?</a>
          <button type="submit">log in</button>

          <hr />
          <p>Or Connect With</p>
          <hr />

          <ul>
            <li>
              <i className="fab fa-facebook-f fa-2x"></i>
            </li>
            <li>
              <i className="fab fa-twitter fa-2x"></i>
            </li>
            <li>
              <i className="fab fa-github fa-2x"></i>
            </li>
            <li>
              <i className="fab fa-linkedin-in fa-2x"></i>
            </li>
          </ul>

          <div className="clearfix"></div>
        </div>
      </div>

      {/* Register Section */}
      <div className="register">
        <div className="container">
          <i className="fas fa-user-plus fa-5x"></i>
          <h2>Hello, friend!</h2>
          <p>Enter your personal details and start journey with us</p>
          <button>
            Register <i className="fas fa-arrow-circle-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
