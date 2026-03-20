/**
 * AnalysisResult — Prajnaa Medical Report Analyzer
 * Rich, detailed display with sections for vital signs, issues with causes,
 * medications with dosage and notes, lifestyle advice, follow-up actions.
 * Clean, professional design that's engaging to read.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User, Activity, AlertTriangle, Pill, Heart, Clipboard,
  Stethoscope, Lightbulb, ArrowRight, ShieldAlert,
  Download, FileText, FileSpreadsheet, Check, Copy,
  ChevronDown, ChevronUp
} from 'lucide-react';

// ─── Severity / Status styling ───────────────────────────────────────
const SEVERITY = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  high: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
};

const VITAL_STATUS = {
  normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  borderline: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  abnormal: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
};

// ─── Section wrapper ─────────────────────────────────────────────────
function Section({ icon: Icon, title, children, delay = 0, accentColor = 'bg-slate-100' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`p-2 rounded-xl ${accentColor}`}>
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Expandable item ─────────────────────────────────────────────────
function ExpandableItem({ title, badge, badgeStyle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-medium text-sm text-slate-800 truncate">{title}</span>
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeStyle}`}>
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}

// ─── Download helpers ────────────────────────────────────────────────
function buildReportText(result) {
  let r = '';
  r += '══════════════════════════════════════════════════\n';
  r += '          PRAJNAA — Medical Report Analysis\n';
  r += '══════════════════════════════════════════════════\n\n';

  if (result.patient_overview) r += `Patient: ${result.patient_overview}\n`;
  r += `Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}\n\n`;

  r += '── SUMMARY ─────────────────────────────────────\n\n';
  r += `${result.summary}\n\n`;

  if (result.key_findings?.length) {
    r += '── KEY FINDINGS ────────────────────────────────\n\n';
    result.key_findings.forEach((f, i) => { r += `  ${i + 1}. ${f}\n`; });
    r += '\n';
  }

  if (result.vital_signs?.length) {
    r += '── VITAL SIGNS ─────────────────────────────────\n\n';
    result.vital_signs.forEach((v) => {
      r += `  ${v.name}: ${v.value} (Normal: ${v.normal_range}) — ${v.status.toUpperCase()}\n`;
    });
    r += '\n';
  }

  if (result.issues?.length) {
    r += '── IDENTIFIED CONDITIONS ───────────────────────\n\n';
    result.issues.forEach((issue, i) => {
      r += `  ${i + 1}. ${issue.name} [${issue.severity.toUpperCase()}]\n`;
      r += `     ${issue.description}\n`;
      if (issue.what_it_means) r += `     Impact: ${issue.what_it_means}\n`;
      if (issue.possible_causes?.length) {
        r += `     Possible Causes:\n`;
        issue.possible_causes.forEach((c) => { r += `       • ${c}\n`; });
      }
      r += '\n';
    });
  }

  if (result.medications?.length) {
    r += '── MEDICATIONS ─────────────────────────────────\n\n';
    result.medications.forEach((m, i) => {
      r += `  ${i + 1}. ${m.name}\n`;
      r += `     Purpose: ${m.purpose}\n`;
      r += `     Dosage: ${m.dosage_noted || 'Not specified'}\n`;
      if (m.important_notes) r += `     Notes: ${m.important_notes}\n`;
      if (m.common_side_effects?.length) {
        r += `     Side Effects: ${m.common_side_effects.join(', ')}\n`;
      }
      r += '\n';
    });
  }

  if (result.lifestyle_advice?.length) {
    r += '── LIFESTYLE ADVICE ────────────────────────────\n\n';
    result.lifestyle_advice.forEach((a) => { r += `  • ${a}\n`; });
    r += '\n';
  }

  if (result.follow_up_actions?.length) {
    r += '── FOLLOW-UP ACTIONS ───────────────────────────\n\n';
    result.follow_up_actions.forEach((a) => { r += `  → ${a}\n`; });
    r += '\n';
  }

  r += `Risk Level: ${result.risk_level?.toUpperCase()}\n\n`;
  r += '──────────────────────────────────────────────────\n';
  r += `DISCLAIMER: ${result.disclaimer}\n`;
  r += '──────────────────────────────────────────────────\n';
  r += '\n© 2026 Prajnaa — AI Health Platform\n';
  return r;
}

function downloadAsText(result) {
  const text = buildReportText(result);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `prajnaa-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadAsDocx(result) {
  // Build a basic HTML structure, then download as .doc (Word-compatible HTML)
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
    <head><meta charset="utf-8"><title>Prajnaa Report</title>
    <style>body{font-family:Calibri,sans-serif;color:#1e293b;line-height:1.6;margin:40px}
    h1{color:#7c3aed;font-size:22px}h2{color:#475569;font-size:16px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:24px}
    .badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700}
    .low{background:#ecfdf5;color:#047857}.moderate{background:#fffbeb;color:#b45309}.high{background:#fef2f2;color:#be123c}
    table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:1px solid #e2e8f0;padding:6px 10px;text-align:left;font-size:13px}
    th{background:#f8fafc;font-weight:600}ul{margin:4px 0}li{margin:2px 0;font-size:13px}
    .disclaimer{margin-top:24px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:11px;color:#64748b}</style></head>
    <body>
    <h1>Prajnaa — Medical Report Analysis</h1>
    <p style="color:#64748b;font-size:12px">${result.patient_overview || ''} · Generated ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>

    <h2>Summary</h2><p style="font-size:14px">${result.summary}</p>

    ${result.key_findings?.length ? `<h2>Key Findings</h2><ul>${result.key_findings.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}

    ${result.vital_signs?.length ? `<h2>Vital Signs</h2><table><tr><th>Name</th><th>Value</th><th>Normal Range</th><th>Status</th></tr>${result.vital_signs.map(v => `<tr><td>${v.name}</td><td><strong>${v.value}</strong></td><td>${v.normal_range}</td><td><span class="badge ${v.status}">${v.status}</span></td></tr>`).join('')}</table>` : ''}

    ${result.issues?.length ? `<h2>Identified Conditions</h2>${result.issues.map(i => `<div style="margin:12px 0;padding:12px;border:1px solid #e2e8f0;border-radius:8px"><strong>${i.name}</strong> <span class="badge ${i.severity}">${i.severity}</span><p style="font-size:13px;margin:4px 0">${i.description}</p>${i.what_it_means ? `<p style="font-size:12px;color:#475569"><em>Impact: ${i.what_it_means}</em></p>` : ''}${i.possible_causes?.length ? `<p style="font-size:12px;color:#64748b">Possible causes: ${i.possible_causes.join(', ')}</p>` : ''}</div>`).join('')}` : ''}

    ${result.medications?.length ? `<h2>Medications</h2>${result.medications.map(m => `<div style="margin:12px 0;padding:12px;border:1px solid #e2e8f0;border-radius:8px"><strong>${m.name}</strong><p style="font-size:13px;margin:4px 0"><em>Purpose:</em> ${m.purpose}</p><p style="font-size:12px"><em>Dosage:</em> ${m.dosage_noted || 'Not specified'}</p>${m.important_notes ? `<p style="font-size:12px;color:#b45309">⚠️ ${m.important_notes}</p>` : ''}${m.common_side_effects?.length ? `<p style="font-size:12px;color:#64748b">Side effects: ${m.common_side_effects.join(', ')}</p>` : ''}</div>`).join('')}` : ''}

    ${result.lifestyle_advice?.length ? `<h2>Lifestyle Advice</h2><ul>${result.lifestyle_advice.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}

    ${result.follow_up_actions?.length ? `<h2>Follow-Up Actions</h2><ul>${result.follow_up_actions.map(a => `<li>→ ${a}</li>`).join('')}</ul>` : ''}

    <h2>Risk Level: <span class="badge ${result.risk_level}">${result.risk_level?.toUpperCase()}</span></h2>

    <div class="disclaimer">⚕️ ${result.disclaimer}</div>
    <p style="font-size:10px;color:#94a3b8;margin-top:16px">© 2026 Prajnaa — AI Health Platform</p>
    </body></html>`;

  const blob = new Blob([html], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `prajnaa-report-${Date.now()}.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Main Component ──────────────────────────────────────────────────
export function AnalysisResult({ result, fileName }) {
  const [copied, setCopied] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(buildReportText(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  }

  return (
    <div className="space-y-4">
      {/* Patient Overview + Summary */}
      <Section icon={User} title="Patient Overview" delay={0.05} accentColor="bg-violet-50">
        {result.patient_overview && (
          <p className="text-xs text-slate-500 mb-2">{result.patient_overview}</p>
        )}
        <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
      </Section>

      {/* Key Findings */}
      {result.key_findings?.length > 0 && (
        <Section icon={Clipboard} title="Key Findings" delay={0.1} accentColor="bg-sky-50">
          <ul className="space-y-2">
            {result.key_findings.map((finding, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <ArrowRight className="h-3.5 w-3.5 text-sky-500 mt-0.5 shrink-0" />
                <span>{finding}</span>
              </motion.li>
            ))}
          </ul>
        </Section>
      )}

      {/* Vital Signs */}
      {result.vital_signs?.length > 0 && (
        <Section icon={Activity} title="Vital Signs & Lab Values" delay={0.15} accentColor="bg-emerald-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.vital_signs.map((vital, i) => {
              const s = VITAL_STATUS[vital.status] || VITAL_STATUS.normal;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className={`rounded-xl border ${s.border} ${s.bg} px-4 py-3`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500">{vital.name}</span>
                    <span className={`text-[10px] font-bold uppercase ${s.text}`}>{vital.status}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800">{vital.value}</p>
                  <p className="text-[11px] text-slate-400">Normal: {vital.normal_range}</p>
                </motion.div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Issues / Conditions */}
      {result.issues?.length > 0 && (
        <Section icon={AlertTriangle} title="Identified Conditions" delay={0.2} accentColor="bg-amber-50">
          <div className="space-y-2">
            {result.issues.map((issue, i) => {
              const sev = SEVERITY[issue.severity] || SEVERITY.low;
              return (
                <ExpandableItem
                  key={i}
                  title={issue.name}
                  badge={issue.severity}
                  badgeStyle={`${sev.bg} ${sev.text} border ${sev.border}`}
                  defaultOpen={i === 0}
                >
                  <div className="space-y-2.5">
                    <p className="text-sm text-slate-600 leading-relaxed">{issue.description}</p>
                    {issue.what_it_means && (
                      <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <Heart className="h-3.5 w-3.5 text-rose-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">{issue.what_it_means}</p>
                      </div>
                    )}
                    {issue.possible_causes?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Possible Causes</p>
                        <ul className="space-y-1">
                          {issue.possible_causes.map((cause, ci) => (
                            <li key={ci} className="text-xs text-slate-500 flex items-start gap-1.5">
                              <span className="text-slate-300 mt-0.5">•</span>{cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ExpandableItem>
              );
            })}
          </div>
        </Section>
      )}

      {/* Medications */}
      {result.medications?.length > 0 && (
        <Section icon={Pill} title="Medications" delay={0.25} accentColor="bg-cyan-50">
          <div className="space-y-2">
            {result.medications.map((med, i) => (
              <ExpandableItem key={i} title={med.name} badge={med.dosage_noted !== 'Not specified' ? med.dosage_noted : null} badgeStyle="bg-cyan-50 text-cyan-700 border border-cyan-200" defaultOpen={i === 0}>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">{med.purpose}</p>
                  {med.important_notes && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700">{med.important_notes}</p>
                    </div>
                  )}
                  {med.common_side_effects?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Side Effects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {med.common_side_effects.map((e, ei) => (
                          <span key={ei} className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-slate-500">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ExpandableItem>
            ))}
          </div>
        </Section>
      )}

      {/* Lifestyle Advice */}
      {result.lifestyle_advice?.length > 0 && (
        <Section icon={Lightbulb} title="Lifestyle Advice" delay={0.3} accentColor="bg-teal-50">
          <ul className="space-y-2">
            {result.lifestyle_advice.map((advice, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                {advice}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Follow-up Actions */}
      {result.follow_up_actions?.length > 0 && (
        <Section icon={Stethoscope} title="Follow-Up Actions" delay={0.35} accentColor="bg-rose-50">
          <ul className="space-y-2">
            {result.follow_up_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <ArrowRight className="h-3.5 w-3.5 text-rose-400 mt-0.5 shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Risk Level */}
      <Section icon={ShieldAlert} title="Overall Risk Level" delay={0.4} accentColor={`${(SEVERITY[result.risk_level] || SEVERITY.low).bg}`}>
        {(() => {
          const sev = SEVERITY[result.risk_level] || SEVERITY.low;
          return (
            <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border ${sev.border} ${sev.bg}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${sev.dot}`} />
              <span className={`text-sm font-bold uppercase ${sev.text}`}>{result.risk_level}</span>
            </div>
          );
        })()}
      </Section>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3"
      >
        <p className="text-[11px] text-slate-400 leading-relaxed">⚕️ {result.disclaimer}</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-3"
      >
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy Report</>}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDownloads(!showDownloads)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download
            <ChevronDown className={`h-3 w-3 transition-transform ${showDownloads ? 'rotate-180' : ''}`} />
          </button>

          {showDownloads && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10"
            >
              <button
                onClick={() => { downloadAsDocx(result); setShowDownloads(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-blue-500" />
                Download as DOC
              </button>
              <button
                onClick={() => { downloadAsText(result); setShowDownloads(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                Download as TXT
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
