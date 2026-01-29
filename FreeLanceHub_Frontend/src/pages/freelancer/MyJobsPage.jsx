import { useState, useEffect } from "react";
import Navbar from "../../components/others/Navbar";
import Footer from "../../components/others/Footer";
import { getCurrentUser, updateJob, getJobsByFreelancer } from "../../services/api";
import StatusBadge from "../../components/job/StatusBadge";
import { useNavigate } from "react-router-dom";

export default function MyJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = getCurrentUser();

    console.log("Current User:", user);

    useEffect(() => {
        if (user) {
            loadJobs(user.id);
        }
    }, []);

    async function loadJobs(userId) {
        try {
            console.log("Loading jobs for user:", userId);
            const data = await getJobsByFreelancer(userId);
            if (Array.isArray(data)) {
                setJobs(data);
            } else {
                console.error("API returned non-array:", data);
                setJobs([]);
            }
        } catch (e) {
            console.error("Failed to load jobs", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(jobId, newStatus) {
        if (!confirm(`Are you sure you want to mark this job as ${newStatus}?`)) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8082/job/${jobId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            // Refresh
            loadJobs(user.id);
        } catch (e) {
            alert("Failed to update status: " + e.message);
        }
    }

    const [filter, setFilter] = useState("ACTIVE"); // ACTIVE or HISTORY

    const filteredJobs = jobs.filter(job => {
        if (filter === "ACTIVE") return job.status === "IN_PROGRESS" || job.status === "OPEN"; // Assuming assigned OPEN jobs might show up
        if (filter === "HISTORY") return job.status === "COMPLETED";
        return true;
    });

    return (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <div className="page" style={{ flex: 1 }}>
                <div className="page-header">
                    <div className="page-title">
                        <h1>My Jobs</h1>
                        <p>Manage your ongoing contracts and view job history.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={() => setFilter("ACTIVE")}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 20,
                                border: 'none',
                                background: filter === "ACTIVE" ? '#10b981' : '#e5e7eb',
                                color: filter === "ACTIVE" ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}>
                            Active
                        </button>
                        <button
                            onClick={() => setFilter("HISTORY")}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 20,
                                border: 'none',
                                background: filter === "HISTORY" ? '#10b981' : '#e5e7eb',
                                color: filter === "HISTORY" ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}>
                            History
                        </button>
                    </div>
                </div>

                {loading ? <div style={{ padding: 20 }}>Loading...</div> : (
                    <div className="list">
                        {filteredJobs.length === 0 && <div className="card padded">No {filter.toLowerCase()} jobs found.</div>}

                        {filteredJobs.map(job => (
                            <div key={job.id} className="card padded" style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{job.title}</h2>
                                        <div style={{ color: '#6b7280', marginTop: 4 }}>Client: {job.clientName || "Unknown"}</div>
                                        <div style={{ marginTop: 10 }}>
                                            <StatusBadge status={job.status} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                                        <div style={{ fontWeight: 600, color: '#059669' }}>
                                            Budget: ${job.budget}
                                        </div>

                                        {job.status === 'IN_PROGRESS' && (
                                            <button
                                                onClick={() => handleStatusChange(job.id, 'COMPLETED')}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#2563eb',
                                                    color: 'white',
                                                    borderRadius: 6,
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}>
                                                Mark as Completed
                                            </button>
                                        )}

                                        <button
                                            onClick={() => navigate('/messages', { state: { selectedChat: { id: null, partnerId: job.clientId, partnerName: job.clientName, jobTitle: job.title } } })} // Fixed: Pass minimal context if chat doesn't exist
                                            style={{
                                                padding: '8px 16px',
                                                background: 'white',
                                                color: '#374151',
                                                border: '1px solid #d1d5db',
                                                borderRadius: 6,
                                                cursor: 'pointer'
                                            }}>
                                            Message Client
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
