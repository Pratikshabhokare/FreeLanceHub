export default function HeroLeft() {
  return (
    <div className="hero-left">
      <h1>
        Build Your Dreams with <span>Expert Talent</span> & <span>Opportunities</span>
      </h1>

      <p>
        Connecting the world's best freelancers with top-tier clients.
        Start your journey today and unlock limitless possibilities.
      </p>

      <div className="search-box">
        <i className="fas fa-search" style={{ marginLeft: '1rem', color: '#94a3b8' }}></i>
        <input type="text" placeholder="What skill are you looking for?" />
        <button>Search Now</button>
      </div>

      <div className="stats">
        <Stat value="12k+" label="Job Posted" />
        <Stat value="45k+" label="Freelancers" />
        <Stat value="98%" label="Satisfaction" />
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
