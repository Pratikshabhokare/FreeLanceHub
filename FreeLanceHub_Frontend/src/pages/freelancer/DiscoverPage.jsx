import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/others/Navbar";
import Footer from "../../components/others/Footer";
import "../dashboard.css";

import DiscoveryJobCard from "../../components/job/DiscoveryJobCard";
import ProposalForm from "../../components/proposals/ProposalForm";
import {
  getPublicJobs,
  getFreelancerProposals,
  submitProposal,
  getCurrentUser, // Import this
} from "../../services/api";

export default function DiscoverPage() {
  const [jobs, setJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [query, setQuery] = useState("");
  const [applyJob, setApplyJob] = useState(null);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs || [];
    return (jobs || []).filter((j) => {
      return (
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some((skill) => skill.toLowerCase().includes(q))
      );
    });
  }, [jobs, query]);

  const appliedJobIds = useMemo(() => new Set((myProposals || []).map((p) => p.jobId)), [myProposals]);

  async function load() {
    try {
      const publicJobs = await getPublicJobs();
      setJobs(publicJobs || []);

      const user = getCurrentUser();
      if (user) {
        const freelancerProposals = await getFreelancerProposals(user.id);
        setMyProposals(freelancerProposals || []);
      }
    } catch (error) {
      console.error("Failed to load jobs or proposals:", error);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmitProposal(form) {
    const user = getCurrentUser();
    if (!user) return alert("Please login first");

    const payload = {
      jobId: form.jobId,
      bidAmount: form.bidAmount,
      message: form.coverLetter, // Map coverLetter to message
    };

    try {
      await submitProposal(user.id, payload);
      setApplyJob(null);
      await load();
      alert("Proposal submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit proposal");
    }
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="page-header">
          <div className="page-title">
            <h1>Search & Discovery</h1>
            <p>Browse open jobs and apply. Your applied proposals will appear in <span className="kbd">My Proposals</span>.</p>
          </div>

          <div className="toolbar" style={{ minWidth: 280 }}>
            <input
              className="input"
              placeholder="Search jobs (title, skills, description)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="list">
          {filteredJobs.map((job) => {
            const already = appliedJobIds.has(job.id);
            return (
              <DiscoveryJobCard
                key={job.id}
                job={job}
                disabled={already || job.status?.toUpperCase() !== "OPEN"}
                onApply={() => setApplyJob(job)}
              />
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="card padded">
              <p className="small">No jobs match your search.</p>
            </div>
          )}
        </div>
      </div>

      {applyJob && (
        <div className="modal-backdrop" onMouseDown={() => setApplyJob(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Proposal</h2>
              <button className="btn-muted" onClick={() => setApplyJob(null)}>Close</button>
            </div>
            <div className="modal-body">
              <ProposalForm
                jobOptions={[applyJob]}
                initialValue={{
                  jobId: applyJob.id,
                  jobTitle: applyJob.title,
                }}
                onCancel={() => setApplyJob(null)}
                onSubmit={onSubmitProposal}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
