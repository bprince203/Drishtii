/**
 * Navbar — Prajnaa. Modern glass with gradient accent + Clerk auth.
 */
import { motion } from 'motion/react';
import { NavLink, Link } from 'react-router-dom';
import { Dna, FileText, Droplets, UserCircle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const NAV_LINKS = [
  { to: '/health-twin', label: 'Health Twin', icon: Dna },
  { to: '/report-analyzer', label: 'Report Analyzer', icon: FileText },
];

const BLOOD_BANK_URL = 'https://praajna.vercel.app/';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-3"
    >
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl px-5 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Prajnaa</span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}

            {/* Blood Bank — external link */}
            <a
              href={BLOOD_BANK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            >
              <Droplets className="h-3.5 w-3.5" />
              Blood Bank
            </a>

            {/* Clerk Auth Buttons */}
            <div className="ml-2 hidden sm:block">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                    <UserCircle className="h-3.5 w-3.5" />
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
