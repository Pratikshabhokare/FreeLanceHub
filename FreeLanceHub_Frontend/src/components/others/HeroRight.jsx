import heroImage from "../../assets/Home.jpg";

export default function HeroRight() {
  return (
    <div className="hero-right">
      <div className="blob"></div>
      <img src={heroImage} alt="Expert Freelancer" />

      <div className="badge top-left">
        <i className="fas fa-check-circle"></i>
        <span><strong>100%</strong> Verified Talent</span>
      </div>

      <div className="badge middle-right">
        <i className="fas fa-star"></i>
        <span><strong>4.9/5</strong> Rating</span>
      </div>

      <div className="badge bottom-right">
        <i className="fas fa-briefcase"></i>
        <span><strong>500+</strong> Jobs Posted Today</span>
      </div>
    </div>
  );
}
