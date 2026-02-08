import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles.css";

import LandingPage from "./pages/LandingPage";
import SearchDiscovery from "./pages/SearchDiscovery";

// Client
import JobManagementPage from "./pages/client/JobManagementPage";
import ClientInboxPage from "./pages/client/ClientInboxPage";
import ClientFinancialsPage from "./pages/client/ClientFinancialsPage";

// Freelancer
import DiscoverPage from "./pages/freelancer/DiscoverPage";
import MyProposalsPage from "./pages/freelancer/MyProposalsPage";
import MyJobsPage from "./pages/freelancer/MyJobsPage";
import EarningsPage from "./pages/freelancer/EarningsPage";
import Login from "./components/others/Login";
import OAuth2RedirectHandler from "./components/auth/OAuth2RedirectHandler";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      {/* Client Protected Routes */}
      <Route element={<ProtectedRoute role="CLIENT" />}>
        <Route path="/client/jobs" element={<JobManagementPage />} />
        <Route path="/client/inbox" element={<ClientInboxPage />} />
        <Route path="/client/financials" element={<ClientFinancialsPage />} />
      </Route>

      {/* Freelancer Protected Routes */}
      <Route element={<ProtectedRoute role="FREELANCER" />}>
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/freelancer/proposals" element={<MyProposalsPage />} />
        <Route path="/freelancer/jobs" element={<MyJobsPage />} />
        <Route path="/freelancer/earnings" element={<EarningsPage />} />
      </Route>

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/search" element={<SearchDiscovery />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/messages" element={<ChatPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
