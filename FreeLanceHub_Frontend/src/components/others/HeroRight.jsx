import heroImage from "../../assets/Home.jpg";

export default function HeroRight() {
  return (
    <div className="hero-right">
      <img src={heroImage} alt="Hero" />

      <div className="badge top-left">
        <strong>500+</strong> Job Vacancy
      </div>

      <div className="badge middle-right">
        <strong>50k+</strong> Member Active
      </div>

      <div className="badge bottom-right">
        Trusted by over <strong>1200+</strong> companies
      </div>
    </div>
  );
}
