"use client";

import React, { useState } from "react";
import { ShieldCheck, Database, ExternalLink, Copy, Check, Lock, Globe } from "lucide-react";

interface BlockchainProofBadgeProps {
  ipfsCid?: string | null;
  sepoliaTxHash?: string | null;
  stellarTxHash?: string | null;
  createdAt?: string;
  className?: string;
}

export default function BlockchainProofBadge({
  ipfsCid,
  sepoliaTxHash,
  stellarTxHash,
  createdAt,
  className = "",
}: BlockchainProofBadgeProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const ipfsGatewayUrl = ipfsCid
    ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}`
    : null;
  const sepoliaExplorerUrl = sepoliaTxHash
    ? `https://sepolia.etherscan.io/tx/${sepoliaTxHash}`
    : null;
  const stellarExplorerUrl = stellarTxHash
    ? `https://stellar.expert/explorer/testnet/tx/${stellarTxHash}`
    : null;

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/60 to-white p-5 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-clinical-600 to-brand-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Web3 Medical Immutability Proof</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Verified
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Decentralized IPFS Storage + Ethereum Sepolia Anchor + Stellar Logging
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-600">
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
            <Lock className="h-3 w-3 text-slate-500" /> Tamper-Proof
          </span>
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
            <Globe className="h-3 w-3 text-clinical-600" /> Multi-Chain
          </span>
        </div>
      </div>

      {/* Grid of Proofs */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* 1. IPFS Storage */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-clinical-700">
              <Database className="h-3.5 w-3.5" />
              IPFS Decentralized CID
            </span>
            {ipfsCid && (
              <button
                onClick={() => handleCopy(ipfsCid, "ipfs")}
                className="text-slate-400 hover:text-slate-600"
                title="Copy IPFS CID"
              >
                {copiedKey === "ipfs" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          <div className="mt-2 font-mono text-[11px] text-slate-600 break-all leading-tight bg-slate-50 p-1.5 rounded-md border border-slate-100">
            {ipfsCid || "Generating IPFS Content Identifier..."}
          </div>
          {ipfsGatewayUrl && (
            <a
              href={ipfsGatewayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center text-xs font-medium text-clinical-600 hover:text-clinical-700 hover:underline"
            >
              <span>View On IPFS Gateway</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>

        {/* 2. Sepolia Smart Contract */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-brand-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sepolia Smart Contract
            </span>
            {sepoliaTxHash && (
              <button
                onClick={() => handleCopy(sepoliaTxHash, "sepolia")}
                className="text-slate-400 hover:text-slate-600"
                title="Copy Sepolia Tx Hash"
              >
                {copiedKey === "sepolia" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          <div className="mt-2 font-mono text-[11px] text-slate-600 break-all leading-tight bg-slate-50 p-1.5 rounded-md border border-slate-100">
            {sepoliaTxHash || "Submitting Sepolia On-Chain Anchor..."}
          </div>
          {sepoliaExplorerUrl && (
            <a
              href={sepoliaExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
            >
              <span>Sepolia Etherscan</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>

        {/* 3. Stellar Health Logging */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-purple-700">
              <Globe className="h-3.5 w-3.5" />
              Stellar Testnet Memo
            </span>
            {stellarTxHash && (
              <button
                onClick={() => handleCopy(stellarTxHash, "stellar")}
                className="text-slate-400 hover:text-slate-600"
                title="Copy Stellar Tx Hash"
              >
                {copiedKey === "stellar" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          <div className="mt-2 font-mono text-[11px] text-slate-600 break-all leading-tight bg-slate-50 p-1.5 rounded-md border border-slate-100">
            {stellarTxHash || "Broadcasting Stellar Score Memo..."}
          </div>
          {stellarExplorerUrl && (
            <a
              href={stellarExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
            >
              <span>Stellar Expert Explorer</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
