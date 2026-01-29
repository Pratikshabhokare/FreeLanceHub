import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/others/Navbar";
import Footer from "../components/others/Footer";
import { getCurrentUser, getFreelancerProfile, saveFreelancerProfile, updateUser } from "../services/api";

export default function ProfileEditPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        bio: "",
        skills: "",
        hourlyRate: "",
        experience: ""
    });
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        profilePicture: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                navigate("/login");
                return;
            }
            setUser(currentUser);

            // Set basic user info
            setUserInfo({
                name: currentUser.name || "",
                email: currentUser.email || "",
                profilePicture: currentUser.profilePicture || ""
            });

            // Try to load freelancer profile
            try {
                const p = await getFreelancerProfile(currentUser.id);
                if (p) {
                    setProfile({
                        bio: p.bio || "",
                        skills: p.skills || "",
                        hourlyRate: p.hourlyRate || "",
                        experience: p.experience || ""
                    });
                }
            } catch (err) {
                console.log("No freelancer profile yet, will create new one");
            }

            setLoading(false);
        } catch (err) {
            console.error("Failed to load profile:", err);
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!user) return;

        setSaving(true);
        try {
            // Update basic user info
            await updateUser(user.id, {
                name: userInfo.name,
                email: userInfo.email,
                profilePicture: userInfo.profilePicture
            });

            // Update or create freelancer profile (if user is a freelancer)
            if (user.role === "FREELANCER") {
                await saveFreelancerProfile(user.id, {
                    bio: profile.bio,
                    skills: profile.skills,
                    hourlyRate: parseFloat(profile.hourlyRate) || 0,
                    experience: parseInt(profile.experience) || 0
                });
            }

            // Update localStorage
            const updatedUser = { ...user, ...userInfo };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save profile: " + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                        <h2 style={{ color: '#64748b', fontWeight: 600 }}>Loading...</h2>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, maxWidth: '800px', margin: '40px auto', width: '100%', padding: '0 20px' }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>
                        Edit Profile
                    </h1>
                    <p style={{ color: '#64748b', marginBottom: '30px' }}>
                        Update your information and preferences
                    </p>

                    {/* Basic Info */}
                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={sectionTitle}>Basic Information</h2>

                        <div style={formGroup}>
                            <label style={labelStyle}>Name</label>
                            <input
                                type="text"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                style={inputStyle}
                                placeholder="Your full name"
                            />
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                value={userInfo.email}
                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                style={inputStyle}
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Profile Picture URL</label>
                            <input
                                type="text"
                                value={userInfo.profilePicture}
                                onChange={(e) => setUserInfo({ ...userInfo, profilePicture: e.target.value })}
                                style={inputStyle}
                                placeholder="https://example.com/your-photo.jpg"
                            />
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                                Paste a URL to your profile picture
                            </p>
                        </div>
                    </section>

                    {/* Freelancer Profile (only for freelancers) */}
                    {user?.role === "FREELANCER" && (
                        <section style={{ marginBottom: '30px' }}>
                            <h2 style={sectionTitle}>Professional Profile</h2>

                            <div style={formGroup}>
                                <label style={labelStyle}>Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                    placeholder="Tell clients about yourself, your experience, and what you offer..."
                                />
                            </div>

                            <div style={formGroup}>
                                <label style={labelStyle}>Skills</label>
                                <input
                                    type="text"
                                    value={profile.skills}
                                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                                    style={inputStyle}
                                    placeholder="React, Node.js, Python, UI/UX Design (comma separated)"
                                />
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                                    Separate skills with commas
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        value={profile.hourlyRate}
                                        onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                                        style={inputStyle}
                                        placeholder="50"
                                        min="0"
                                        step="5"
                                    />
                                </div>

                                <div style={formGroup}>
                                    <label style={labelStyle}>Experience (years)</label>
                                    <input
                                        type="number"
                                        value={profile.experience}
                                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                                        style={inputStyle}
                                        placeholder="5"
                                        min="0"
                                        step="1"
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '40px' }}>
                        <button
                            onClick={() => navigate("/profile")}
                            style={btnSecondary}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                ...btnPrimary,
                                opacity: saving ? 0.7 : 1,
                                cursor: saving ? 'not-allowed' : 'pointer'
                            }}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Styles
const sectionTitle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f1f5f9'
};

const formGroup = {
    marginBottom: '20px'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px'
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '1rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
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
    transition: 'all 0.2s'
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
