"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  Upload,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
} from "lucide-react";
import BiomarkerMeter from "@/components/BiomarkerMeter";
import LifestyleCureCard from "@/components/LifestyleCureCard";
import BlockchainProofBadge from "@/components/BlockchainProofBadge";
import ContactDoctorModal from "@/components/ContactDoctorModal";
import { Biomarker, LabReportDetail } from "@/types";

function PatientDashboardContent() {
  const searchParams = useSearchParams();
  const queryReportId = searchParams.get("reportId");

  const [reports, setReports] = useState<LabReportDetail[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(queryReportId);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"ALL" | "ANOMALIES" | "METABOLIC" | "LIPID">("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (queryReportId && reports.some((r) => r.id === queryReportId)) {
      setSelectedReportId(queryReportId);
    } else if (reports.length > 0 && !selectedReportId) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, queryReportId]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/list");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        if (data.reports?.length > 0 && !selectedReportId) {
          setSelectedReportId(data.reports[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];
  const analysis = activeReport?.analysis;

  // Filter biomarkers
  const allBiomarkers: Biomarker[] = analysis?.extractedBiomarkers || [];
  const filteredBiomarkers = allBiomarkers.filter((b) => {
    if (filterMode === "ANOMALIES") return b.status !== "NORMAL";
    if (filterMode === "METABOLIC") return b.category === "METABOLIC";
    if (filterMode === "LIPID") return b.category === "LIPID";
    return true;
  });

  const anomaliesList = analysis?.anomalies || [];
  const overallScore = analysis?.overallScore ?? 75;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-clinical-700 uppercase tracking-wider">
            <Activity className="h-4 w-4" />
            <span>Patient Longevity &amp; Telemetry Portal</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight">
            Personal Health Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Autonomous health tracking, AI biomarker insights, and immutable Web3 clinical proof
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReports}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link
            href="/patient/upload"
            className="flex items-center space-x-2 rounded-xl bg-clinical-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-clinical-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Report</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-clinical-600 border-t-transparent" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading Clinical Records...</p>
          </div>
        </div>
      ) : reports.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-clinical-50 text-clinical-600 mb-4">
            <Activity className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Lab Reports Uploaded Yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Upload your blood work or test with preloaded clinical diagnostic panels to view AI
            biomarker analysis.
          </p>
          <div className="mt-5">
            <Link
              href="/patient/upload"
              className="inline-flex items-center space-x-2 rounded-xl bg-clinical-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-clinical-700"
            >
              <Upload className="h-4 w-4" />
              <span>Upload First Lab Report</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Active Report Dashboard */
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Health Score Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Overall Health Score
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  {overallScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    overallScore >= 80
                      ? "bg-emerald-100 text-emerald-800"
                      : overallScore >= 60
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {overallScore >= 80
                    ? "Optimal Longevity"
                    : overallScore >= 60
                    ? "Restorative Lifestyle Needed"
                    : "Urgent Attention Needed"}
                </span>
              </div>
            </div>

            {/* Anomalies Count */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Flagged Anomalies
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-amber-600 font-mono">
                  {anomaliesList.length}
                </span>
                <span className="text-xs text-slate-400">/ {allBiomarkers.length} markers</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                {anomaliesList.length > 0
                  ? "Lifestyle modifications synthesized below"
                  : "All monitored markers within normal bounds"}
              </p>
            </div>

            {/* Web3 Immutability */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Blockchain Anchoring
              </span>
              <div className="mt-2 flex items-center space-x-1.5 text-clinical-700 font-bold text-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>Dual-Chain Verified</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Ethereum Sepolia Testnet + Stellar Horizon Memo Proofs Active
              </p>
            </div>

            {/* Report Switcher */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Viewing Lab Report
              </span>
              <select
                value={activeReport.id}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 py-1.5 px-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-clinical-600"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.originalFileName} ({new Date(r.createdAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Reports: {reports.length}</span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                  CID: {activeReport.ipfsCid?.slice(0, 10)}...
                </span>
              </div>
            </div>
          </div>

          {/* Emergency / Doctor Consultation Banner */}
          <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-amber-50 to-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Physician Review &amp; WhatsApp Triage
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                    Concerned about elevated markers? Instantly dispatch an encrypted anomaly
                    brief directly to your attending doctor&apos;s WhatsApp with direct portal access.
                  </p>
                </div>
              </div>

              <ContactDoctorModal
                reportId={activeReport.id}
                patientName={activeReport.patient?.name || "Alex Patel"}
                patientPhone={activeReport.patient?.phone || "+15551234567"}
                anomaliesSummary={anomaliesList.map((a) => `${a.name}: ${a.value} ${a.unit}`)}
              />
            </div>
          </div>

          {/* Blockchain Proof Badge */}
          <BlockchainProofBadge
            ipfsCid={activeReport.ipfsCid}
            sepoliaTxHash={activeReport.sepoliaTxHash}
            stellarTxHash={activeReport.stellarTxHash}
            createdAt={activeReport.createdAt}
          />

          {/* Biomarkers Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Biometric Telemetry &amp; Clinical Gauges
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time visual progress meters tracking clinical reference thresholds
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  onClick={() => setFilterMode("ALL")}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    filterMode === "ALL"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({allBiomarkers.length})
                </button>
                <button
                  onClick={() => setFilterMode("ANOMALIES")}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    filterMode === "ANOMALIES"
                      ? "bg-white text-amber-800 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Anomalies ({anomaliesList.length})
                </button>
                <button
                  onClick={() => setFilterMode("METABOLIC")}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    filterMode === "METABOLIC"
                      ? "bg-white text-clinical-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Metabolic
                </button>
                <button
                  onClick={() => setFilterMode("LIPID")}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    filterMode === "LIPID"
                      ? "bg-white text-brand-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Lipids
                </button>
              </div>
            </div>

            {/* Biomarker Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBiomarkers.map((b, idx) => (
                <BiomarkerMeter key={idx} biomarker={b} />
              ))}
            </div>
          </div>

          {/* Natural Lifestyle Cures */}
          {analysis?.lifestyleRecommendations && (
            <LifestyleCureCard lifestyle={analysis.lifestyleRecommendations} />
          )}
        </div>
      )}
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-600 border-t-transparent" />
        </div>
      }
    >
      <PatientDashboardContent />
    </Suspense>
  );
}

