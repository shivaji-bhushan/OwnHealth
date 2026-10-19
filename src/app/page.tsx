import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Upload,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Globe,
  Stethoscope,
  Heart,
  Moon,
  Utensils,
  Wind,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl opacity-20 pointer-events-none">
          <div className="h-[450px] w-[800px] rounded-full bg-gradient-to-tr from-clinical-500 to-brand-500" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-clinical-200 bg-clinical-50/80 px-4 py-1.5 text-xs font-bold text-clinical-800 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-clinical-600 animate-ping" />
            <span>AI Clinical Telemetry + Multi-Chain Medical Immutability</span>
          </div>

          {/* Main Title */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-none">
            Empower Your Longevity with{" "}
            <span className="bg-gradient-to-r from-clinical-600 via-teal-600 to-brand-600 bg-clip-text text-transparent">
              Own Health
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
            The decentralized healthcare web platform bridging patients and clinicians with
            AI-powered lab analysis, tailored lifestyle remedies, instant WhatsApp doctor alerts,
            and permanent on-chain record anchoring on Ethereum Sepolia &amp; Stellar.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/patient/upload"
              className="inline-flex items-center space-x-2 rounded-2xl bg-clinical-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-clinical-600/25 hover:bg-clinical-700 transition-all hover:scale-105"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Lab Report</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/patient/dashboard"
              className="inline-flex items-center space-x-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <Activity className="h-4 w-4 text-clinical-600" />
              <span>Patient Dashboard</span>
            </Link>

            <Link
              href="/doctor/dashboard"
              className="inline-flex items-center space-x-2 rounded-2xl border border-brand-200 bg-brand-50 px-6 py-3.5 text-sm font-bold text-brand-800 shadow-xs hover:bg-brand-100 transition-all"
            >
              <Stethoscope className="h-4 w-4 text-brand-600" />
              <span>Doctor Console</span>
            </Link>
          </div>

          {/* Tech stack pills */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              ⚡ Next.js App Router
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              🧬 Clinical AI Pipeline
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              📦 Pinata IPFS
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              ⛓️ Ethereum Sepolia
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              🌌 Stellar Testnet
            </span>
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              💬 WhatsApp Alert Engine
            </span>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Own Health */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-clinical-700">
            Engineered For Autonomy &amp; Clinical Precision
          </h2>
          <h3 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Complete Healthcare Triad
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Pillar 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clinical-50 text-clinical-600 mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              1. AI Lab Telemetry
            </h4>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Extracts Fasting Glucose, HbA1c, Lipids, Hemoglobin, and Vitamins. Calibrates
              against standard pathology ranges with 3-tier visual status meters.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              2. Functional Lifestyle Cures
            </h4>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Synthesizes targeted yoga asanas (Mandukasana, Paschimottanasana), personalized
              low-glycemic nutrition, circadian sleep schedules, and Pranayama breathing.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              3. WhatsApp Doctor Alerts
            </h4>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              One-click emergency triage button dispatches real-time WhatsApp alert to the
              attending physician with flagged critical markers and direct portal link.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              4. Web3 Multi-Chain Proof
            </h4>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Decentralized raw file storage on IPFS, cryptographic CID anchor on Ethereum
              Sepolia smart contract, and verification score logging on Stellar Horizon.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Interactive Architecture Flow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-clinical-400">
              End-to-End Execution Flow
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              From Raw Lab Report to Clinician Triage &amp; Blockchain Proof
            </h3>
            <p className="text-xs text-slate-300">
              How Own Health protects patient privacy, uncovers health anomalies, and bridges clinical intervention
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-500/20 text-clinical-400 font-bold">
                1
              </div>
              <h5 className="font-bold text-sm text-white">Upload &amp; Extract</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                PDF/Image ingested. OCR parses biomarkers into structured JSON.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 font-bold">
                2
              </div>
              <h5 className="font-bold text-sm text-white">LLM Synthesis</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Flags anomalies and prescribes asanas, nutrition, and circadian timing.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 font-bold">
                3
              </div>
              <h5 className="font-bold text-sm text-white">WhatsApp Triage</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Doctor mobile alerted via Twilio WhatsApp with critical markers.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 font-bold">
                4
              </div>
              <h5 className="font-bold text-sm text-white">Dual-Chain Anchor</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                IPFS CID anchored to Sepolia smart contract &amp; Stellar testnet memo.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/patient/upload"
              className="inline-flex items-center space-x-2 rounded-xl bg-clinical-500 px-6 py-3 text-xs font-bold text-slate-900 shadow-md hover:bg-clinical-400 transition-colors"
            >
              <span>Test the Live Analysis Pipeline</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
