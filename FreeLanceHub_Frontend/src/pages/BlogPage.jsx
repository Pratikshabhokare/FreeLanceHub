import Navbar from "../components/others/Navbar";
import Footer from "../components/others/Footer";
import "../pages/dashboard.css"; // Reuse dashboard styles

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: "How to Land Your First Freelance Job",
            excerpt: "Starting out can be tough. Here are 5 items you need to focus on to get your first client.",
            date: "Oct 24, 2025",
            readTime: "5 min read",
            category: "Freelancing Tips"
        },
        {
            id: 2,
            title: "Managing Finances as a Gig Worker",
            excerpt: "Don't let taxes surprise you. Learn how to manage your income streams effectively.",
            date: "Nov 02, 2025",
            readTime: "7 min read",
            category: "Finance"
        },
        {
            id: 3,
            title: "The Future of Remote Work in 2026",
            excerpt: "Remote work isn't just a trend; it's the new normal. See what experts are predicting.",
            date: "Nov 15, 2025",
            readTime: "4 min read",
            category: "Trends"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="page" style={{ paddingTop: 0 }}>

                {/* Header */}
                <div style={{ backgroundColor: "#14532d", color: "white", padding: "60px 20px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>FreelanceHub Blog</h1>
                    <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>
                        Insights, guides, and news for the modern professional.
                    </p>
                </div>

                <div className="container" style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>

                    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {posts.map(post => (
                            <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div style={{ height: '150px', background: '#fff1db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', fontSize: '3rem' }}>
                                    <i className="fas fa-newspaper"></i>
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        {post.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#111827' }}>{post.title}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>
                                        {post.excerpt}
                                    </p>
                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9ca3af' }}>
                                        <span>{post.date}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: "center", marginTop: "60px", padding: "40px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                        <h2 style={{ marginBottom: "15px", color: '#1f2937' }}>Want to contribute?</h2>
                        <p style={{ color: '#6b7280', marginBottom: "20px" }}>We are always looking for guest writers to share their expertise.</p>
                        <button className="btn-primary">Write for Us</button>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}
