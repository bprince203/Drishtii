/**
 * Blood Bank Locator — Prajnaa
 * Search external blood bank directory with city/state/blood group filters.
 * Results in card-hover cards with animated expand/collapse detail view.
 *
 * Design: glass filter bar, card-hover results, staggered entry, skeleton loading.
 * A11y: proper labels, keyboard Enter-to-search, aria-expanded, focus rings.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Phone, Clock, ChevronDown, ChevronUp, Building2, Loader2 } from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_GROUP_LABELS, INDIAN_STATES, API_BASE } from '../../types/bloodbankTypes';

/** Shared input classname for consistency */
const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300/60 focus:border-rose-200 transition-all duration-200';

export function BloodBankLocator() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!city.trim() && !state && !bloodGroup) {
      setError('Please enter at least one search criteria.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedId(null);

    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set('city', city.trim());
      if (state) params.set('state', state);
      if (bloodGroup) params.set('bloodGroup', bloodGroup);

      const resp = await fetch(`${API_BASE}/api/bloodbank/locator/banks?${params}`);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error?.message || 'Failed to search blood banks.');
      }

      const bankList = Array.isArray(data) ? data : data.banks || data.results || [];
      setResults(bankList);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [city, state, bloodGroup]);

  /** Allow Enter key to trigger search from any filter input */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch],
  );

  const toggleBank = (bankId) => {
    setSelectedId((prev) => (prev === bankId ? null : bankId));
  };

  return (
    <div className="space-y-6">
      {/* ═══ Filter Bar ═══ */}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label htmlFor="bb-city" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              City
            </label>
            <input
              id="bb-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Mumbai"
              autoComplete="off"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="bb-state" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              State
            </label>
            <select id="bb-state" value={state} onChange={(e) => setState(e.target.value)} onKeyDown={handleKeyDown} className={INPUT_CLASS}>
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bb-bg" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Blood Group
            </label>
            <select id="bb-bg" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} onKeyDown={handleKeyDown} className={INPUT_CLASS}>
              <option value="">All Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>{bg.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all disabled:opacity-60 inline-flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </motion.button>
          {results && !isLoading && (
            <span className="text-xs text-slate-400">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ═══ Error ═══ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Loading Skeletons ═══ */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-3" />
                  <div className="h-3 bg-slate-50 rounded-lg w-1/2 mb-3" />
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="h-5 w-8 bg-rose-50 rounded" />
                    ))}
                  </div>
                </div>
                <div className="h-5 w-12 bg-slate-50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ Results ═══ */}
      {!isLoading && results && (
        <>
          {results.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="inline-flex p-5 bg-rose-50 rounded-2xl mb-5">
                <Building2 className="h-10 w-10 text-rose-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No blood banks found</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Try another city, different state, or broaden your blood group filter.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((bank, i) => {
                const bankKey = bank.id || `bank-${i}`;
                const isExpanded = selectedId === bankKey;
                const bloodGroups = Array.isArray(bank.bloodGroups) ? bank.bloodGroups : [];

                return (
                  <motion.div
                    key={bankKey}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="rounded-2xl bg-white border border-slate-200/60 overflow-hidden card-hover"
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => toggleBank(bankKey)}
                      aria-expanded={isExpanded}
                      className="w-full text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-inset rounded-t-2xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-3">
                          <h3 className="font-semibold text-slate-800 mb-1 truncate">{bank.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{bank.city || bank.address}{bank.state ? `, ${bank.state}` : ''}</span>
                          </div>
                          {bloodGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {bloodGroups.slice(0, 6).map((bg) => (
                                <span key={bg} className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-600 border border-rose-100">
                                  {BLOOD_GROUP_LABELS[bg] || bg}
                                </span>
                              ))}
                              {bloodGroups.length > 6 && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-50 text-slate-500">
                                  +{bloodGroups.length - 6}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {bank.isOpen !== undefined && (
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                              bank.isOpen
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-slate-50 text-slate-500 border border-slate-100'
                            }`}>
                              {bank.isOpen ? '● Open' : '○ Closed'}
                            </span>
                          )}
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 p-5 bg-slate-50/40 space-y-3">
                            {bank.address && (
                              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <span>{bank.address}</span>
                              </div>
                            )}
                            {bank.phone && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <a
                                  href={`tel:${bank.phone}`}
                                  className="text-rose-600 font-medium hover:underline underline-offset-2"
                                >
                                  {bank.phone}
                                </a>
                              </div>
                            )}
                            {bank.timing && (
                              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span>{bank.timing}</span>
                              </div>
                            )}
                            {bloodGroups.length > 0 && (
                              <div className="pt-1">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Blood Groups</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {bloodGroups.map((bg) => (
                                    <span key={bg} className="px-2 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                                      {BLOOD_GROUP_LABELS[bg] || bg}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
