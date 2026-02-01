import { useState, useEffect } from "react";

export default function PaymentModal({ job, onConfirm, onCancel }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState("method"); // method | form | processing | success
    const [method, setMethod] = useState("card"); // card | upi | netbanking
    const [hours, setHours] = useState(job?.duration ? parseInt(job.duration) || 1 : 1);

    const [form, setForm] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
        upiId: "",
    });

    const isHourly = job?.budgetType === "hourly";

    // Calculate total
    let baseAmount = 0;
    if (isHourly) {
        // For hourly, we use budgetMin as the agreed hourly rate for simplicity, 
        // or average of min/max if no specific rate is set.
        // In a real app, 'agreedRate' would be in the proposal or job assignment.
        const rate = job.budgetMin || 0;
        baseAmount = rate * hours;
    } else {
        baseAmount = job?.budget || job?.budgetMin || job?.budgetMax || 0;
    }

    const platformFee = baseAmount * 0.05; // 5% fee
    const finalAmount = baseAmount + platformFee;

    function handleMethodSelect(m) {
        setMethod(m);
        setStep("form");
    }

    function handleSubmit(e) {
        e.preventDefault();
        setStep("processing");
        setIsProcessing(true);

        // Simulate gateway delay
        setTimeout(() => {
            setStep("success");
            setIsProcessing(false);

            // Auto close after success
            setTimeout(() => {
                onConfirm({ amount: finalAmount, hours: isHourly ? hours : undefined });
            }, 1500);
        }, 2500);
    }

    if (step === "success") {
        return (
            <div className="modal-backdrop">
                <div className="modal" style={{ textAlign: "center", padding: 40, maxWidth: 450 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ color: "#059669" }}>Payment Successful!</h2>
                    <p>Transaction completed via {method === "upi" ? "UPI" : method === "card" ? "Credit Card" : "Net Banking"}.</p>
                    <p className="small">Job marked as Closed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" style={{ maxWidth: 500 }}>
                <div className="modal-header">
                    <h2>Secure Payment Gateway</h2>
                    {!isProcessing && <button className="btn-muted" onClick={onCancel}>Cancel</button>}
                </div>

                <div className="modal-body">
                    {step === "processing" ? (
                        <div style={{ textAlign: "center", padding: 40 }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: 20, fontWeight: 600, fontSize: 18 }}>Processing Transaction...</p>
                            <p className="small" style={{ color: "#6b7280" }}>Connecting to {method === 'upi' ? 'UPI Server' : 'Bank'}...</p>
                            <p className="small" style={{ marginTop: 10 }}>Please do not close or refresh this page.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 20, border: "1px solid #e2e8f0" }}>
                                {isHourly && (
                                    <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                                        <label className="small" style={{ display: 'block', marginBottom: 6 }}>Hours Worked</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <input
                                                className="input"
                                                type="number"
                                                min="1"
                                                value={hours}
                                                onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 0))}
                                                style={{ width: 80 }}
                                            />
                                            <span style={{ color: '#64748b' }}>x ${job.budgetMin || 0}/hr</span>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ color: "#64748b" }}>{isHourly ? "Subtotal" : "Job Budget"}</span>
                                    <span style={{ fontWeight: 500 }}>${baseAmount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ color: "#64748b" }}>Platform Fee (5%)</span>
                                    <span style={{ fontWeight: 500 }}>${platformFee.toFixed(2)}</span>
                                </div>
                                <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 18, color: "#0f172a" }}>
                                    <span>Total Payable</span>
                                    <span>${finalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {step === "method" ? (
                                <div className="payment-methods">
                                    <p style={{ marginBottom: 12, fontWeight: 500 }}>Select Payment Method:</p>

                                    <button className="method-card" onClick={() => handleMethodSelect("card")}>
                                        <div className="icon">💳</div>
                                        <div className="info">
                                            <div className="title">Credit / Debit Card</div>
                                            <div className="subtitle">Visa, Mastercard, Amex</div>
                                        </div>
                                        <div className="arrow">→</div>
                                    </button>

                                    <button className="method-card" onClick={() => handleMethodSelect("upi")}>
                                        <div className="icon">📱</div>
                                        <div className="info">
                                            <div className="title">UPI</div>
                                            <div className="subtitle">GPay, PhonePe, Paytm</div>
                                        </div>
                                        <div className="arrow">→</div>
                                    </button>

                                    <button className="method-card" onClick={() => handleMethodSelect("netbanking")}>
                                        <div className="icon">🏦</div>
                                        <div className="info">
                                            <div className="title">Net Banking</div>
                                            <div className="subtitle">SBI, HDFC, ICICI, Axis</div>
                                        </div>
                                        <div className="arrow">→</div>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, cursor: "pointer", color: "#2563eb" }} onClick={() => setStep("method")}>
                                        <span>← Change Method</span>
                                    </div>

                                    {method === "card" && (
                                        <>
                                            <div>
                                                <label className="small">Card Number</label>
                                                <input
                                                    required
                                                    className="input"
                                                    placeholder="0000 0000 0000 0000"
                                                    maxLength={19}
                                                    value={form.cardNumber}
                                                    onChange={e => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '').substring(0, 16) })}
                                                />
                                            </div>
                                            <div className="row">
                                                <div>
                                                    <label className="small">Expiry</label>
                                                    <input
                                                        required
                                                        className="input"
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        value={form.expiry}
                                                        onChange={e => setForm({ ...form, expiry: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="small">CVV</label>
                                                    <input
                                                        required
                                                        className="input"
                                                        placeholder="123"
                                                        maxLength={3}
                                                        value={form.cvv}
                                                        onChange={e => setForm({ ...form, cvv: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="small">Cardholder Name</label>
                                                <input
                                                    required
                                                    className="input"
                                                    placeholder="Name on card"
                                                    value={form.name}
                                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {method === "upi" && (
                                        <div>
                                            <label className="small">Enter UPI ID</label>
                                            <input
                                                required
                                                className="input"
                                                placeholder="username@bank"
                                                value={form.upiId}
                                                onChange={e => setForm({ ...form, upiId: e.target.value })}
                                            />
                                            <p className="small" style={{ marginTop: 6, color: "#6b7280" }}>We will send a payment request to your UPI app.</p>
                                        </div>
                                    )}

                                    {method === "netbanking" && (
                                        <div>
                                            <label className="small">Select Bank</label>
                                            <select className="input" required>
                                                <option value="">Select your bank...</option>
                                                <option value="sbi">State Bank of India</option>
                                                <option value="hdfc">HDFC Bank</option>
                                                <option value="icici">ICICI Bank</option>
                                                <option value="axis">Axis Bank</option>
                                            </select>
                                        </div>
                                    )}

                                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 8, padding: 12, fontSize: 16 }}>
                                        Pay ${finalAmount.toFixed(2)}
                                    </button>
                                </form>
                            )}

                            <p className="small" style={{ textAlign: "center", marginTop: 20, color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <span style={{ fontSize: 14 }}>🔒</span> 100% Secure Transaction
                            </p>
                        </>
                    )}
                </div>
            </div>
            <style>{`
        .payment-methods {
          display: grid;
          gap: 12px;
        }
        .method-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .method-card:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }
        .method-card .icon {
          font-size: 24px;
        }
        .method-card .info {
          flex: 1;
        }
        .method-card .title {
          font-weight: 600;
          color: #1f2937;
        }
        .method-card .subtitle {
          font-size: 13px;
        }
        .method-card .arrow {
          color: #9ca3af;
          font-weight: bold;
        }
      `}</style>
        </div>
    );
}
