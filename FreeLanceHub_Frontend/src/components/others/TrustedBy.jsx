import "./TrustedBy.css";

const brands = [
  { name: "Google", icon: "fab fa-google" },
  { name: "Microsoft", icon: "fab fa-microsoft" },
  { name: "Airbnb", icon: "fab fa-airbnb" },
  { name: "Amazon", icon: "fab fa-amazon" },
  { name: "Apple", icon: "fab fa-apple" },
  { name: "Slack", icon: "fab fa-slack" },
  { name: "Spotify", icon: "fab fa-spotify" },
  { name: "Dropbox", icon: "fab fa-dropbox" },
  { name: "Github", icon: "fab fa-github" },
  { name: "Meta", icon: "fab fa-facebook" },
];

export default function TrustedBy() {
  return (
    <section className="trusted-section-v2">
      <div className="trusted-container">
        <div className="trusted-content">
          <span className="eyebrow">Industry Leaders Trust Us</span>
          <h2>Empowering 25,000+ teams worldwide</h2>
        </div>

        <div className="marquee-container">
          <div className="marquee">
            <div className="marquee-group">
              {brands.map((brand, i) => (
                <div key={`brand-1-${i}`} className="brand-item">
                  <i className={brand.icon}></i>
                  <span>{brand.name}</span>
                </div>
              ))}
            </div>
            {/* Duplicate group for infinite scroll */}
            <div className="marquee-group" aria-hidden="true">
              {brands.map((brand, i) => (
                <div key={`brand-2-${i}`} className="brand-item">
                  <i className={brand.icon}></i>
                  <span>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
