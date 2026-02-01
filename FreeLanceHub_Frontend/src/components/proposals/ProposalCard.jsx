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
  const status = proposal.status?.toUpperCase();
  const isFinalized = ["ACCEPTED", "REJECTED", "WITHDRAWN"].includes(status);
  const isAccepted = status === "ACCEPTED";

  return (
    <div className="card padded">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16, color: "#111827" }}>
              {proposal.jobTitle || (proposal.job ? proposal.job.title : `Job: ${proposal.jobId}`)}
            </h3>
            <ProposalStatusPill status={proposal.status} />
          </div>

          <div className="small" style={{ marginTop: 6 }}>
            {isClient ? (
              <>From: <span className="kbd">{proposal.freelancerName || (proposal.freelancer ? proposal.freelancer.name : "Unknown")}</span></>
            ) : (
              <>Submitted as: <span className="kbd">{proposal.freelancerName || (proposal.freelancer ? proposal.freelancer.name : "You")}</span></>
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
            {status === "PENDING" ? (
              <>
                <button className="btn-primary" onClick={() => onAccept?.(proposal)}>
                  Accept
                </button>
                <button className="btn-muted" onClick={() => onReject?.(proposal)}>
                  Reject
                </button>
              </>
            ) : (
              <span className="badge-pill" style={{ background: status === "ACCEPTED" ? "#dcfce7" : "#fee2e2", color: status === "ACCEPTED" ? "#166534" : "#991b1b" }}>
                {status}
              </span>
            )}
            <button className="btn-outline" onClick={() => onMessage?.(proposal)}>
              Message
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-muted"
              onClick={() => onEdit?.(proposal)}
              disabled={isFinalized}
              style={{ opacity: isFinalized ? 0.5 : 1, cursor: isFinalized ? 'not-allowed' : 'pointer' }}
            >
              Edit
            </button>
            <button
              className="btn-danger"
              onClick={() => onWithdraw?.(proposal)}
              disabled={isFinalized}
              style={{ opacity: isFinalized ? 0.5 : 1, cursor: isFinalized ? 'not-allowed' : 'pointer' }}
            >
              Withdraw
            </button>
            {isAccepted && (
              <button className="btn-outline" onClick={() => onMessage?.(proposal)}>
                Message
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
