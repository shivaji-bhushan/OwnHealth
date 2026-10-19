"use client";

import React from "react";
import { Biomarker, BiomarkerStatus } from "@/types";
import { CheckCircle2, AlertTriangle, AlertOctagon, ArrowDownCircle, Info } from "lucide-react";

interface BiomarkerMeterProps {
  biomarker: Biomarker;
}

export default function BiomarkerMeter({ biomarker }: BiomarkerMeterProps) {
  const { name, value, unit, referenceRange, status, category, clinicalInsight } = biomarker;
  const numVal = typeof value === "number" ? value : parseFloat(value) || 0;
  const lowRef = referenceRange.low;
  const highRef = referenceRange.high;

  // Calculate percentage along the gauge
  // Scale spans from 0.5 * lowRef to 1.5 * highRef
  const minScale = Math.max(0, lowRef * 0.6);
  const maxScale = highRef * 1.4;
  const rangeSpan = maxScale - minScale;
  
  let pointerPercent = ((numVal - minScale) / rangeSpan) * 100;
  pointerPercent = Math.max(4, Math.min(96, pointerPercent));

  const lowRefPercent = ((lowRef - minScale) / rangeSpan) * 100;
  const highRefPercent = ((highRef - minScale) / rangeSpan) * 100;

  // Status visual attributes
  const getStatusBadge = (st: BiomarkerStatus) => {
    switch (st) {
      case "CRITICAL":
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertOctagon className="h-3.5 w-3.5 text-red-600" />,
          label: "Critical",
          indicatorColor: "bg-red-600",
        };
      case "HIGH":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />,
          label: "Elevated",
          indicatorColor: "bg-amber-500",
        };
      case "LOW":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-200",
          icon: <ArrowDownCircle className="h-3.5 w-3.5 text-sky-600" />,
          label: "Below Range",
          indicatorColor: "bg-sky-500",
        };
      case "NORMAL":
      default:
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
          label: "Optimal",
          indicatorColor: "bg-emerald-600",
        };
    }
  };

  const badge = getStatusBadge(status);

  return (
    <div className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-slate-600 uppercase">
            {category}
          </span>
          <h4 className="mt-1 font-semibold text-slate-900 text-base group-hover:text-clinical-700 transition-colors">
            {name}
          </h4>
        </div>
        <div
          className={`flex items-center space-x-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.bg}`}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Primary Value Display */}
      <div className="mt-4 flex items-baseline space-x-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-500">{unit}</span>
      </div>

      {/* Visual Status Progress Meter */}
      <div className="mt-4">
        {/* The 3-tier gauge track: Low (blue), Normal (green), High (amber/red) */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
          {/* Low Zone */}
          <div
            style={{ width: `${lowRefPercent}%` }}
            className="h-full bg-sky-200/90"
            title="Low Range"
          />
          {/* Normal Zone */}
          <div
            style={{ width: `${highRefPercent - lowRefPercent}%` }}
            className="h-full bg-emerald-400"
            title="Normal Clinical Range"
          />
          {/* High Zone */}
          <div
            style={{ width: `${100 - highRefPercent}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-red-400"
            title="High / Critical Range"
          />
        </div>

        {/* Pointer indicator */}
        <div className="relative mt-1 h-3 w-full">
          <div
            className="absolute -top-1.5 flex -translate-x-1/2 flex-col items-center transition-all duration-500"
            style={{ left: `${pointerPercent}%` }}
          >
            <div
              className={`h-3 w-3 rounded-full border-2 border-white shadow-md ${badge.indicatorColor}`}
            />
          </div>
        </div>

        {/* Reference Range Labels */}
        <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span className="text-sky-700">Low &lt; {lowRef}</span>
          <span className="text-emerald-700 font-semibold">Standard: {referenceRange.text}</span>
          <span className="text-amber-700">High &gt; {highRef}</span>
        </div>
      </div>

      {/* Clinical Insight */}
      {clinicalInsight && (
        <div className="mt-3.5 flex items-start space-x-1.5 rounded-lg bg-slate-50/80 p-2.5 text-xs text-slate-600">
          <Info className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
          <p className="leading-relaxed">{clinicalInsight}</p>
        </div>
      )}
    </div>
  );
}
