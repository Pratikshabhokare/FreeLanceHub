export default function HeroLeft() {
  return (
    <div className="hero-left">
      <h1>
        Your Future Begins <br /> with a New Opportunity
      </h1>

      <p>
        Discover the newest job offers in your field. Our easy-to-use platform
        brings you closer to your next big career opportunity.
      </p>

      <div className="search-box">
        <input type="text" placeholder="Search your job" />
        <button className="btn-primary">Get Started</button>
      </div>

      <div className="stats">
        <Stat value="5k+" label="Job Offers" />
        <Stat value="1k+" label="Key Partner" />
        <Stat value="150" label="Personal Assistant" />
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <h3>{value}</h3>
      <span>{label}</span>
    </div>
  );
}
