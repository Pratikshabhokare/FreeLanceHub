import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles.css";
import Navbar from "./components/others/Navbar";
import HeroSection from "./components/others/HeroSection";
import TrustedBy from "./components/others/TrustedBy";
import Footer from "./components/others/Footer";
import Login from "./components/others/Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      {/* Uncomment below routes when ready to add other pages */}
      {/* <Route path="/home" element={
        <>
          <Navbar />
          <HeroSection />
          <TrustedBy />
          <Footer />
        </>
      } /> */}
    </Routes>
  );
}
