"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ShieldCheck,
  Phone,
  KeyRound,
  User,
  Stethoscope,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+15551234567");
  const [code, setCode] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [name, setName] = useState("Alex Patel");
  const [specialty, setSpecialty] = useState("Cardiology & Lifestyle Medicine Specialist");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setSentMessage(data.message);
      setCode(data.demoCode || "123456");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code,
          role,
          name,
          specialty: role === "DOCTOR" ? specialty : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      if (role === "DOCTOR") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (targetRole: "PATIENT" | "DOCTOR") => {
    setLoading(true);
    setError(null);
    const demoPayload =
      targetRole === "DOCTOR"
        ? {
            phone: "+15550198234",
            code: "123456",
            role: "DOCTOR",
            name: "Dr. Sarah Jenkins, MD",
            specialty: "Cardiology & Lifestyle Medicine Specialist",
          }
        : {
            phone: "+15551234567",
            code: "123456",
            role: "PATIENT",
            name: "Alex Patel",
          };

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoPayload),
      });

      if (res.ok) {
        if (targetRole === "DOCTOR") {
          router.push("/doctor/dashboard");
        } else {
          router.push("/patient/dashboard");
        }
      }
    } catch (err: any) {
      setError("Failed to sign in demo account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-clinical-600 to-brand-600 text-white shadow-md">
              <Activity className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              Own Health Access
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Decentralized AI Medical Intelligence & Blockchain Patient Records
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-clinical-600" /> Instant Demo Login:
              </span>
              <span className="text-clinical-700">No SMS required</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin("PATIENT")}
                disabled={loading}
                className="flex items-center justify-center space-x-1.5 rounded-xl border border-clinical-200 bg-white py-2 px-3 text-xs font-bold text-clinical-700 shadow-xs hover:bg-clinical-50 transition-all hover:scale-[1.02]"
              >
                <User className="h-3.5 w-3.5" />
                <span>Patient Demo</span>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin("DOCTOR")}
                disabled={loading}
                className="flex items-center justify-center space-x-1.5 rounded-xl border border-brand-200 bg-white py-2 px-3 text-xs font-bold text-brand-700 shadow-xs hover:bg-brand-50 transition-all hover:scale-[1.02]"
              >
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Doctor Demo</span>
              </button>
            </div>
          </div>

          {/* Form */}
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Your Clinical Role:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("PATIENT");
                      setName("Alex Patel");
                      setPhone("+15551234567");
                    }}
                    className={`flex items-center justify-center space-x-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                      role === "PATIENT"
                        ? "border-clinical-600 bg-clinical-50 text-clinical-800 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Patient</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("DOCTOR");
                      setName("Dr. Sarah Jenkins, MD");
                      setPhone("+15550198234");
                    }}
                    className={`flex items-center justify-center space-x-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                      role === "DOCTOR"
                        ? "border-brand-600 bg-brand-50 text-brand-800 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Doctor / MD</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Patel"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-clinical-600 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                />
              </div>

              {/* Doctor Specialty if Doctor */}
              {role === "DOCTOR" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Specialty & Credentials:
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology & Lifestyle Medicine Specialist"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-clinical-600 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                  />
                </div>
              )}

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (SMS & WhatsApp):
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+15551234567"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3.5 text-xs font-mono text-slate-900 focus:border-clinical-600 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-clinical-600 py-3 text-xs font-bold text-white shadow-md hover:bg-clinical-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending SMS Verification...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Step */
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              {sentMessage && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                  {sentMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter 6-Digit Verification Code:
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3.5 text-center text-lg font-mono tracking-widest font-bold text-slate-900 focus:border-clinical-600 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                  />
                </div>
                <p className="mt-1.5 text-center text-[11px] text-slate-500">
                  Default Demo OTP is <span className="font-mono font-bold text-slate-800">123456</span>
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-clinical-600 py-3 text-xs font-bold text-white shadow-md hover:bg-clinical-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Cryptographic Session...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verify & Enter Portal</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-clinical-600" />
              Patient records encrypted & signed with Web3 zero-knowledge hashing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
