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
  getCurrentUser,
  getFreelancerProfile, // Added import
} from "../../services/api";

export default function DiscoverPage() {
  const [jobs, setJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [query, setQuery] = useState("");
  const [applyJob, setApplyJob] = useState(null);
  const [userSkills, setUserSkills] = useState([]); // State for user skills

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs || [];
    return (jobs || []).filter((j) => {
      return (
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.skills && j.skills.some((skill) => skill.toLowerCase().includes(q)))
      );
    });
  }, [jobs, query]);

  // Recommended jobs based on skills
  const recommendedJobs = useMemo(() => {
    if (userSkills.length === 0) return [];

    // Convert user skills to lowercase for case-insensitive matching
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

    return (jobs || []).filter(job => {
      if (!job.skills || job.skills.length === 0) return false;
      // Check for intersections
      return job.skills.some(jobSkill =>
        normalizedUserSkills.includes(jobSkill.toLowerCase()) ||
        normalizedUserSkills.some(us => jobSkill.toLowerCase().includes(us)) // Partial match
      );
    }).filter(job => job.status === "OPEN")
      .slice(0, 3); // Limit recommendation to top 3
  }, [jobs, userSkills]);

  const appliedJobIds = useMemo(() => new Set((myProposals || []).map((p) => p.jobId)), [myProposals]);

  async function load() {
    try {
      const publicJobs = await getPublicJobs();
      setJobs(publicJobs || []);

      const user = getCurrentUser();
      if (user) {
        const freelancerProposals = await getFreelancerProposals(user.id);
        setMyProposals(freelancerProposals || []);

        // Load profile to get skills
        try {
          const profile = await getFreelancerProfile(user.id);
          if (profile && profile.skills) {
            // "React, Java, Python" -> ["React", "Java", "Python"]
            const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(s => s);
            setUserSkills(skillsArray);
          }
        } catch (e) {
          console.log("No profile or error fetching profile for skills", e);
        }
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

          {/* Recommendation Section */}
          {userSkills.length > 0 && recommendedJobs.length > 0 && !query && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-sparkles"></i> Recommended for You
              </h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                {recommendedJobs.map(job => (
                  <DiscoveryJobCard
                    key={'rec-' + job.id}
                    job={job}
                    disabled={appliedJobIds.has(job.id)}
                    onApply={() => setApplyJob(job)}
                    highlight={true} // Maybe add a prop to style it differently?
                  />
                ))}
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', margin: '40px 0' }}></div>
              <h2 style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '15px' }}>
                All Jobs
              </h2>
            </div>
          )}

          {userSkills.length === 0 && !query && (
            <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #bbf7d0', color: '#166534' }}>
              <strong>Tip:</strong> <a href="/profile/edit" style={{ color: 'inherit', textDecoration: 'underline' }}>Add skills to your profile</a> to get personalized job recommendations.
            </div>
          )}

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
