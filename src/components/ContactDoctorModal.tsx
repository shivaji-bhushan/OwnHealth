"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  Send,
  CheckCircle2,
  X,
  Phone,
  Clock,
  ShieldCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface ContactDoctorModalProps {
  reportId: string;
  patientName?: string;
  patientPhone?: string;
  anomaliesSummary?: string[];
  doctorName?: string;
  defaultDoctorPhone?: string;
  onSuccess?: () => void;
}

export default function ContactDoctorModal({
  reportId,
  patientName = "Alex Patel",
  patientPhone = "+15551234567",
  anomaliesSummary = ["Fasting Blood Glucose: 124 mg/dL", "HbA1c: 6.4%", "Triglycerides: 215 mg/dL"],
  doctorName = "Dr. Sarah Jenkins, MD",
  defaultDoctorPhone = "+15550198234",
  onSuccess,
}: ContactDoctorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [doctorPhone, setDoctorPhone] = useState(defaultDoctorPhone);
  const [loading, setLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewMessage = `⚠️ Urgent Patient Alert: ${patientName} (${patientPhone}) has requested a review for an abnormal lab report. Critical Markers: [${anomaliesSummary.join(
    ", "
  )}]. View full report: ${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/doctor/dashboard?reportId=${reportId}`;

  const handleSendAlert = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/alerts/notify-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          doctorPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch WhatsApp alert");
      }

      setDispatchResult(data.dispatch);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to send alert");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setDispatchResult(null);
    setError(null);
  };

  return (
    <>
      {/* Prominent Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center justify-center space-x-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-600/40 active:scale-[0.98]"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
        <MessageSquare className="h-5 w-5 animate-bounce" />
        <span>Contact Doctor (Instant WhatsApp Alert)</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Doctor Emergency & Triage Dispatch
                </h3>
                <p className="text-xs text-slate-500">
                  Transmits immediate cryptographic anomaly report to physician
                </p>
              </div>
            </div>

            {/* Success State */}
            {dispatchResult ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    WhatsApp Alert Dispatched!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your lab report anomaly alert was successfully sent to {dispatchResult.recipientPhone}.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Message ID:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {dispatchResult.messageId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatch Gateway:</span>
                    <span className="font-semibold text-slate-800">
                      {dispatchResult.provider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="text-slate-700 font-mono">
                      {new Date(dispatchResult.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900 text-white p-3.5 text-xs font-mono break-all leading-relaxed">
                  <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">
                    Delivered Message Payload:
                  </div>
                  {dispatchResult.formattedMessage}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${dispatchResult.recipientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      dispatchResult.formattedMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <span>Open in WhatsApp Web</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={handleClose}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Dispatch Form */
              <div className="mt-5 space-y-4">
                {/* Doctor details */}
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 text-xs font-bold">
                      MD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{doctorName}</div>
                      <div className="text-[11px] text-slate-500">
                        Attending Cardiologist & Triage Lead
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                    On Duty
                  </span>
                </div>

                {/* Recipient Phone input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Doctor WhatsApp Recipient Number:
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={doctorPhone}
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      placeholder="+15550198234"
                      className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-xs font-mono text-slate-900 focus:border-clinical-600 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                    />
                  </div>
                </div>

                {/* Critical Markers Summary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgent Biomarkers Included:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {anomaliesSummary.map((m, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-800"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preview Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Message Preview:
                  </label>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-slate-800 font-mono leading-relaxed">
                    {previewMessage}
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={handleSendAlert}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center space-x-2 rounded-xl bg-clinical-600 py-3 text-xs font-bold text-white shadow-md hover:bg-clinical-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Dispatching WhatsApp Alert...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Confirm & Dispatch WhatsApp Alert</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
