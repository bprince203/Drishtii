/**
 * Blood Bank Dashboard — Prajnaa
 * 3-tab layout: Find Blood Banks | Emergency Request | Become a Donor
 * Tabs 2 & 3 require Clerk auth.
 *
 * Uses the Prajnaa design system: glass cards, gradient-text, card-hover,
 * dot-grid pattern, and staggered motion enter animations.
 */

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowLeft, Droplets, Search, Siren, Heart, LogIn, Activity, Users, AlertTriangle } from 'lucide-react';
import { BloodBankLocator } from '../components/bloodbank/BloodBankLocator';
import { DonorRegistrationForm } from '../components/bloodbank/DonorRegistrationForm';
import { EmergencyRequestForm } from '../components/bloodbank/EmergencyRequestForm';

const TABS = [
  { id: 'locator', label: 'Find Blood Banks', icon: Search },
  { id: 'emergency', label: 'Emergency Request', icon: Siren },
  { id: 'donor', label: 'Become a Donor', icon: Heart },
];

const QUICK_STATS = [
  { icon: Activity, label: 'Live Network', value: 'Real-time' },
  { icon: Users, label: 'Notification', value: 'SMS • WhatsApp • Email' },
  { icon: AlertTriangle, label: 'Universal', value: 'O− always included' },
];

function AuthGate({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <div className="relative rounded-2xl bg-white border border-slate-200/60 p-10 text-center card-hover overflow-hidden">
            {/* Shimmer accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />

            <div className="inline-flex p-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl mb-5 shadow-lg shadow-rose-500/20">
              <LogIn className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to continue</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Create an account or sign in to register as a donor and send emergency alerts.
            </p>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35 transition-shadow"
              >
                Sign In
              </motion.button>
            </SignInButton>
          </div>
        </motion.div>
      </SignedOut>
    </>
  );
}

export default function BloodBankDashboard() {
  const [activeTab, setActiveTab] = useState('locator');
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });

  return (
    <div className="min-h-screen">
      {/* ═══ Hero Header ═══ */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/60 via-white to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-rose-200/20 via-pink-100/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-0 w-[300px] h-[300px] bg-gradient-to-br from-red-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Prajnaa
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-rose-600 tracking-wide">Blood Bank</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
              Blood{' '}
              <span
                className="gradient-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)' }}
              >
                Bank
              </span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl mb-8">
              Find banks nearby · Register as a donor · Send emergency alerts.
              <br />
              <span className="text-slate-400 text-base">Matched donors are notified instantly via SMS, WhatsApp, and Email.</span>
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 15 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
          >
            {QUICK_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <stat.icon className="h-4 w-4 text-rose-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-xs font-bold text-slate-700">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Tab Navigation + Content ═══ */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 bg-slate-100/70 p-1.5 rounded-2xl mb-8"
          role="tablist"
          aria-label="Blood bank sections"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-sm shadow-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-rose-500' : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {/* Mobile: icon only with short label */}
                <span className="sm:hidden text-xs">{tab.label.split(' ').pop()}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'locator' && (
            <motion.div
              key="locator"
              id="panel-locator"
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <BloodBankLocator />
            </motion.div>
          )}
          {activeTab === 'emergency' && (
            <motion.div
              key="emergency"
              id="panel-emergency"
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <AuthGate>
                <EmergencyRequestForm />
              </AuthGate>
            </motion.div>
          )}
          {activeTab === 'donor' && (
            <motion.div
              key="donor"
              id="panel-donor"
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <AuthGate>
                <DonorRegistrationForm />
              </AuthGate>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
