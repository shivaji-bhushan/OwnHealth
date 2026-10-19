"use client";

import React from "react";
import { SAMPLE_LAB_REPORTS, SampleReportPreset } from "@/lib/samples/labReports";
import { FileText, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface SampleReportsModalProps {
  onSelectSample: (sample: SampleReportPreset) => void;
}

export default function SampleReportsModal({ onSelectSample }: SampleReportsModalProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-clinical-600" />
          Or Test With Diagnostic Presets:
        </h4>
        <span className="text-[11px] text-slate-400 font-medium">1-Click Load</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {SAMPLE_LAB_REPORTS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectSample(preset)}
            className="group flex flex-col justify-between text-left rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition-all hover:border-clinical-500 hover:bg-white hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {preset.category}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-clinical-600" />
              </div>
              <h5 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-clinical-700">
                {preset.title}
              </h5>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                {preset.description}
              </p>
            </div>
            <div className="mt-2 text-[10px] text-clinical-700 font-medium flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{preset.fileName}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
