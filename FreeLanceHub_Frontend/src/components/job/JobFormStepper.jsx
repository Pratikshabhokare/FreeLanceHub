import { useMemo, useState } from "react";
import SkillSelector from "./SkillSelector";
import BudgetSelector from "./BudgetSelector";
import DurationSelector from "./DurationSelector";
import JobVisibility from "./JobVisibility";

const STEPS = [
  { key: "basic", label: "Basics" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
];

export default function JobFormStepper({ initialValue, onSubmit, onCancel }) {
  const [step, setStep] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  const [form, setForm] = useState(() => ({
    title: "",
    description: "",
    skills: [],
    budgetType: "fixed",
    budgetMin: 0,
    budgetMax: 0,
    duration: "",
    visibility: "public",
    status: "open",
    ...initialValue,
  }));

  const errors = useMemo(() => {
    const errs = {};
    if (step === 0) {
      if (!form.title.trim()) errs.title = "Title is required";
      else if (form.title.trim().length < 5) errs.title = "Min 5 chars";

      if (!form.description.trim()) errs.description = "Description is required";
      else if (form.description.trim().length < 10) errs.description = "Min 10 chars";
    }

    if (step === 1) {
      if ((form.skills || []).length === 0) errs.skills = "Select at least one skill";
      if (!form.duration) errs.duration = "Duration is required";
      if (form.budgetMin < 0) errs.budget = "Budget cannot be negative";
      if (form.budgetMax < form.budgetMin) errs.budget = "Max budget cannot be less than Min";
    }
    return errs;
  }, [form, step]);

  const isValid = Object.keys(errors).length === 0;

  function patch(p) {
    setForm((prev) => ({ ...prev, ...p }));
    // Clear validation on edit if desired, or keep it to show real-time fixes
  }

  function next() {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    setShowValidation(false);
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
    setShowValidation(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {STEPS.map((s, idx) => (
          <span
            key={s.key}
            className="badge-pill"
            style={{
              borderColor: idx === step ? "#a7f3d0" : "#e5e7eb",
              background: idx === step ? "#ecfdf5" : "#f9fafb",
              color: idx === step ? "#065f46" : "#374151",
              fontWeight: 700,
            }}
          >
            {idx + 1}. {s.label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="list">
          <div>
            <label className="small" style={{ display: "block", marginBottom: 6 }}>Job title <span style={{ color: 'red' }}>*</span></label>
            <input
              className="input"
              style={{ borderColor: showValidation && errors.title ? "red" : undefined }}
              placeholder="e.g., Build Landing Page UI"
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
            {showValidation && errors.title ? (
              <div className="small" style={{ color: "red", marginTop: 4 }}>{errors.title}</div>
            ) : (
              <div className="small" style={{ marginTop: 6 }}>Min 5 characters</div>
            )}
          </div>

          <div>
            <label className="small" style={{ display: "block", marginBottom: 6 }}>Job description <span style={{ color: 'red' }}>*</span></label>
            <textarea
              className="textarea"
              style={{ borderColor: showValidation && errors.description ? "red" : undefined }}
              placeholder="Explain requirements, scope, deliverables..."
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
            {showValidation && errors.description ? (
              <div className="small" style={{ color: "red", marginTop: 4 }}>{errors.description}</div>
            ) : (
              <div className="small" style={{ marginTop: 6 }}>Min 10 characters</div>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="list">
          <div>
            <label className="small" style={{ display: "block", marginBottom: 6 }}>Skills required <span style={{ color: 'red' }}>*</span></label>
            <SkillSelector value={form.skills} onChange={(skills) => patch({ skills })} />
            {showValidation && errors.skills && (
              <div className="small" style={{ color: "red", marginTop: 4 }}>{errors.skills}</div>
            )}
          </div>

          <BudgetSelector
            budgetType={form.budgetType}
            budgetMin={form.budgetMin}
            budgetMax={form.budgetMax}
            onChange={(p) => patch(p)}
          />
          {showValidation && errors.budget && (
            <div className="small" style={{ color: "red", marginTop: 4 }}>{errors.budget}</div>
          )}

          <div>
            <label className="small" style={{ display: "block", marginBottom: 6 }}>Duration <span style={{ color: 'red' }}>*</span></label>
            <DurationSelector value={form.duration} onChange={(duration) => patch({ duration })} />
            {showValidation && errors.duration && (
              <div className="small" style={{ color: "red", marginTop: 4 }}>{errors.duration}</div>
            )}
          </div>

          <JobVisibility value={form.visibility} onChange={(visibility) => patch({ visibility })} />

          <div>
            <label className="small" style={{ display: "block", marginBottom: 6 }}>Job status</label>
            <select className="select" value={form.status} onChange={(e) => patch({ status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p className="small" style={{ marginTop: 8 }}>
              Set to <span className="kbd">open</span> to receive proposals.
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card padded">
          <h4 style={{ color: "#14532d" }}>Review</h4>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <div><span className="small">Title:</span> <span className="kbd">{form.title}</span></div>
            <div><span className="small">Status:</span> <span className="kbd">{form.status}</span></div>
            <div><span className="small">Visibility:</span> <span className="kbd">{form.visibility}</span></div>
            <div><span className="small">Duration:</span> <span className="kbd">{form.duration}</span></div>
            <div><span className="small">Budget:</span>{" "}
              <span className="kbd">{form.budgetType}</span>{" "}
              <span className="kbd">{form.budgetType === "hourly" ? `₹${form.budgetMin}/hr - ₹${form.budgetMax}/hr` : `₹${form.budgetMin} - ₹${form.budgetMax}`}</span>
            </div>
            <div>
              <span className="small">Skills:</span>
              <div className="pills" style={{ marginTop: 8 }}>
                {(form.skills || []).map((s) => <span key={s} className="pill">{s}</span>)}
              </div>
            </div>
            <div>
              <span className="small">Description:</span>
              <p style={{ marginTop: 6, color: "#374151", lineHeight: 1.45 }}>{form.description}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 16 }}>
        <button className="btn-muted" type="button" onClick={onCancel}>
          Cancel
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button className="btn-muted" type="button" onClick={prev}>
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" type="button" onClick={next}>
              Next
            </button>
          ) : (
            <button className="btn-primary" type="button" onClick={() => onSubmit?.(form)}>
              {initialValue?.id ? "Save Changes" : "Create Job"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
