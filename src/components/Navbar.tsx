"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Activity,
  Shield,
  Upload,
  UserCheck,
  Stethoscope,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { UserSession } from "@/types";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingAlertCount, setPendingAlertCount] = useState(0);

  useEffect(() => {
    fetchUser();
    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 12000);
    return () => clearInterval(interval);
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const fetchAlertCount = async () => {
    try {
      const res = await fetch("/api/alerts/list");
      if (res.ok) {
        const data = await res.json();
        const pending = (data.alerts || []).filter(
          (a: { status: string }) => a.status === "PENDING"
        ).length;
        setPendingAlertCount(pending);
      }
    } catch {
      // silent
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const switchRole = async (targetRole: "PATIENT" | "DOCTOR") => {
    const payload =
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

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchUser();
      if (targetRole === "DOCTOR") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-600 to-brand-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-lg tracking-tight">Own Health</span>
              <span className="rounded-full bg-clinical-100 px-2 py-0.5 text-[10px] font-semibold text-clinical-700 tracking-wide uppercase">
                Web3 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Decentralized Medical Intelligence</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/patient/dashboard"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/patient/dashboard")
                ? "bg-clinical-50 text-clinical-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Patient Portal
          </Link>

          <Link
            href="/patient/upload"
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/patient/upload"
                ? "bg-clinical-50 text-clinical-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Report</span>
          </Link>

          <Link
            href="/doctor/dashboard"
            className={`relative flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/doctor/dashboard")
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Doctor Dashboard</span>
            {pendingAlertCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white animate-bounce">
                {pendingAlertCount}
              </span>
            )}
          </Link>
        </nav>

        {/* User Role Switcher & Profile */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Quick Demo Switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => switchRole("PATIENT")}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                user?.role === "PATIENT"
                  ? "bg-white text-clinical-700 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Patient View
            </button>
            <button
              onClick={() => switchRole("DOCTOR")}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                user?.role === "DOCTOR"
                  ? "bg-white text-brand-700 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Doctor View
            </button>
          </div>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {user.role === "DOCTOR" ? "MD Clinician" : user.phone}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-clinical-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clinical-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          {pendingAlertCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {pendingAlertCount}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/patient/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Patient Portal
          </Link>
          <Link
            href="/patient/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Upload Lab Report
          </Link>
          <Link
            href="/doctor/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Doctor Dashboard</span>
            {pendingAlertCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {pendingAlertCount}
              </span>
            )}
          </Link>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                switchRole(user?.role === "DOCTOR" ? "PATIENT" : "DOCTOR");
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-clinical-600"
            >
              Switch to {user?.role === "DOCTOR" ? "Patient" : "Doctor"} View
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="text-xs font-semibold text-clinical-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
