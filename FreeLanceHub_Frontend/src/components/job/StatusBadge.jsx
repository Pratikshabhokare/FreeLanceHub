const STATUS = {
  OPEN: { label: "Open", bg: "#ecfdf5", border: "#a7f3d0", color: "#065f46" },
  IN_PROGRESS: { label: "In Progress", bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
  COMPLETED: { label: "Completed", bg: "#d1fae5", border: "#6ee7b7", color: "#065f46" },
  CLOSED: { label: "Closed", bg: "#f3f4f6", border: "#e5e7eb", color: "#374151" },
};

export default function StatusBadge({ status = "OPEN" }) {
  const s = STATUS[status] || STATUS.OPEN;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontWeight: 600,
      }}
      title={`Job status: ${s.label}`}
    >
      {s.label}
    </span>
  );
}
