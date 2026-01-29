import { useState } from 'react';

export default function ReviewModal({ job, onConfirm, onCancel }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onConfirm({ rating, comment });
        setSubmitting(false);
    };

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450 }}>
                <div className="modal-header">
                    <h2>Rate & Review</h2>
                    <button className="btn-muted" onClick={onCancel}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'grid', gap: 20 }}>
                    <p style={{ color: '#6b7280' }}>
                        How was your experience working with the freelancer on <strong>{job.title}</strong>?
                    </p>

                    <div>
                        <label className="small" style={{ display: 'block', marginBottom: 8 }}>Rating</label>
                        <div style={{ display: 'flex', gap: 10, fontSize: '1.5rem' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <span
                                    key={s}
                                    onClick={() => setRating(s)}
                                    style={{ cursor: 'pointer', color: s <= rating ? '#f59e0b' : '#d1d5db' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="small" style={{ display: 'block', marginBottom: 8 }}>Your Review</label>
                        <textarea
                            className="textarea"
                            rows={4}
                            placeholder="Share your feedback..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button type="button" className="btn-muted" onClick={onCancel} disabled={submitting}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
