import ProposalStatusPill from "./ProposalStatusPill";
import AttachmentList from "./AttachmentList";

export default function ProposalCard({
  proposal,
  mode = "client",
  onAccept,
  onReject,
  onWithdraw,
  onEdit,
  onMessage,
}) {
  const isClient = mode === "client";
  const isAccepted = proposal.status === "accepted";

  return (
    <div className="card padded">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16, color: "#111827" }}>
              {proposal.jobTitle || `Job: ${proposal.jobId}`}
            </h3>
            <ProposalStatusPill status={proposal.status} />
          </div>

          <div className="small" style={{ marginTop: 6 }}>
            {isClient ? (
              <>From: <span className="kbd">{proposal.freelancerName}</span></>
            ) : (
              <>Submitted as: <span className="kbd">{proposal.freelancerName}</span></>
            )}
            {" "}• On <span className="kbd">{proposal.createdAt}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span className="badge-pill">
            Bid: <span className="kbd">{proposal.bidAmount}</span>
            {proposal.bidAmount >= 50 ? <span className="small">₹</span> : <span className="small">₹/hr</span>}
          </span>
          <span className="badge-pill">
            Timeline: <span className="kbd">{proposal.timeline}</span>
          </span>
        </div>
      </div>

      <p style={{ marginTop: 12, color: "#374151", lineHeight: 1.45, overflowWrap: "anywhere" }}>
        {proposal.coverLetter}
      </p>

      <div style={{ marginTop: 12 }}>
        <div className="small" style={{ marginBottom: 6 }}>Attachments</div>
        <AttachmentList attachments={proposal.attachments || []} />
      </div>

      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
        {isClient ? (
          <>
            {proposal.status?.toUpperCase() === "PENDING" ? (
              <>
                <button className="btn-primary" onClick={() => onAccept?.(proposal)}>
                  Accept
                </button>
                <button className="btn-muted" onClick={() => onReject?.(proposal)}>
                  Reject
                </button>
              </>
            ) : (
              <span className="badge-pill" style={{ background: proposal.status?.toUpperCase() === "ACCEPTED" ? "#dcfce7" : "#fee2e2", color: proposal.status?.toUpperCase() === "ACCEPTED" ? "#166534" : "#991b1b" }}>
                {proposal.status?.toUpperCase()}
              </span>
            )}
          </>
        ) : (
          <>
            <button className="btn-muted" onClick={() => onEdit?.(proposal)} disabled={isAccepted}>
              Edit
            </button>
            <button className="btn-danger" onClick={() => onWithdraw?.(proposal)} disabled={isAccepted}>
              Withdraw
            </button>
          </>
        )}
      </div>
    </div>
  );
}
