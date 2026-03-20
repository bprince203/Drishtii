/**
 * Blood Bank Locator — Prajnaa. Modern with animated results.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Droplets, Navigation, Search, MapPin,
  Phone, Loader2, AlertCircle, Clock, CheckCircle2
} from 'lucide-react';
import { searchBloodBanks } from '../services/bloodBankApi';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function BloodBank() {
  const [bloodGroup, setBloodGroup] = useState('All');
  const [city, setCity] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doSearch = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const group = bloodGroup !== 'All' ? bloodGroup : undefined;
      const data = await searchBloodBanks({ ...params, bloodGroup: group });
      const banks = data?.results || data || [];
      setResults(banks);
      if (!banks.length) setError('No blood banks found for this search. Try a different city or blood group.');
    } catch (err) {
      setError(err.message || 'Search failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [bloodGroup]);

  function handleGPS() {
    if (!navigator.geolocation) { setError('Geolocation not supported by your browser.'); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => doSearch({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setError('Location access denied. Please allow location or search by city.'); setLoading(false); }
    );
  }

  function handleCitySearch(e) {
    e.preventDefault();
    if (city.trim()) doSearch({ city: city.trim() });
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Prajnaa
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <Droplets className="h-3 w-3 text-rose-500" />
            <span className="text-[11px] font-semibold text-rose-600">Locator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Blood Bank <span className="gradient-text">Locator</span>
          </h1>
          <p className="text-slate-500 leading-relaxed max-w-lg">
            Search 50+ blood banks across India. Find by GPS or city, filter by blood group, and get contact details instantly.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white border border-slate-200/60 p-6 sm:p-8 shadow-sm mb-6"
        >
          {/* Blood Group Selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Filter by Blood Group</p>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setBloodGroup(g)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                    bloodGroup === g
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 scale-105'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* GPS Button */}
          <button
            onClick={handleGPS}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 transition-all shadow-md mb-4"
          >
            <Navigation className="h-4 w-4" />
            Use my current location
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] font-medium text-slate-300">or search by city</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* City search */}
          <form onSubmit={handleCitySearch} className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Delhi, Mumbai, Bangalore..."
                className="w-full pl-11 pr-4 py-3. text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !city.trim()}
              className="px-5 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-6 w-6 text-violet-500" />
              </motion.div>
              <p className="text-sm text-slate-400 font-medium">Searching blood banks...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 mb-6"
            >
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && results.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Results header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <p className="text-sm font-bold text-slate-900">
                    {results.length} blood bank{results.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <p className="text-xs text-slate-400">Sorted by proximity</p>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {results.map((bank, i) => (
                  <motion.div
                    key={bank.id || i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group rounded-2xl bg-white border border-slate-200/60 p-5 shadow-sm card-hover"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-600 transition-colors">
                          {bank.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{bank.city}, {bank.state}</p>
                      </div>
                      {bank.distance && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 border border-violet-100 shrink-0">
                          {bank.distance} km
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-3 flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-slate-300" />
                      {bank.address}
                    </p>

                    {/* Blood groups */}
                    {bank.availableGroups?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {bank.availableGroups.map((g) => (
                          <span
                            key={g}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              bloodGroup === g
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-50 text-slate-500'
                            }`}
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Contact */}
                    <div className="flex items-center gap-4">
                      {bank.phone && (
                        <a
                          href={`tel:${bank.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-violet-600 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          {bank.phone}
                        </a>
                      )}
                      {bank.timing && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="h-3 w-3" />
                          {bank.timing}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
