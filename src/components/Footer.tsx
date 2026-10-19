import React from "react";
import Link from "next/link";
import { Activity, Shield, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-10 pb-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-clinical-600 text-white">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">Own Health</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Decentralized AI healthcare web platform bridging patients and clinicians with
              immutable Web3 record proofs and natural lifestyle restoration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform Modules
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <Link href="/patient/upload" className="hover:text-clinical-600">
                  AI Lab Report Upload
                </Link>
              </li>
              <li>
                <Link href="/patient/dashboard" className="hover:text-clinical-600">
                  Patient Health Telemetry
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-clinical-600">
                  Doctor Consultation Triage
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-clinical-600">
                  Phone OTP Authentication
                </Link>
              </li>
            </ul>
          </div>

          {/* Web3 & Architecture */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Decentralized Infrastructure
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-clinical-600"
                >
                  <span>Ethereum Sepolia Testnet</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://stellar.expert/explorer/testnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-clinical-600"
                >
                  <span>Stellar Testnet Horizon</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://ipfs.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-clinical-600"
                >
                  <span>IPFS InterPlanetary Storage</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Clinical Disclaimer */}
          <div className="space-y-2 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-clinical-600" />
              Medical Disclaimer
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Own Health is an algorithmic health intelligence system. Insights and lifestyle
              recommendations are for educational and lifestyle management purposes only and do
              not constitute clinical diagnosis or prescription.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Own Health Network. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Built for decentralized patient autonomy and longevity.
          </p>
        </div>
      </div>
    </footer>
  );
}
