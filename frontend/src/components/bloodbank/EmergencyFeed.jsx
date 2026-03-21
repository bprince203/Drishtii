/**
 * Emergency Feed — Prajnaa Blood Bank
 * Live-updating feed of OPEN emergency requests.
 * Polls every 30 seconds. Public endpoint — no auth required.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, MapPin, Building2, Clock, Bell, RefreshCw } from 'lucide-react';
import { BLOOD_GROUP_LABELS, API_BASE } from '../../types/bloodbankTypes';

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const urgencyStyles = {
  CRITICAL: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
  HIGH: 'bg-amber-100 text-amber-700 border-amber-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export function EmergencyFeed() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/bloodbank/emergency?limit=20`);
      if (resp.ok) {
        const data = await resp.json();
        setRequests(data.requests || []);
      }
    } catch {
      // Silent fail on poll
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + poll every 30s
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
          <span className="text-sm text-slate-500">Loading emergency feed...</span>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <Bell className="h-6 w-6 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No open emergency requests right now.</p>
        <p className="text-xs text-slate-400 mt-1">New requests will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700">Live Emergency Requests</h3>
        </div>
        <button onClick={fetchRequests} className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {requests.map((req, i) => {
            const bgLabel = BLOOD_GROUP_LABELS[req.bloodGroup] || req.bloodGroup;
            const notifCount = req._count?.notifications || 0;
            const urgencyClass = urgencyStyles[req.urgencyLevel] || urgencyStyles.HIGH;

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {/* Blood Group Badge */}
                      <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-100 inline-flex items-center gap-1">
                        <Droplets className="h-3 w-3" /> {bgLabel}
                      </span>
                      {/* Urgency Badge */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${urgencyClass}`}>
                        {req.urgencyLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {req.hospitalName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {req.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                      <Clock className="h-3 w-3" /> {timeAgo(req.createdAt)}
                    </div>
                    {notifCount > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {notifCount} notified
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
