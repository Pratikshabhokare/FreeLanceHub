import { useNavigate } from "react-router-dom";  

export default function Navbar() {
  const navigate = useNavigate();  

  
  const handleLogin = () => {
    navigate("/login");  
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">FH</div>
        <span className="logo-text">FrelanceHub</span>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/about">About us</a>
        <a href="/work">Find Work</a>
        <a href="/blog">Blog</a>
      </div>

      <div className="nav-actions">
        
        <button className="btn-outline" onClick={handleLogin}>
          Login
        </button>
        <button className="btn-primary">Sign up</button>
      </div>
    </nav>
  );
}
