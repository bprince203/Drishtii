import { AnimatedBackground } from '@/components/animated-background';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Home from '@/pages/Home';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
