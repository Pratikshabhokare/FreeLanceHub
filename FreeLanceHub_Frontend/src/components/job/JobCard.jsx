import StatusBadge from "./StatusBadge";

export default function JobCard({ job, onView, onEdit, onDelete, onPay }) {
  return (
    <div className="card padded" style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 18, color: "#111827" }}>{job.title}</h3>
          <StatusBadge status={job.status} />
          <span className="badge-pill">
            Visibility: <span className="kbd">{job.visibility}</span>
          </span>
        </div>

        <p style={{ marginTop: 8, color: "#6b7280", lineHeight: 1.45 }}>
          {job.description}
        </p>

        <div className="pills" style={{ marginTop: 12 }}>
          {job.skills?.map((s) => (
            <span key={s} className="pill">{s}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <span className="badge-pill">
            Budget: <span className="kbd">{job.budgetType}</span>{" "}
            <span className="kbd">
              {job.budgetType === "hourly" ? `₹${job.budgetMin}/hr - ₹${job.budgetMax}/hr` : `₹${job.budgetMin} - ₹${job.budgetMax}`}
            </span>
          </span>
          <span className="badge-pill">
            Duration: <span className="kbd">{job.duration}</span>
          </span>
          <span className="badge-pill">
            Created: <span className="kbd">{job.createdAt}</span>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
        <button className="btn-primary" onClick={() => onView?.(job)} style={{ minWidth: 92 }}>
          View
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          {job.status?.toUpperCase() === "IN_PROGRESS" && (
            <button className="btn-success" onClick={() => onPay?.(job)} style={{ background: "#059669", color: "white" }}>
              Pay & Complete
            </button>
          )}
          <button className="btn-muted" onClick={() => onEdit?.(job)}>Edit</button>
          <button className="btn-danger" onClick={() => onDelete?.(job)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
