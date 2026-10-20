"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Database,
  Lock,
  Layers,
  Loader2,
} from "lucide-react";
import SampleReportsModal from "@/components/SampleReportsModal";
import BiomarkerMeter from "@/components/BiomarkerMeter";
import LifestyleCureCard from "@/components/LifestyleCureCard";
import BlockchainProofBadge from "@/components/BlockchainProofBadge";
import ContactDoctorModal from "@/components/ContactDoctorModal";
import { SampleReportPreset } from "@/lib/samples/labReports";

interface ProcessingStep {
  label: string;
  sub: string;
  done: boolean;
  active: boolean;
}

export default function PatientUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportText, setReportText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processingSteps: ProcessingStep[] = [
    {
      label: "Biomarker & OCR Extraction",
      sub: "Scanning clinical metrics (Glucose, Lipids, Pressure, Panels)...",
      done: currentStepIndex > 0,
      active: currentStepIndex === 0 && isProcessing,
    },
    {
      label: "Clinical Range Cross-Referencing",
      sub: "Comparing values against international pathology ranges...",
      done: currentStepIndex > 1,
      active: currentStepIndex === 1 && isProcessing,
    },
    {
      label: "LLM Functional Lifestyle Synthesis",
      sub: "Synthesizing yoga asanas, nutrition, circadian clock, pranayama...",
      done: currentStepIndex > 2,
      active: currentStepIndex === 2 && isProcessing,
    },
    {
      label: "IPFS Decentralized File Pinning",
      sub: "Generating tamper-evident cryptographic CID hash...",
      done: currentStepIndex > 3,
      active: currentStepIndex === 3 && isProcessing,
    },
    {
      label: "Multi-Chain Blockchain Anchoring",
      sub: "Ethereum Sepolia contract anchor + Stellar health score logging...",
      done: currentStepIndex > 4,
      active: currentStepIndex === 4 && isProcessing,
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    setError(null);

    const isText =
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".csv");

    if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setReportText(text || "");
      };
      reader.readAsText(file);
    } else {
      // For PDFs and images, do not dump raw binary bytes
      const sizeKb = (file.size / 1024).toFixed(1);
      setReportText(
        `[Attached Medical Document: ${file.name} (${sizeKb} KB)]\nDocument ready for AI clinical pathology extraction, anomaly scanning, and Web3 multi-chain anchoring.`
      );
    }
  };

  const handleSelectPreset = (preset: SampleReportPreset) => {
    setSelectedFile(null);
    setFileName(preset.fileName);
    setReportText(preset.rawText);
    setError(null);
  };

  const executePipeline = async () => {
    if (!reportText && !selectedFile) {
      setError("Please select or upload a lab report file or choose a preset.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStepIndex(0);

    // Step progression animation ticker
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 700);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (reportText && !reportText.startsWith("[Attached Medical Document:")) {
        formData.append("text", reportText);
      }
      formData.append("fileName", fileName || selectedFile?.name || "lab_report.pdf");

      const res = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze lab report.");
      }

      clearInterval(interval);
      setCurrentStepIndex(5);
      setAnalysisResult(data);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Failed to process report");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-clinical-700 uppercase tracking-wider">
          <Activity className="h-4 w-4" />
          <span>Clinical Telemetry Ingestion</span>
        </div>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Upload & Analyze Lab Report
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">
          Ingest blood work, metabolic panels, or pathology reports. Our clinical AI pipeline
          extracts biomarkers, generates evidence-based lifestyle protocols, and immutably anchors
          your records on Ethereum Sepolia and Stellar.
        </p>
      </div>

      {!analysisResult ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Card */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
                dragActive
                  ? "border-clinical-600 bg-clinical-50/50 scale-[1.01]"
                  : "border-slate-300 bg-white hover:border-clinical-500 hover:bg-slate-50/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-clinical-50 text-clinical-600 mb-4 shadow-xs">
                <Upload className="h-8 w-8" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {fileName ? fileName : "Drag and drop your lab report here"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Supports PDF, PNG, JPG, and raw pathology text
              </p>

              <div className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                <span>Browse Files From Computer</span>
              </div>
            </div>

            {/* Selected File / Text Preview */}
            {fileName && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-clinical-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{fileName}</h4>
                      <span className="text-[11px] text-slate-400">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB file loaded`
                          : `${reportText.length} characters loaded`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFileName("");
                      setReportText("");
                      setError(null);
                    }}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {reportText.startsWith("[Attached Medical Document:") ? (
                  <div className="rounded-xl bg-emerald-50/70 p-4 text-xs text-emerald-800 border border-emerald-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">
                        {fileName} attached successfully.
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Our clinical AI pipeline will extract blood panels, metabolic markers, and lipid profiles from this document upon submission.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-xl bg-slate-50 p-3 text-xs font-mono text-slate-700 border border-slate-200/70 whitespace-pre-wrap">
                    {reportText}
                  </div>
                )}
              </div>
            )}

            {/* Diagnostic Presets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SampleReportsModal onSelectSample={handleSelectPreset} />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={executePipeline}
              disabled={isProcessing || (!reportText && !selectedFile)}
              className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-clinical-600 py-4 text-sm font-bold text-white shadow-lg shadow-clinical-600/20 hover:bg-clinical-700 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Executing Clinical Analysis Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Start AI Analysis & Web3 Anchoring</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Pipeline Process Visualizer */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-clinical-600" />
                Pipeline Orchestration
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Automated multi-stage clinical extraction and multi-chain verification
              </p>

              <div className="mt-6 space-y-4">
                {processingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        step.done
                          ? "bg-emerald-600 text-white shadow-xs"
                          : step.active
                          ? "border-2 border-clinical-600 bg-clinical-50 text-clinical-700 animate-pulse"
                          : "border border-slate-300 bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div>
                      <h5
                        className={`text-xs font-bold ${
                          step.done || step.active ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security info */}
              <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-clinical-600" />
                  <span>Zero-knowledge hashing prevents identity leaks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-brand-600" />
                  <span>Raw reports pinned immutably on IPFS nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Top Banner with Health Score & Emergency Action */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Analysis &amp; Web3 Anchoring Complete</span>
                </div>
                <h2 className="text-2xl font-extrabold sm:text-3xl tracking-tight">
                  Health Analysis: {analysisResult.originalFileName}
                </h2>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {analysisResult.analysis.summary}
                </p>
              </div>

              {/* Health Score Meter & Contact Doctor */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Score badge */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md px-6 py-4 border border-white/20 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Health Score
                  </span>
                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-white font-mono">
                      {analysisResult.analysis.overallScore}
                    </span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>

                {/* Prominent Contact Doctor Button */}
                <ContactDoctorModal
                  reportId={analysisResult.reportId}
                  anomaliesSummary={analysisResult.analysis.anomalies.map(
                    (a: any) => `${a.name}: ${a.value} ${a.unit}`
                  )}
                  onSuccess={() => {
                    // Alert dispatched
                  }}
                />
              </div>
            </div>
          </div>

          {/* Web3 Blockchain Proof Section */}
          <BlockchainProofBadge
            ipfsCid={analysisResult.ipfsCid}
            sepoliaTxHash={analysisResult.sepoliaTxHash}
            stellarTxHash={analysisResult.stellarTxHash}
          />

          {/* Biomarkers Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Extracted Biomarkers &amp; Clinical Ranges
                </h3>
                <p className="text-xs text-slate-500">
                  Visual range meters showing low, normal, and elevated ranges
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {analysisResult.analysis.extractedBiomarkers.length} Markers Analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {analysisResult.analysis.extractedBiomarkers.map((b: any, idx: number) => (
                <BiomarkerMeter key={idx} biomarker={b} />
              ))}
            </div>
          </div>

          {/* Lifestyle Protocols */}
          <LifestyleCureCard
            lifestyle={analysisResult.analysis.lifestyleRecommendations}
          />

          {/* Action Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                setAnalysisResult(null);
                setReportText("");
                setFileName("");
                setSelectedFile(null);
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Upload Another Lab Report
            </button>

            <button
              onClick={() => router.push(`/patient/dashboard?reportId=${analysisResult.reportId}`)}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <span>Go to Patient Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
