export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">FH</div>
        <span className="logo-text">FrelanceHub</span>
      </div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">About us</a>
        <a href="#">Find Work</a>
        <a href="#">Blog</a>
        <a href="#">English</a>
      </div>

      <div className="nav-actions">
        <button className="btn-outline">Login</button>
        <button className="btn-primary">Sign up</button>
      </div>
    </nav>
  );
}
