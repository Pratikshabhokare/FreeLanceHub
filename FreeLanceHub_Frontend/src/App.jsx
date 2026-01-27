import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles.css";

import LandingPage from "./pages/LandingPage";
import SearchDiscovery from "./pages/SearchDiscovery";

// Client
import JobManagementPage from "./pages/client/JobManagementPage";
import ClientInboxPage from "./pages/client/ClientInboxPage";

// Freelancer
import DiscoverPage from "./pages/freelancer/DiscoverPage";
import MyProposalsPage from "./pages/freelancer/MyProposalsPage";
import EarningsPage from "./pages/freelancer/EarningsPage";
import Login from "./components/others/Login";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/login" element={<Login />} />

      {/* Client Protected Routes */}
      <Route element={<ProtectedRoute role="CLIENT" />}>
        <Route path="/client/jobs" element={<JobManagementPage />} />
        <Route path="/client/inbox" element={<ClientInboxPage />} />
      </Route>

      {/* Freelancer Protected Routes */}
      <Route element={<ProtectedRoute role="FREELANCER" />}>
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/freelancer/proposals" element={<MyProposalsPage />} />
        <Route path="/freelancer/earnings" element={<EarningsPage />} />
      </Route>

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/search" element={<SearchDiscovery />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
