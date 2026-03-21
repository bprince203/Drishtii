/**
 * Donor Registration Form — Prajnaa Blood Bank
 * Register as a blood donor. Pre-fills from Clerk user data.
 * Shows existing profile with edit toggle + availability switch.
 *
 * A11y: htmlFor/id pairs, required attributes, focus rings.
 * Code quality: shared INPUT_CLASS, useCallback for handlers.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Heart, User, Mail, Phone, Droplets, MapPin, Check, Loader2, Edit3, Shield } from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_GROUP_LABELS, INDIAN_STATES, API_BASE } from '../../types/bloodbankTypes';

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300/60 focus:border-rose-200 transition-all duration-200';

const READONLY_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed';

export function DonorRegistrationForm() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sameAsPhone, setSameAsPhone] = useState(true);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', whatsapp: '', bloodGroup: '', city: '', state: '',
  });

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }, [getToken]);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ── Fetch existing profile ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const headers = await authHeaders();
        const resp = await fetch(`${API_BASE}/api/bloodbank/me`, { headers });
        if (!cancelled && resp.ok) {
          const { donor } = await resp.json();
          setProfile(donor);
          setForm({
            name: donor.name, email: donor.email, phone: donor.phone,
            whatsapp: donor.whatsapp || '', bloodGroup: donor.bloodGroup,
            city: donor.city, state: donor.state,
          });
          setSameAsPhone(!donor.whatsapp || donor.whatsapp === donor.phone);
        } else if (!cancelled) {
          setForm((f) => ({
            ...f,
            name: user?.fullName || '',
            email: user?.primaryEmailAddress?.emailAddress || '',
          }));
        }
      } catch {
        if (!cancelled) {
          setForm((f) => ({
            ...f,
            name: user?.fullName || '',
            email: user?.primaryEmailAddress?.emailAddress || '',
          }));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, authHeaders]);

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const headers = await authHeaders();
      const body = { ...form, whatsapp: sameAsPhone ? form.phone : form.whatsapp };

      const resp = await fetch(`${API_BASE}/api/bloodbank/register`, {
        method: 'POST', headers, body: JSON.stringify(body),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error?.message || 'Registration failed.');

      setProfile(data.donor);
      setIsEditing(false);
      setSuccess("You're now registered as a donor! You'll receive alerts when someone nearby needs your blood group.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [form, sameAsPhone, authHeaders]);

  // ── Availability toggle ───────────────────────────────────
  const handleAvailability = useCallback(async (isAvailable) => {
    // Optimistic update
    setProfile((prev) => prev ? { ...prev, isAvailable } : prev);
    try {
      const headers = await authHeaders();
      const resp = await fetch(`${API_BASE}/api/bloodbank/availability`, {
        method: 'PATCH', headers, body: JSON.stringify({ isAvailable }),
      });
      if (resp.ok) {
        const { donor } = await resp.json();
        setProfile(donor);
      }
    } catch {
      // Revert on failure
      setProfile((prev) => prev ? { ...prev, isAvailable: !isAvailable } : prev);
    }
  }, [authHeaders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
      </div>
    );
  }

  // ── Profile View ──────────────────────────────────────────
  if (profile && !isEditing) {
    const fields = [
      { icon: User, label: 'Name', value: profile.name },
      { icon: Mail, label: 'Email', value: profile.email },
      { icon: Phone, label: 'Phone', value: profile.phone },
      { icon: Droplets, label: 'Blood Group', value: BLOOD_GROUP_LABELS[profile.bloodGroup] || profile.bloodGroup },
      { icon: MapPin, label: 'Location', value: `${profile.city}, ${profile.state}` },
    ];

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700">{success}</p>
          </motion.div>
        )}

        <div className="rounded-2xl bg-white border border-slate-200/60 p-6 card-hover">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-800">Your Donor Profile</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <Icon className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Availability Toggle */}
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Available to Donate</p>
                <p className="text-xs text-slate-400">Toggle off when you can't donate</p>
              </div>
            </div>
            <button
              onClick={() => handleAvailability(!profile.isAvailable)}
              role="switch"
              aria-checked={profile.isAvailable}
              aria-label="Donation availability"
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                profile.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  profile.isAvailable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Registration / Edit Form ──────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/60 p-6 space-y-5 card-hover">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-lg shadow-rose-500/20">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{profile ? 'Edit Profile' : 'Register as Donor'}</h3>
            <p className="text-xs text-slate-500">Fill in your details to receive emergency blood requests</p>
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
            <label htmlFor="d-name" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name *</label>
            <input id="d-name" type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="d-email" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email *</label>
            <input id="d-email" type="email" required value={form.email} readOnly className={READONLY_CLASS} />
          </div>
          <div>
            <label htmlFor="d-phone" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone (E.164) *</label>
            <input id="d-phone" type="tel" required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+919876543210" className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="d-bg" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Blood Group *</label>
            <select id="d-bg" required value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} className={INPUT_CLASS}>
              <option value="">Select...</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>{bg.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="d-city" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">City *</label>
            <input id="d-city" type="text" required value={form.city} onChange={(e) => updateField('city', e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor="d-state" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">State *</label>
            <select id="d-state" required value={form.state} onChange={(e) => updateField('state', e.target.value)} className={INPUT_CLASS}>
              <option value="">Select...</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* WhatsApp same-as-phone */}
        <div className="flex items-center gap-2.5 py-1">
          <input
            type="checkbox"
            id="same-phone"
            checked={sameAsPhone}
            onChange={(e) => setSameAsPhone(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-300"
          />
          <label htmlFor="same-phone" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
            WhatsApp number same as phone
          </label>
        </div>

        <AnimatePresence>
          {!sameAsPhone && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <label htmlFor="d-wa" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
              <input id="d-wa" type="tel" value={form.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} placeholder="+919876543210" className={INPUT_CLASS} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all disabled:opacity-60 inline-flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
            {profile ? 'Update Profile' : 'Register as Donor'}
          </motion.button>
          {isEditing && (
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
