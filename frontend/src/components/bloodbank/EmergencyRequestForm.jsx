/**
 * Emergency Request Form — Prajnaa Blood Bank
 * Create urgent blood requests and notify matched donors.
 *
 * Design: card-hover form, color-coded urgency radios, gradient submit button.
 * Code quality: shared INPUT_CLASS, useCallback, proper aria labels.
 */

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@clerk/clerk-react';
import { AlertTriangle, Phone, Building2, MapPin, MessageSquare, Loader2, CheckCircle2, Siren, ArrowRight } from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_GROUP_LABELS, URGENCY_LEVELS, INDIAN_STATES, API_BASE } from '../../types/bloodbankTypes';
import { EmergencyFeed } from './EmergencyFeed';

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300/60 focus:border-red-200 transition-all duration-200';

export function EmergencyRequestForm() {
  const { getToken } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    bloodGroup: '', city: '', state: '', hospitalName: '',
    contactPhone: '', urgencyLevel: 'HIGH', message: '',
  });

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      const resp = await fetch(`${API_BASE}/api/bloodbank/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          city: form.city.trim(),
          hospitalName: form.hospitalName.trim(),
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error?.message || 'Failed to create emergency request.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [form, getToken]);

  const resetForm = useCallback(() => {
    setResult(null);
    setForm({ bloodGroup: '', city: '', state: '', hospitalName: '', contactPhone: '', urgencyLevel: 'HIGH', message: '' });
  }, []);

  // ── Success State ──────────────────────────────────────────
  if (result) {
    const bgLabel = BLOOD_GROUP_LABELS[form.bloodGroup] || form.bloodGroup;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <div className="rounded-2xl bg-white border border-slate-200/60 p-10 text-center card-hover overflow-hidden relative">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, delay: 0.1 }}
            className="inline-flex p-5 bg-emerald-50 rounded-2xl mb-5"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </motion.div>

          <h3 className="text-2xl font-bold text-slate-800 mb-3">Emergency Request Sent!</h3>
          <p className="text-slate-600 mb-2 max-w-sm mx-auto">
            <strong className="text-slate-800">{result.matchedDonorsCount}</strong> donor{result.matchedDonorsCount !== 1 ? 's' : ''} in{' '}
            <strong className="text-slate-800">{form.city}</strong> with{' '}
            <span className="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded text-sm">{bgLabel}</span>{' '}
            blood {result.matchedDonorsCount !== 1 ? 'have' : 'has'} been notified.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Channels: <span className="font-semibold text-slate-600">SMS · WhatsApp · Email</span>
            <br />
            Contact: <strong>{form.contactPhone}</strong>
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors"
          >
            Create Another Request <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        <EmergencyFeed />
      </motion.div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/60 p-6 space-y-5 card-hover overflow-hidden relative">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-500 to-rose-500" />

        {/* Header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="p-2.5 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl shadow-lg shadow-red-500/20">
            <Siren className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Emergency Blood Request</h3>
            <p className="text-xs text-slate-500">All available matched donors nearby will be notified instantly</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="e-bg" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Blood Group Needed *</label>
            <select id="e-bg" required value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} className={INPUT_CLASS}>
              <option value="">Select...</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>{bg.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="e-hosp" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              <Building2 className="h-3 w-3 inline mr-1" />Hospital Name *
            </label>
            <input id="e-hosp" type="text" required value={form.hospitalName} onChange={(e) => updateField('hospitalName', e.target.value)} placeholder="e.g. AIIMS Delhi" className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="e-city" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              <MapPin className="h-3 w-3 inline mr-1" />City *
            </label>
            <input id="e-city" type="text" required value={form.city} onChange={(e) => updateField('city', e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="e-state" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">State *</label>
            <select id="e-state" required value={form.state} onChange={(e) => updateField('state', e.target.value)} className={INPUT_CLASS}>
              <option value="">Select...</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="e-phone" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              <Phone className="h-3 w-3 inline mr-1" />Contact Phone *
            </label>
            <input id="e-phone" type="tel" required value={form.contactPhone} onChange={(e) => updateField('contactPhone', e.target.value)} placeholder="+919876543210" className={INPUT_CLASS} />
          </div>
        </div>

        {/* Urgency Level */}
        <fieldset>
          <legend className="block text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wider">Urgency Level</legend>
          <div className="grid grid-cols-3 gap-3">
            {URGENCY_LEVELS.map((level) => {
              const isSelected = form.urgencyLevel === level.value;
              return (
                <label
                  key={level.value}
                  className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `${level.color} border-current shadow-sm ring-1 ring-current/20`
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={level.value}
                    checked={isSelected}
                    onChange={(e) => updateField('urgencyLevel', e.target.value)}
                    className="sr-only"
                  />
                  {level.value === 'CRITICAL' && <AlertTriangle className="h-3.5 w-3.5" />}
                  {level.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Message */}
        <div>
          <label htmlFor="e-msg" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            <MessageSquare className="h-3 w-3 inline mr-1" />Additional Message (optional)
          </label>
          <textarea
            id="e-msg"
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Any additional details for donors..."
            className={`${INPUT_CLASS} resize-none`}
          />
          <p className="text-[10px] text-slate-400 mt-1 text-right">{form.message.length}/500</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSaving}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2 text-base"
        >
          {isSaving ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Sending alerts to matched donors...</>
          ) : (
            <><Siren className="h-5 w-5" /> Send Emergency Alert</>
          )}
        </motion.button>
      </form>

      <EmergencyFeed />
    </div>
  );
}
