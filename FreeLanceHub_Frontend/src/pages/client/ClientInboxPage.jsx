import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/others/Navbar";
import Footer from "../../components/others/Footer";
import "../dashboard.css";

import ProposalCard from "../../components/proposals/ProposalCard";
import {
  getCurrentUser,
  getJobsByClient,
  getProposalsByJob,
  updateProposalStatus,
  createOrGetChat
} from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ClientInboxPage() {
  const [jobs, setJobs] = useState([]);
  const [activeJobId, setActiveJobId] = useState("");
  const [jobProposals, setJobProposals] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) loadJobs(u.id);
  }, []);

  useEffect(() => {
    if (activeJobId) {
      loadProposals(activeJobId);
    } else {
      setJobProposals([]);
    }
  }, [activeJobId]);

  async function loadJobs(userId) {
    try {
      const myJobs = await getJobsByClient(userId);
      setJobs(myJobs || []);
      if (myJobs && myJobs.length > 0) setActiveJobId(myJobs[0].id);
    } catch (e) {
      console.error("Failed to load jobs", e);
    }
  }

  async function loadProposals(jobId) {
    try {
      const p = await getProposalsByJob(jobId);
      setJobProposals(p);
    } catch (e) {
      console.error("Failed to load proposals", e);
    }
  }

  const activeJob = useMemo(() => jobs.find((j) => j.id === activeJobId), [jobs, activeJobId]);

  async function startChat(p) {
    try {
      // p.freelancer.id might need check if it exists in proposal object
      const chatId = await createOrGetChat(p.job.id, p.freelancer.id, user.id);
      navigate('/messages');
    } catch (e) {
      console.error("Failed to start chat", e);
      alert("Failed to start chat. Ensure freelancer info is available.");
    }
  }

  async function acceptProposal(p) {
    if (!confirm("Accept this proposal?")) return;
    try {
      await updateProposalStatus(p.id, "ACCEPTED");
      alert("Proposal accepted!");
      await loadJobs(user.id); // Reload jobs to update status in list
      loadProposals(activeJobId);
    } catch (e) {
      alert("Failed to accept: " + e.message);
    }
  }

  async function rejectProposal(p) {
    if (!confirm("Reject this proposal?")) return;
    try {
      await updateProposalStatus(p.id, "REJECTED");
      loadProposals(activeJobId);
    } catch (e) {
      alert("Failed to reject: " + e.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="page-header">
          <div className="page-title">
            <h1>Client Inbox</h1>
            <p>
              View proposals submitted by freelancers for your jobs.
            </p>
          </div>
        </div>

        <div className="grid-2">
          <div className="card padded">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h3 style={{ color: "#14532d" }}>Your Jobs</h3>
              <span className="small">Select a job to view proposals.</span>
            </div>

            <div className="list" style={{ marginTop: 14 }}>
              {jobs.map((j) => (
                <button
                  key={j.id}
                  className="card padded"
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    borderColor: activeJobId === j.id ? "#16a34a" : "#e5e7eb",
                    background: activeJobId === j.id ? "#f0fdf4" : "white"
                  }}
                  onClick={() => setActiveJobId(j.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "#111827", overflowWrap: "anywhere" }}>{j.title}</div>
                      <div className="small" style={{ marginTop: 6 }}>
                        Status: <span className="kbd">{j.status}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {jobs.length === 0 && <p className="small">No jobs found.</p>}
            </div>
          </div>

          <div>
            <div className="card padded">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ color: "#14532d" }}>Proposals</h3>
                  <div className="small" style={{ marginTop: 6 }}>
                    Job: <span className="kbd">{activeJob?.title || "—"}</span>
                  </div>
                </div>
                <span className="badge-pill">
                  Total: <span className="kbd">{jobProposals.length}</span>
                </span>
              </div>
            </div>

            <div className="list" style={{ marginTop: 14 }}>
              {jobProposals.map((p) => (
                <ProposalCard
                  key={p.id}
                  proposal={p}
                  mode="client"
                  onAccept={acceptProposal}
                  onReject={rejectProposal}
                  onMessage={startChat}
                />
              ))}

              {jobProposals.length === 0 && (
                <div className="card padded">
                  <p className="small">No proposals for this job yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
