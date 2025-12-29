import "./Footer.css";

export default function Footer() {
  return (
    <>
      <div className="Heading">
        <h1 className="prmHead">Try Bussiness Plus Today</h1>
        <p className="prmPara">
          No sales calls, no subscription fees, no cost to join.Start building
          today.
        </p>
          <button className="prmButton">Get Start For Free</button>
      </div>
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4>For Clients</h4>
            <ul>
              <li>How to hire</li>
              <li>Talent Marketplace</li>
              <li>Project Catalog</li>
              <li>Hire an agency</li>
              <li>Enterprise</li>
              <li>Any Hire</li>
              <li>Contract-to-hire</li>
              <li>Direct Contracts</li>
              <li>Hire worldwide</li>
              <li>Hire in the USA</li>
            </ul>
          </div>

          <div>
            <h4>For Talent</h4>
            <ul>
              <li>How to find work</li>
              <li>Direct Contracts</li>
              <li>Find freelance jobs worldwide</li>
              <li>Find freelance jobs in the USA</li>
              <li>Win work with ads</li>
              <li>Exclusive resources with Freelancer Plus</li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li>Help & support</li>
              <li>Success stories</li>
              <li>Reviews</li>
              <li>Resources</li>
              <li>Blog</li>
              <li>Affiliate programme</li>
              <li>Free Business Tools</li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>About us</li>
              <li>Leadership</li>
              <li>Investor relations</li>
              <li>Careers</li>
              <li>Our impact</li>
              <li>Press</li>
              <li>Contact us</li>
              <li>Partners</li>
              <li>Trust, safety & security</li>
              <li>Modern slavery statement</li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <div className="follow">
            <span>Follow Us</span>
            <i className="icon">f</i>
            <i className="icon">in</i>
            <i className="icon">𝕏</i>
            <i className="icon">▶</i>
            <i className="icon">◎</i>
          </div>

          <div className="apps">
            <span>Mobile app</span>
            <i className="icon"></i>
            <i className="icon">🤖</i>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2015 – 2025 FreelanceHub® Global LLC</span>
          <div className="legal-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">CA Notice at Collection</a>
            <a href="#">Your Privacy Choices</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </>
  );
}
