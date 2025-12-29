import "./TrustedBy.css";

const logos = [
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "Mobileum", src: "/logos/mobileum.svg", tag: "CASE STUDY" },
  { name: "ALDO", src: "/logos/aldo.svg" },
  { name: "Airbnb", src: "/logos/airbnb.svg" },
  { name: "Jumio", src: "/logos/jumio.svg", tag: "CASE STUDY" },
  { name: "Scale", src: "/logos/scale.svg" },
  { name: "Lime", src: "/logos/lime.svg" },
  { name: "Digicel", src: "/logos/digicel.svg" },
  { name: "Automattic", src: "/logos/automattic.svg", tag: "CASE STUDY" },
  { name: "Pipedrive", src: "/logos/pipedrive.svg", tag: "CASE STUDY" },
  { name: "Glassdoor", src: "/logos/glassdoor.svg" },
  { name: "Grammarly", src: "/logos/grammarly.svg" },
  { name: "Bissell", src: "/logos/bissell.svg" },
  { name: "McCormick", src: "/logos/mccormick.svg" },
  { name: "Sandoz", src: "/logos/sandoz.svg" },
  { name: "Cloudflare", src: "/logos/cloudflare.svg" },
];

export default function TrustedBy() {
  return (
    <section className="trusted-section">
      <p className="trusted-eyebrow">
        TRUSTED BY THE WORLD’S LEADING ENTERPRISES
      </p>

      <p className="trusted-subtitle">
        used by <strong>25,000</strong> Hiring Managers Globally
      </p>

      <div className="logo-grid">
        {logos.map((logo) => (
          <div key={logo.name} className="logo-card">
            <img src={logo.src} alt={logo.name} />
            {logo.tag && <span className="case-tag">{logo.tag}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
