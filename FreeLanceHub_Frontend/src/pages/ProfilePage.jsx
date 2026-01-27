import { useEffect, useState } from "react";
import Navbar from "../components/others/Navbar";
import { getCurrentUser, getFreelancerProfile, saveFreelancerProfile, updateUser } from "../services/api";
import "../styles.css";

// Helper for generic avatar
const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const u = getCurrentUser();
            setUser(u);
            if (u) {
                // Initialize form data with basic info
                let initialForm = {
                    name: u.name,
                    email: u.email,
                    id: u.id, // keep track
                    role: u.role
                };

                if (u.role === "FREELANCER") {
                    const p = await getFreelancerProfile(u.id);
                    setProfile(p || {});
                    // Merge profile data into form
                    initialForm = {
                        ...initialForm,
                        title: p?.title || "",
                        skills: p?.skills || "",
                        hourlyRate: p?.hourlyRate || "",
                        experience: p?.experience || "",
                        bio: p?.bio || "",
                    };
                }
                setFormData(initialForm);
            }
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            // 1. Update Basic Info
            if (formData.name !== user.name || formData.email !== user.email) {
                const updatedUser = await updateUser(user.id, {
                    name: formData.name,
                    email: formData.email
                });
                // Update local storage
                const merged = { ...user, ...updatedUser };
                localStorage.setItem("user", JSON.stringify(merged));
                setUser(merged);
            }

            // 2. Update Professional Info (if freelancer)
            if (user.role === "FREELANCER") {
                const profilePayload = {
                    title: formData.title,
                    skills: formData.skills,
                    hourlyRate: parseFloat(formData.hourlyRate) || 0,
                    experience: parseInt(formData.experience) || 0,
                    bio: formData.bio
                };
                const updatedProfile = await saveFreelancerProfile(user.id, profilePayload);
                setProfile(updatedProfile);
            }

            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to save: " + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-20 text-center">Loading profile...</div>;
    if (!user) return <div className="p-20 text-center">Please login first.</div>;

    // --- RENDER VIEW MODE (Professional Look) ---
    if (!isEditing) {
        return (
            <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: 50 }}>
                <Navbar />
                <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: '"Inter", sans-serif' }}>

                    {/* Header Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', // Emerald gradient
                        color: 'white',
                        borderRadius: '16px',
                        padding: '40px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        marginBottom: '30px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                position: 'absolute', top: 20, right: 20,
                                background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
                                padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', backdropFilter: 'blur(5px)'
                            }}
                        >
                            ✏️ Edit Profile
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                            <img
                                src={getAvatarUrl(user.name)}
                                alt={user.name}
                                style={{
                                    width: '120px', height: '120px', borderRadius: '50%',
                                    border: '4px solid rgba(255,255,255,0.3)', objectFit: 'cover'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <h1 style={{ margin: '0 0 5px 0', fontSize: '2.5rem', fontWeight: 700 }}>{user.name}</h1>
                                {user.role === "FREELANCER" && (
                                    <h2 style={{ margin: '0 0 15px 0', fontSize: '1.25rem', fontWeight: 400, opacity: 0.9 }}>
                                        {profile.title || "Freelancer"}
                                    </h2>
                                )}
                                <p style={{ margin: 0, opacity: 0.8 }}>📍 {user.email}</p>
                            </div>

                            {user.role === "FREELANCER" && (
                                <div style={{ textAlign: 'right', minWidth: 150 }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${profile.hourlyRate || 0}<span style={{ fontSize: '1rem', opacity: 0.7 }}>/hr</span></div>
                                    <div style={{
                                        marginTop: '10px', padding: '6px 12px', background: 'rgba(255,255,255,0.2)',
                                        borderRadius: '12px', fontSize: '0.9rem', display: 'inline-block'
                                    }}>
                                        {profile.experience || 0} Years Exp.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: user.role === "FREELANCER" ? '2fr 1fr' : '1fr', gap: '30px' }}>

                        {/* Left Column */}
                        <div>
                            {/* Bio Section */}
                            {user.role === "FREELANCER" && (
                                <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 30 }}>
                                    <h3 style={{ marginTop: 0, color: '#111827', fontSize: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: 10, marginBottom: 20 }}>About Me</h3>
                                    <p style={{ lineHeight: '1.8', color: '#4b5563', whiteSpace: 'pre-wrap' }}>
                                        {profile.bio || "No bio added yet."}
                                    </p>
                                </section>
                            )}

                            {/* Portfolio Placeholder (Professional Touch) */}
                            {user.role === "FREELANCER" && (
                                <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <h3 style={{ marginTop: 0, color: '#111827', fontSize: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: 10, marginBottom: 20 }}>Portfolio</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                                        {/* Mock Portfolio Items for Visuals */}
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                                <div style={{ height: 120, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Project {i}</div>
                                                <div style={{ padding: 10, fontSize: '0.9rem', fontWeight: 600 }}>Demo Project</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 20, fontSize: '0.9rem' }}>Portfolio uploads coming soon...</p>
                                </section>
                            )}
                        </div>

                        {/* Right Column (Freelancer Only) */}
                        {user.role === "FREELANCER" && (
                            <div>
                                <section style={{
                                    background: 'white', padding: '30px', borderRadius: '16px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'sticky', top: 20
                                }}>
                                    <h3 style={{ marginTop: 0, color: '#111827', fontSize: '1.25rem', marginBottom: 20 }}>Skills</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {profile.skills ? profile.skills.split(',').map((skill, idx) => (
                                            <span key={idx} style={{
                                                background: '#ecfdf5', color: '#047857', padding: '6px 12px',
                                                borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600
                                            }}>
                                                {skill.trim()}
                                            </span>
                                        )) : <span style={{ color: '#9ca3af' }}>No skills listed</span>}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER EDIT MODE (Form) ---
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '40px 20px' }}>
            <Navbar />
            <div className="card" style={{ maxWidth: 600, margin: '40px auto', padding: 30 }}>
                <h2 style={{ marginBottom: 20 }}>Edit Profile</h2>

                <div style={{ display: 'grid', gap: 20 }}>
                    <div>
                        <label className="small display-block">Full Name</label>
                        <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="small display-block">Email</label>
                        <input className="input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    {user.role === "FREELANCER" && (
                        <>
                            <div>
                                <label className="small display-block">Professional Title</label>
                                <input
                                    className="input"
                                    placeholder="e.g. Senior Full Stack Developer"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="small display-block">Bio</label>
                                <textarea
                                    className="textarea"
                                    rows={5}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="small display-block">Skills (comma separated)</label>
                                <input
                                    className="input"
                                    value={formData.skills}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                />
                            </div>
                            <div className="grid-2">
                                <div>
                                    <label className="small display-block">Hourly Rate ($)</label>
                                    <input
                                        className="input" type="number"
                                        value={formData.hourlyRate}
                                        onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="small display-block">Experience (Years)</label>
                                    <input
                                        className="input" type="number"
                                        value={formData.experience}
                                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button className="btn-muted" onClick={() => setIsEditing(false)} disabled={saving}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
