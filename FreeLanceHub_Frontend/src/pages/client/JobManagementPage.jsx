import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/others/Navbar";
import "../../pages/dashboard.css";
import JobCard from "../../components/job/JobCard";
import JobFormStepper from "../../components/job/JobFormStepper";
import PaymentModal from "../../components/common/PaymentModal";
import { getJobs, getJobsByClient, createJob, updateJob, deleteJob } from "../../services/api"; // Switched to Real API

export default function JobManagementPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  useEffect(() => {
    // initMockDb(); // Removed
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      const data = await getJobsByClient(user.id);
      setJobs(data || []);
    } else {
      setJobs([]);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesQ =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.skills || []).some((s) => s.toLowerCase().includes(q));

      const status = j.status?.toUpperCase();
      let matchesStatus = true;
      if (statusFilter === "open") matchesStatus = status === "OPEN";
      else if (statusFilter === "in_progress") matchesStatus = status === "IN_PROGRESS";
      else if (statusFilter === "closed") matchesStatus = status === "COMPLETED" || status === "CANCELLED" || status === "CLOSED";

      return matchesQ && matchesStatus;
    });
  }, [jobs, query, statusFilter]);

  const stats = useMemo(() => {
    const open = jobs.filter((j) => j.status?.toUpperCase() === "OPEN").length;
    const inProgress = jobs.filter((j) => j.status?.toUpperCase() === "IN_PROGRESS").length;
    const closed = jobs.filter((j) => ["COMPLETED", "CANCELLED", "CLOSED"].includes(j.status?.toUpperCase())).length;
    return { open, inProgress, closed, total: jobs.length };
  }, [jobs]);

  function openCreate() {
    setEditingJob(null);
    setIsModalOpen(true);
  }

  function openEdit(job) {
    setEditingJob(job);
    setIsModalOpen(true);
  }

  async function handleSubmit(form) {
    try {
      if (editingJob?.id) {
        // TODO (API): PUT /api/jobs/{id}
        await updateJob(editingJob.id, form);
      } else {
        // TODO (API): POST /api/jobs
        await createJob(form);
      }
      setIsModalOpen(false);
      setEditingJob(null);
      await load();
      alert("Job saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save job: " + err.message);
    }
  }

  async function handleDelete(job) {
    const ok = confirm(`Delete job: "${job.title}" ?`);
    if (!ok) return;
    // TODO (API): DELETE /api/jobs/{id}
    await deleteJob(job.id);
    await load();
  }

  const [paymentJob, setPaymentJob] = useState(null);

  // ...

  function handlePay(job) {
    setPaymentJob(job);
  }

  async function processPayment() {
    if (!paymentJob) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("Please login first");

      const { submitPayment } = await import("../../services/api");
      await submitPayment(paymentJob.id, user.id);

      setPaymentJob(null);
      await load();
      // Success alerting handled in Modal
    } catch (err) {
      console.error(err);
      alert("Payment failed: " + err.message);
    }
  }

  function handleView(job) {
    setViewJob(job);
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="page-header">
          <div className="page-title">
            <h1>Job Posting & Management (Client)</h1>
            <p>
              Create, edit, delete and manage your jobs. When you connect Spring Boot APIs, this page will fetch and update jobs directly from the database.
            </p>
          </div>

          <div className="toolbar">
            <span className="badge-pill">Total <span className="kbd">{stats.total}</span></span>
            <span className="badge-pill">Open <span className="kbd">{stats.open}</span></span>
            <span className="badge-pill">In Progress <span className="kbd">{stats.inProgress}</span></span>
            <span className="badge-pill">Closed <span className="kbd">{stats.closed}</span></span>

            <button className="btn-primary" onClick={openCreate}>+ Create Job</button>
          </div>
        </div>

        <div className="grid-2">
          <div className="list">
            <div className="card padded">
              <div className="row">
                <div>
                  <label className="small" style={{ display: "block", marginBottom: 6 }}>Search</label>
                  <input
                    className="input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, description, skill..."
                  />
                </div>

                <div>
                  <label className="small" style={{ display: "block", marginBottom: 6 }}>Status</label>
                  <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <p className="small" style={{ marginTop: 10 }}>
                {/* TODO (API): Implement server-side filtering and pagination if needed */}
                Currently filtering happens on frontend (dummy data). Later you can pass query params to backend.
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="card padded">
                <h3 style={{ color: "#111827" }}>No jobs found</h3>
                <p className="small" style={{ marginTop: 6 }}>
                  Try clearing filters or create a new job.
                </p>
              </div>
            ) : (
              filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={handleView}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onPay={handlePay}
                />
              ))
            )}
          </div>

          <div className="card padded">
            <h3 style={{ color: "#14532d" }}>Client dashboard</h3>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <span className="badge-pill">
                Notifications: <span className="kbd">Proposals</span>
                <span className="small">(Go to Proposals page)</span>
              </span>

              <span className="badge-pill">
                Chat: <span className="kbd">Enabled after Accept</span>
              </span>

              <p className="small" style={{ marginTop: 8, lineHeight: 1.45 }}>
                {/* TODO (API): When proposal is accepted:
                    1) Update proposal status to accepted
                    2) Update job status to in_progress
                    3) Create chat room between client and freelancer
                */}
                When you accept a proposal (on the Proposals page), update the job status to <span className="kbd">in_progress</span>. When completed, set it to <span className="kbd">closed</span>.
              </p>

              <div className="card padded" style={{ background: "#fff1db", borderColor: "#fde7c2" }}>
                <h4 style={{ color: "#14532d" }}>API mapping (Spring Boot)</h4>
                <ul style={{ marginTop: 10, paddingLeft: 18, color: "#374151", lineHeight: 1.6 }}>
                  <li><span className="kbd">GET /api/jobs</span> → list jobs</li>
                  <li><span className="kbd">POST /api/jobs</span> → create job</li>
                  <li><span className="kbd">PUT /api/jobs/{`{id}`}</span> → update job</li>
                  <li><span className="kbd">DELETE /api/jobs/{`{id}`}</span> → delete job</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewJob && (
        <div className="modal-backdrop" onClick={() => setViewJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Job details</h2>
              <button className="btn-muted" onClick={() => setViewJob(null)}>Close</button>
            </div>
            <div className="modal-body">
              <JobCard job={viewJob} />
              <p className="small" style={{ marginTop: 10 }}>
                {/* TODO (API): Create a separate Job Details route: /client/jobs/{id} */}
                You can add a separate details route later if required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingJob ? "Edit Job" : "Create Job"}</h2>
              <button className="btn-muted" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
            <div className="modal-body">
              <JobFormStepper
                initialValue={editingJob || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingJob(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* PAYMENT MODAL */}
      {
        paymentJob && (
          <PaymentModal
            job={paymentJob}
            onConfirm={processPayment}
            onCancel={() => setPaymentJob(null)}
          />
        )
      }
    </>
  );
}
