import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/others/Navbar";
import Footer from "../../components/others/Footer";
import "../dashboard.css";

import ProposalCard from "../../components/proposals/ProposalCard";
import {
  getCurrentUser,
  getFreelancerProposals,
  withdrawProposal
} from "../../services/api";

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [user, setUser] = useState(null);

  async function load() {
    try {
      const u = getCurrentUser();
      setUser(u);
      if (u) {
        const p = await getFreelancerProposals(u.id);
        setProposals(p || []);
      }
    } catch (e) {
      console.error("Failed to load proposals", e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return proposals;
    return proposals.filter((p) => p.status === statusFilter);
  }, [proposals, statusFilter]);

  async function onWithdraw(p) {
    if (!confirm("Are you sure you want to withdraw this proposal?")) return;
    try {
      await withdrawProposal(p.id);
      load();
    } catch (e) {
      alert("Failed to withdraw: " + e.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="page-header">
          <div className="page-title">
            <h1>My Proposals</h1>
            <p>Track proposals you submitted across multiple jobs.</p>
          </div>

          <div className="toolbar">
            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>

        <div className="list">
          {filtered.map((p) => (
            <ProposalCard
              key={p.id}
              proposal={p}
              mode="freelancer"
              onWithdraw={onWithdraw}
            // Editing content not supported in backend yet
            />
          ))}

          {filtered.length === 0 && (
            <div className="card padded">
              <p className="small">No proposals found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
