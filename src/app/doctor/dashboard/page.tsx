"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileText,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Send,
  User,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";
import BiomarkerMeter from "@/components/BiomarkerMeter";
import LifestyleCureCard from "@/components/LifestyleCureCard";
import BlockchainProofBadge from "@/components/BlockchainProofBadge";
import { LabReportDetail, Biomarker } from "@/types";

interface AlertItem {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  reportId: string;
  originalFileName: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  whatsappSent: boolean;
  criticalMarkers: string | null;
  doctorNotes: string | null;
  createdAt: string;
  overallScore: number;
  anomaliesCount: number;
  ipfsCid?: string | null;
  sepoliaTxHash?: string | null;
  stellarTxHash?: string | null;
}

function DoctorDashboardContent() {
  const searchParams = useSearchParams();
  const queryReportId = searchParams.get("reportId");

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<LabReportDetail | null>(null);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "REVIEWED">("ALL");

  const [doctorNotes, setDoctorNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts/list");
      if (res.ok) {
        const data = await res.json();
        const alertList: AlertItem[] = data.alerts || [];
        setAlerts(alertList);

        // Auto select first or by query
        if (alertList.length > 0) {
          if (queryReportId) {
            const match = alertList.find((a) => a.reportId === queryReportId);
            if (match) setSelectedAlertId(match.id);
            else setSelectedAlertId(alertList[0].id);
          } else if (!selectedAlertId) {
            setSelectedAlertId(alertList[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const activeAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0];

  useEffect(() => {
    if (activeAlert?.reportId) {
      fetchReportDetail(activeAlert.reportId);
      setDoctorNotes(activeAlert.doctorNotes || "");
    }
  }, [activeAlert?.reportId]);

  const fetchReportDetail = async (reportId: string) => {
    setLoadingReport(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (res.ok) {
        const data = await res.json();
        setReportDetail(data.report);
      }
    } catch (err) {
      console.error("Failed to load report detail:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleUpdateStatus = async (newStatus: "REVIEWED" | "RESOLVED") => {
    if (!activeAlert) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/alerts/${activeAlert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          doctorNotes,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchAlerts();
      }
    } catch (err) {
      console.error("Failed to update alert:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterStatus === "PENDING") return a.status === "PENDING";
    if (filterStatus === "REVIEWED") return a.status === "REVIEWED" || a.status === "RESOLVED";
    return true;
  });

  const pendingCount = alerts.filter((a) => a.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Stethoscope className="h-4 w-4" />
            <span>Clinical Triage &amp; Telemedicine Suite</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Command Center
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time emergency WhatsApp alerts, AI pathology anomaly breakdown, and Web3 cryptographic proof
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAlerts}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Triage Queue</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Alert List on Left, Active Patient View on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Alerts Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Incoming Consultation Triage
              </h3>
              {pendingCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  {pendingCount} Urgent
                </span>
              )}
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setFilterStatus("ALL")}
                className={`flex-1 rounded-lg py-1.5 text-center transition-all ${
                  filterStatus === "ALL"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setFilterStatus("PENDING")}
                className={`flex-1 rounded-lg py-1.5 text-center transition-all ${
                  filterStatus === "PENDING"
                    ? "bg-white text-red-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus("REVIEWED")}
                className={`flex-1 rounded-lg py-1.5 text-center transition-all ${
                  filterStatus === "REVIEWED"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Reviewed
              </button>
            </div>
          </div>

          {/* Alerts Scrollable List */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {loadingAlerts ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                Loading Triage Queue...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                No alerts found matching filter.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isSelected = alert.id === activeAlert?.id;
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/40 shadow-sm ring-1 ring-brand-600"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{alert.patientName}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {alert.patientPhone}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          alert.status === "PENDING"
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>

                    {/* Critical markers tag */}
                    {alert.criticalMarkers && (
                      <div className="mt-2.5 rounded-lg bg-rose-50 p-2 text-[11px] text-rose-800 border border-rose-100 line-clamp-2">
                        <span className="font-bold">Markers:</span> {alert.criticalMarkers}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-1 font-semibold text-emerald-700">
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp {alert.whatsappSent ? "Sent" : "Queued"}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Comprehensive Patient Clinical View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeAlert && reportDetail ? (
            <>
              {/* Patient Header Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-clinical-600 text-white font-bold text-xl shadow-md">
                      {reportDetail.patient?.name?.[0] || "P"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {reportDetail.patient?.name || activeAlert.patientName}
                        </h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          {activeAlert.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {reportDetail.patient?.phone || activeAlert.patientPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          {reportDetail.originalFileName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct WhatsApp Response Button */}
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://wa.me/${(reportDetail.patient?.phone || activeAlert.patientPhone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${reportDetail.patient?.name || "Patient"}, Dr. Jenkins here from Own Health. I have reviewed your latest lab report.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp Patient</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Clinical Summary & Health Score */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center sm:text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Calculated Health Score
                    </span>
                    <div className="mt-1 flex items-baseline justify-center sm:justify-start space-x-1">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        {reportDetail.analysis?.overallScore ?? 75}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 rounded-2xl bg-brand-50/50 p-4 border border-brand-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                      AI Pathology Diagnostic Summary
                    </span>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
                      {reportDetail.analysis?.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Web3 Blockchain Proof Badge */}
              <BlockchainProofBadge
                ipfsCid={reportDetail.ipfsCid}
                sepoliaTxHash={reportDetail.sepoliaTxHash}
                stellarTxHash={reportDetail.stellarTxHash}
                createdAt={reportDetail.createdAt}
              />

              {/* Categorized Anomalies & Biomarkers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Biomarker Indicators ({reportDetail.analysis?.extractedBiomarkers?.length || 0})
                  </h3>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
                    {reportDetail.analysis?.anomalies?.length || 0} Out-of-Range Flags
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {reportDetail.analysis?.extractedBiomarkers?.map((b: Biomarker, idx: number) => (
                    <BiomarkerMeter key={idx} biomarker={b} />
                  ))}
                </div>
              </div>

              {/* Lifestyle Medicine Protocol Prescribed to Patient */}
              {reportDetail.analysis?.lifestyleRecommendations && (
                <LifestyleCureCard lifestyle={reportDetail.analysis.lifestyleRecommendations} />
              )}

              {/* Doctor Review Console */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-brand-600" />
                    Doctor Clinical Notes &amp; Triage Resolution
                  </h4>
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved &amp; Updated
                    </span>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Enter clinical assessment, tele-consultation advice, or follow-up recommendation..."
                  className="w-full rounded-2xl border border-slate-300 p-3.5 text-xs text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-slate-400">
                    Signing Clinician: Dr. Sarah Jenkins, MD
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateStatus("REVIEWED")}
                      disabled={savingNotes}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-brand-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{savingNotes ? "Saving..." : "Mark as Reviewed"}</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus("RESOLVED")}
                      disabled={savingNotes}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <span>Complete &amp; Resolve</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              Select an alert from the triage queue on the left to view comprehensive patient telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <DoctorDashboardContent />
    </Suspense>
  );
}

