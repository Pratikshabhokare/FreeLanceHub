import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./styles.css";
import Navbar from "./components/others/Navbar";
import HeroSection from "./components/others/HeroSection";
import TrustedBy from "./components/others/TrustedBy";
import Footer from "./components/others/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <Footer/>
    </>
  );
}


