import { useEffect, useState } from "react";
import Navbar from "../../components/others/Navbar";
import { getPaymentHistory, getCurrentUser } from "../../services/api";
import "../../pages/dashboard.css";

export default function EarningsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = getCurrentUser();
        setUser(u);
        if (u) {
            load(u.id);
        }
    }, []);

    async function load(userId) {
        try {
            const data = await getPaymentHistory(userId);
            setPayments(data);
        } catch (err) {
            console.error(err);
            alert("Failed to load earnings.");
        } finally {
            setLoading(false);
        }
    }

    const totalEarnings = payments
        .filter((p) => p.payeeId === user?.id)
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <div className="page-title">
                        <h1>My Earnings & History</h1>
                        <p>View your completed jobs and payments received.</p>
                    </div>
                    <div className="toolbar">
                        <div className="card padded" style={{ background: "#ecfdf5", borderColor: "#6ee7b7", padding: "8px 16px" }}>
                            <span className="small" style={{ color: "#065f46" }}>Total Earnings</span>
                            <div style={{ fontSize: 24, fontWeight: "bold", color: "#059669" }}>
                                ${totalEarnings.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="list">
                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : payments.length === 0 ? (
                        <div className="card padded">
                            <p>No payment history found.</p>
                        </div>
                    ) : (
                        <div className="card">
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                        <th style={{ padding: 12, textAlign: "left" }} className="small">Date</th>
                                        <th style={{ padding: 12, textAlign: "left" }} className="small">Job</th>
                                        <th style={{ padding: 12, textAlign: "left" }} className="small">From/To</th>
                                        <th style={{ padding: 12, textAlign: "right" }} className="small">Amount</th>
                                        <th style={{ padding: 12, textAlign: "right" }} className="small">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p) => {
                                        const isIncoming = p.payeeId === user?.id;
                                        return (
                                            <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                                <td style={{ padding: 12 }}>{new Date(p.paymentDate).toLocaleDateString()}</td>
                                                <td style={{ padding: 12, fontWeight: 500 }}>{p.jobTitle}</td>
                                                <td style={{ padding: 12 }}>
                                                    {isIncoming ? (
                                                        <span>From: <span className="kbd">{p.payerName}</span></span>
                                                    ) : (
                                                        <span>To: <span className="kbd">{p.payeeName}</span></span>
                                                    )}
                                                </td>
                                                <td style={{ padding: 12, textAlign: "right", color: isIncoming ? "#059669" : "#dc2626", fontWeight: "bold" }}>
                                                    {isIncoming ? "+" : "-"}${p.amount}
                                                </td>
                                                <td style={{ padding: 12, textAlign: "right", fontFamily: "monospace", fontSize: 12 }}>
                                                    {p.transactionId.substring(0, 8)}...
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
