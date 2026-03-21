import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Home from '@/pages/Home';
import HealthTwin from '@/pages/HealthTwin';
import ReportAnalyzer from '@/pages/ReportAnalyzer';

const BLOOD_BANK_URL = 'https://praajna.vercel.app/';

function BloodBankRedirect() {
  useEffect(() => {
    window.location.href = BLOOD_BANK_URL;
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-slate-500 text-sm">Redirecting to Blood Bank Services…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-twin" element={<HealthTwin />} />
          <Route path="/report-analyzer" element={<ReportAnalyzer />} />
          <Route path="/blood-bank" element={<BloodBankRedirect />} />
          <Route path="/bloodbank" element={<BloodBankRedirect />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
