import { useEffect, useState } from "react";
import Navbar from "../../components/others/Navbar";
import { getPaymentHistory, getCurrentUser } from "../../services/api";
import "../../pages/dashboard.css";

export default function ClientFinancialsPage() {
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
            alert("Failed to load payment history.");
        } finally {
            setLoading(false);
        }
    }

    // Filter for payments where current user is the Payer
    const totalSpent = payments
        .filter((p) => p.payerId === user?.id)
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <div className="page-title">
                        <h1>Financial Overview</h1>
                        <p>Track your project expenses and payments.</p>
                    </div>
                    <div className="toolbar">
                        <div className="card padded" style={{ background: "#fff1f2", borderColor: "#fecdd3", padding: "8px 16px" }}>
                            <span className="small" style={{ color: "#9f1239" }}>Total Spent</span>
                            <div style={{ fontSize: 24, fontWeight: "bold", color: "#e11d48" }}>
                                ${totalSpent.toLocaleString()}
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
                                        <th style={{ padding: 12, textAlign: "left" }} className="small">Recipient</th>
                                        <th style={{ padding: 12, textAlign: "right" }} className="small">Amount</th>
                                        <th style={{ padding: 12, textAlign: "right" }} className="small">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p) => {
                                        // Highlight outgoing payments
                                        const isOutgoing = p.payerId === user?.id;
                                        return (
                                            <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                                <td style={{ padding: 12 }}>{new Date(p.paymentDate).toLocaleDateString()}</td>
                                                <td style={{ padding: 12, fontWeight: 500 }}>{p.jobTitle}</td>
                                                <td style={{ padding: 12 }}>
                                                    <span className="kbd">{p.payeeName}</span>
                                                </td>
                                                <td style={{ padding: 12, textAlign: "right", color: "#dc2626", fontWeight: "bold" }}>
                                                    -${p.amount}
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
