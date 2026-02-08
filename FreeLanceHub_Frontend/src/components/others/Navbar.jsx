import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getCurrentUser, getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead, logout } from "../../services/api";

const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&size=50`;

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll every 10 seconds
      const interval = setInterval(loadNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  async function loadNotifications() {
    try {
      const data = await getUnreadNotifications(user.id);
      setNotifications(data);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications([]);
      setShowDropdown(false);
    } catch (e) {
      console.error("Failed to mark all read", e);
    }
  }

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <div className="logo-icon">FH</div>
        <span className="logo-text">FreelanceHub</span>
      </div>

      <div className="nav-links">
        <div className="nav-item-dropdown">
          <span className="nav-link-text">Find Talent <i className="fas fa-chevron-down"></i></span>
          <div className="dropdown-menu">
            <Link to="/client/jobs?action=create">Post a Job</Link>
            <Link to="/search?type=freelancers">Talent Marketplace</Link>
            <Link to="/search?type=freelancers&focus=catalog">Project Catalog</Link>
            <Link to="/search?type=freelancers&focus=agencies">Hire an Agency</Link>
          </div>
        </div>

        <div className="nav-item-dropdown">
          <span className="nav-link-text">Find Work <i className="fas fa-chevron-down"></i></span>
          <div className="dropdown-menu">
            <Link to="/search?type=jobs">Ways to Earn</Link>
            <Link to="/search?type=jobs&focus=skills">Find Work for Your Skills</Link>
            <Link to="/freelancer/proposals">Win Work with Ads</Link>
          </div>
        </div>

        <div className="nav-item-dropdown">
          <span className="nav-link-text">Why Us <i className="fas fa-chevron-down"></i></span>
          <div className="dropdown-menu">
            <Link to="/success-stories">Success Stories</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/how-it-works">How it Works</Link>
          </div>
        </div>

        <Link to="/enterprise" className="nav-link-text">Enterprise</Link>
        <Link to="/pricing" className="nav-link-text">Pricing</Link>

        {user && (
          <div className="nav-user-links">
            {user.role === "CLIENT" && (
              <>
                <Link to="/client/jobs">My Jobs</Link>
                <Link to="/client/inbox">Inbox</Link>
                <Link to="/client/financials">Financials</Link>
              </>
            )}
            {user.role === "FREELANCER" && (
              <>
                <Link to="/freelancer/proposals">Proposals</Link>
                <Link to="/freelancer/earnings">Earnings</Link>
              </>
            )}
            <Link to="/messages">Messages</Link>
          </div>
        )}
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                className="btn-muted"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ padding: '8px', borderRadius: '50%' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '2px 5px',
                    borderRadius: '50%',
                    minWidth: '16px',
                    textAlign: 'center',
                    border: '2px solid #fff'
                  }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="notification-dropdown">
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                        <i className="fas fa-bell-slash" style={{ display: 'block', fontSize: '1.5rem', marginBottom: '10px', opacity: 0.5 }}></i>
                        All caught up!
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="notification-item" style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}
                          onClick={() => handleMarkRead(n.id)}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{n.message}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="far fa-clock"></i>
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/profile" className="btn-muted" style={{ textDecoration: 'none' }}>
              <img src={getAvatarUrl(user.name || user.userName)} alt="v" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #fff' }} />
              <span style={{ marginLeft: '4px' }}>{user.name || user.userName}</span>
            </Link>

            <button className="btn-outline" onClick={logout} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate("/login", { state: { isRegistering: false } })}>Login</button>
            <button className="btn-primary" onClick={() => navigate("/login", { state: { isRegistering: true } })}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}
