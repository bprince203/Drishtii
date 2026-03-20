import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Home from '@/pages/Home';
import HealthTwin from '@/pages/HealthTwin';
import ReportAnalyzer from '@/pages/ReportAnalyzer';
import BloodBank from '@/pages/BloodBank';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-twin" element={<HealthTwin />} />
          <Route path="/report-analyzer" element={<ReportAnalyzer />} />
          <Route path="/blood-bank" element={<BloodBank />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
