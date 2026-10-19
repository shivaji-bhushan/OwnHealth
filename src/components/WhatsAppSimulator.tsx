"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Phone, Video, MoreVertical, Send, CheckCheck, X, ShieldAlert } from "lucide-react";
import { recentWhatsAppDispatches, WhatsAppDispatchResult } from "@/lib/alerts/whatsapp";

export default function WhatsAppSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts/list");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchAlerts();
    const timer = setInterval(fetchAlerts, 8000);
    return () => clearInterval(timer);
  }, []);

  const latestAlert = alerts[0];

  return (
    <>
      {/* Floating Pill Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-emerald-700 transition-all hover:scale-105"
        title="View WhatsApp Doctor Alert Feed"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <MessageSquare className="h-4 w-4" />
        <span>Doctor WhatsApp Live Feed</span>
      </button>

      {/* Phone Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-[32px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-700">
            {/* Phone Speaker Notch */}
            <div className="mx-auto h-4 w-28 rounded-full bg-slate-800 mb-2 flex items-center justify-center">
              <div className="h-1.5 w-10 rounded-full bg-slate-700"></div>
            </div>

            {/* Inner WhatsApp Screen */}
            <div className="rounded-[24px] bg-[#efeae2] overflow-hidden flex flex-col h-[520px]">
              {/* WhatsApp Header */}
              <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-xs">
                    OH
                  </div>
                  <div>
                    <h5 className="text-xs font-bold leading-tight">Own Health Emergency Bot</h5>
                    <span className="text-[10px] text-emerald-200">Official Clinical Dispatch</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-emerald-100">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1 hover:bg-emerald-800 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans">
                {/* Security Bubble */}
                <div className="mx-auto max-w-[240px] rounded-lg bg-[#ffeecd] p-2 text-center text-[10px] text-amber-900 shadow-xs border border-amber-200/60">
                  🔒 Messages are end-to-end encrypted with cryptographic hashes verified on Sepolia.
                </div>

                {/* Alerts List */}
                {alerts.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-10">
                    No active emergency alerts yet. Click &quot;Contact Doctor&quot; on any patient report to test real-time WhatsApp dispatch!
                  </div>
                ) : (
                  alerts.slice(0, 4).map((alert, idx) => (
                    <div
                      key={alert.id || idx}
                      className="rounded-xl bg-white p-3 shadow-sm border border-slate-200/60 text-xs text-slate-800 space-y-1.5 max-w-[95%]"
                    >
                      <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-[11px]">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>URGENT PATIENT ALERT</span>
                      </div>
                      <p className="leading-relaxed text-[11px]">
                        ⚠️ <strong>{alert.patientName}</strong> ({alert.patientPhone}) has requested an urgent review for an abnormal lab report.
                      </p>
                      {alert.criticalMarkers && (
                        <div className="rounded bg-rose-50 p-1.5 text-[10px] text-rose-800 font-mono">
                          Markers: {alert.criticalMarkers}
                        </div>
                      )}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                        <a
                          href={`/doctor/dashboard?reportId=${alert.reportId}`}
                          className="text-[10px] font-bold text-clinical-600 hover:underline"
                        >
                          👉 View Doctor Portal Record
                        </a>
                        <div className="flex items-center space-x-1 text-[9px] text-slate-400">
                          <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <CheckCheck className="h-3 w-3 text-sky-500" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-[#f0f2f5] px-3 py-2 flex items-center space-x-2 border-t border-slate-200">
                <input
                  type="text"
                  readOnly
                  placeholder="Type a clinical reply..."
                  className="flex-1 rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 focus:outline-none border border-slate-200"
                />
                <button
                  disabled
                  className="rounded-full bg-[#075e54] p-1.5 text-white opacity-80"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
