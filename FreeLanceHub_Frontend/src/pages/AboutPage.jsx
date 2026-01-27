import Navbar from "../components/others/Navbar";
import Footer from "../components/others/Footer";
import "../pages/dashboard.css"; // Reuse dashboard styles for consistency logic

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div className="page" style={{ paddingTop: 0 }}>
                {/* Header Section */}
                <div style={{ backgroundColor: "#14532d", color: "white", padding: "60px 20px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>About FreelanceHub</h1>
                    <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto" }}>
                        Bridging the gap between world-class talent and business needs.
                    </p>
                </div>

                <div className="container" style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>

                    {/* Mission Section */}
                    <section style={{ marginBottom: "60px" }}>
                        <h2 style={{ fontSize: "2rem", color: "#111827", marginBottom: "20px", borderBottom: "3px solid #16a34a", display: "inline-block" }}>
                            Our Mission
                        </h2>
                        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#374151" }}>
                            At FreelanceHub, we believe that talent is universal, but opportunity is not. Our mission is to democratize access to meaningful work for freelancers around the globe while providing businesses with the specialized skills they need to innovate and grow. We are building a community rooted in trust, transparency, and professional excellence.
                        </p>
                    </section>

                    {/* Value Cards */}
                    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", marginBottom: "60px" }}>
                        <div className="card padded" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.5rem", color: "#16a34a", marginBottom: "15px" }}>
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3 style={{ marginBottom: "10px", color: "#111827" }}>Secure & Safe</h3>
                            <p style={{ color: "#6b7280" }}>
                                Your security is our priority. We ensure safe transactions and data protection for both clients and freelancers.
                            </p>
                        </div>

                        <div className="card padded" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.5rem", color: "#16a34a", marginBottom: "15px" }}>
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3 style={{ marginBottom: "10px", color: "#111827" }}>Fast & Efficient</h3>
                            <p style={{ color: "#6b7280" }}>
                                Time is money. Our platform is designed to help you post jobs, hire talent, and get work done without unnecessary delays.
                            </p>
                        </div>

                        <div className="card padded" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.5rem", color: "#16a34a", marginBottom: "15px" }}>
                                <i className="fas fa-users"></i>
                            </div>
                            <h3 style={{ marginBottom: "10px", color: "#111827" }}>Community First</h3>
                            <p style={{ color: "#6b7280" }}>
                                We foster a supportive environment where professionals can connect, collaboration, and grow together.
                            </p>
                        </div>
                    </section>

                    {/* Story Section */}
                    <section style={{ display: "flex", gap: "40px", alignItems: "center", flexDirection: "row-reverse" }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: "2rem", color: "#111827", marginBottom: "20px" }}>Our Story</h2>
                            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#374151", marginBottom: "20px" }}>
                                Founded with a vision to simplify the freelance economy, FreelanceHub started as a small project to help local businesses find developers. Today, we are growing into a vibrant ecosystem serving diverse industries.
                            </p>
                            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#374151" }}>
                                Whether you are a startup looking for your first hire or an expert developer seeking your next challenge, FreelanceHub is your home.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
            <Footer />
        </>
    );
}
