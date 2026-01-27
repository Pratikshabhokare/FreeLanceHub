import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getCurrentUser, getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../services/api";

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
      <div className="logo">
        <div className="logo-icon">FH</div>
        <span className="logo-text">FreelanceHub</span>
      </div>

      <div className="nav-links">
        {/* Guest: Show standard public links */}
        <Link to="/">Home</Link>
        <Link to="/about">About us</Link>

        {/* Client Access Only */}
        {user && user.role === "CLIENT" && (
          <>
            <Link to="/client/jobs">My Jobs</Link>
            <Link to="/client/inbox">Inbox</Link>
          </>
        )}

        {/* Freelancer Access Only */}
        {user && user.role === "FREELANCER" && (
          <>
            <Link to="/discover">Discover</Link>
            <Link to="/freelancer/proposals">My Proposals</Link>
            <Link to="/freelancer/earnings">Earnings</Link>
          </>
        )}

        {/* Shared or Guest */}
        <Link to="/blog">Blog</Link>
        {user && <Link to="/messages">Messages</Link>}
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            {/* Notification Bell */}
            <div style={{ position: 'relative', marginRight: 15 }} ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 5,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    fontSize: '0.7em',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '50%',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '40px',
                  width: '300px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9em' }}>Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.8em', cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '0.9em' }}>
                      No new notifications
                    </div>
                  ) : (
                    <div>
                      {notifications.map(n => (
                        <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: 'white' }}
                          onClick={() => handleMarkRead(n.id)}>
                          <div style={{ fontSize: '0.9em', color: '#1f2937' }}>{n.message}</div>
                          <div style={{ fontSize: '0.75em', color: '#9ca3af', marginTop: 4 }}>
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link to="/profile" className="btn-muted" style={{ marginRight: 10, textDecoration: 'none' }}>
              Profile
            </Link>
            <button
              className="btn-outline"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate("/login", { state: { isRegistering: false } })}>Login</button>
            <button className="btn-primary" onClick={() => navigate("/login", { state: { isRegistering: true } })}>Sign up</button>
          </>
        )}
      </div>
    </nav>
  );
}
