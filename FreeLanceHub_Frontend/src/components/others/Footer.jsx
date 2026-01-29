import "./Footer.css";

export default function Footer() {
  return (
    <>
      <section className="footer-cta">
        <div className="cta-content">
          <h2>Try Business Plus Today</h2>
          <p>
            No sales calls, no subscription fees, no cost to join. <br />
            Start building your dream team today.
          </p>
          <button className="btn-primary">Get Started For Free</button>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">FH</div>
              <span className="logo-text">FreelanceHub</span>
            </div>
            <p>
              The world's work marketplace. We help people find great work and help businesses find great talent.
            </p>
          </div>

          <div className="footer-column">
            <h4>For Clients</h4>
            <ul>
              <li><a href="#">How to hire</a></li>
              <li><a href="#">Talent Marketplace</a></li>
              <li><a href="#">Project Catalog</a></li>
              <li><a href="#">Enterprise</a></li>
              <li><a href="#">Hire worldwide</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>For Talent</h4>
            <ul>
              <li><a href="#">How to find work</a></li>
              <li><a href="#">Direct Contracts</a></li>
              <li><a href="#">Find jobs worldwide</a></li>
              <li><a href="#">Win work with ads</a></li>
              <li><a href="#">Freelancer Plus</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Help & Support</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Business Tools</a></li>
              <li><a href="#">Affiliate Program</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Trust & Safety</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
          </div>

          <div className="copyright">
            © 2015 – 2025 FreelanceHub® Global LLC
          </div>

          <div className="legal-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  );
}
