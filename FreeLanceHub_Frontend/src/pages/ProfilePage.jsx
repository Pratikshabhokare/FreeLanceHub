import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/others/Navbar";
import Footer from "../components/others/Footer";
import { getCurrentUser, getFreelancerProfile, getReviewsForUser, getAverageRating, createChat } from "../services/api";
import "../styles.css";

// Helper for generic avatar
const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;

export default function ProfilePage() {
    const [user, setUser] = useState(null); // Logged in user
    const [viewedUser, setViewedUser] = useState(null); // User being viewed
    const [profile, setProfile] = useState({});
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);

    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [userId]);

    async function loadData() {
        setLoading(true);
        try {
            const currentUser = getCurrentUser();
            setUser(currentUser);

            let targetId = userId || currentUser?.id;
            if (!targetId) {
                console.error("ProfilePage: No user ID available");
                setLoading(false);
                return;
            }

            console.log(`ProfilePage: Loading profile for user ID: ${targetId}`);

            // Fetch Profile & User Data
            try {
                const p = await getFreelancerProfile(targetId);
                console.log("ProfilePage: Freelancer profile data:", p);
                if (p) {
                    setProfile(p);
                    setViewedUser(p.freelancer);
                } else if (!userId) {
                    // If its current user but no freelancer profile yet, just set viewedUser
                    console.log("ProfilePage: No freelancer profile, using current user");
                    setViewedUser(currentUser);
                }
            } catch (err) {
                console.error("ProfilePage: Error fetching freelancer profile:", err);
                // If profile fetch fails but it's the current user, still show their basic info
                if (!userId && currentUser) {
                    setViewedUser(currentUser);
                }
            }

            // Fetch Reviews
            try {
                const revs = await getReviewsForUser(targetId);
                setReviews(revs || []);
            } catch (err) {
                console.error("ProfilePage: Error fetching reviews:", err);
                setReviews([]);
            }

            // Fetch Average Rating
            try {
                const avg = await getAverageRating(targetId);
                setAvgRating(avg || 0);
            } catch (err) {
                console.error("ProfilePage: Error fetching average rating:", err);
                setAvgRating(0);
            }

        } catch (err) {
            console.error("ProfilePage: Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleStartChat() {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            // For now, use a dummy jobId = 0 or similar if it's a general chat invitation
            // Or ideally, the UI should ask "which job are you interested in?"
            // But to make it simple:
            const chat = await createChat(0, viewedUser.id, user.id);
            navigate("/messages", { state: { selectedChat: chat } });
        } catch (err) {
            alert("Failed to start chat: " + err.message);
        }
    }

    const isOwnProfile = user?.id === viewedUser?.id;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {loading ? (
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                        <h2 style={{ color: '#64748b', fontWeight: 600 }}>Loading profile...</h2>
                    </div>
                </main>
            ) : !viewedUser ? (
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👤</div>
                        <h2 style={{ color: '#64748b', fontWeight: 600 }}>User not found</h2>
                        <p style={{ color: '#94a3b8', marginTop: '10px' }}>The profile you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate('/')}
                            style={{ marginTop: '20px', padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Go Home
                        </button>
                    </div>
                </main>
            ) : (
                <main style={{ flex: 1, maxWidth: '1100px', margin: '40px auto', width: '100%', padding: '0 20px' }}>

                    {/* Profile Header Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        marginBottom: '30px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ height: '160px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}></div>
                        <div style={{ padding: '0 40px 40px 40px', marginTop: '-60px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
                                <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-end' }}>
                                    <img
                                        src={viewedUser.profilePicture || getAvatarUrl(viewedUser.name)}
                                        alt={viewedUser.name}
                                        style={{
                                            width: '140px', height: '140px', borderRadius: '30px',
                                            border: '6px solid white', objectFit: 'cover',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <div style={{ marginBottom: '10px' }}>
                                        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{viewedUser.name}</h1>
                                        <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '4px 0' }}>@{viewedUser.userName}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                            <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★</span>
                                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{avgRating.toFixed(1)}</span>
                                            <span style={{ color: '#94a3b8' }}>({reviews.length} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginBottom: 10 }}>
                                    {isOwnProfile ? (
                                        <button onClick={() => navigate("/profile")} style={btnSecondary}>Edit Profile</button>
                                    ) : (
                                        <>
                                            <button onClick={handleStartChat} style={btnPrimary}>Message</button>
                                            <button style={btnSecondary}>Share Profile</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>

                        {/* Left Column: Bio & Reviews */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                            {/* About Section */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitle}>About</h2>
                                <p style={{ lineHeight: '1.8', color: '#475569', fontSize: '1.1rem' }}>
                                    {profile.bio || "This user hasn't added a bio yet."}
                                </p>
                            </section>

                            {/* Reviews Section */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitle}>Reviews</h2>
                                {reviews.length === 0 ? (
                                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>No reviews yet.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {reviews.map(rev => (
                                            <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <div style={{ fontWeight: 600 }}>{rev.reviewerName}</div>
                                                    <div style={{ color: '#f59e0b' }}>{"★".repeat(Math.round(rev.rating))}</div>
                                                </div>
                                                <p style={{ color: '#475569', margin: '0 0 8px 0' }}>{rev.comment}</p>
                                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                                    Project: {rev.jobTitle} • {new Date(rev.reviewDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Stats & Skills */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                            {/* Professional Info */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitle}>Stats</h2>
                                <div style={{ display: 'grid', gap: 15 }}>
                                    <div style={statRow}>
                                        <span style={statLabel}>Hourly Rate</span>
                                        <span style={statValue}>${profile.hourlyRate || 0}/hr</span>
                                    </div>
                                    <div style={statRow}>
                                        <span style={statLabel}>Experience</span>
                                        <span style={statValue}>{profile.experience || 0} Years</span>
                                    </div>
                                    <div style={statRow}>
                                        <span style={statLabel}>Jobs Completed</span>
                                        <span style={statValue}>{reviews.length}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Skills */}
                            <section style={cardStyle}>
                                <h2 style={sectionTitle}>Skills</h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {profile.skills ? profile.skills.split(',').map((skill, i) => (
                                        <span key={i} style={skillBadge}>{skill.trim()}</span>
                                    )) : <span style={{ color: '#94a3b8' }}>None listed</span>}
                                </div>
                            </section>
                        </div>

                    </div>
                </main>
            )}
            <Footer />
        </div>
    );
}

// Styles
const cardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const sectionTitle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '20px',
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '10px'
};

const btnPrimary = {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'transform 0.2s',
};

const btnSecondary = {
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem'
};

const statRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const statLabel = { color: '#64748b' };
const statValue = { fontWeight: 700, color: '#1e293b' };
const skillBadge = {
    background: '#f0fdf4',
    color: '#166534',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 600,
    border: '1px solid #dcfce7'
};
