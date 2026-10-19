"use client";

import React, { useState } from "react";
import { LifestyleRecommendations } from "@/types";
import {
  Sparkles,
  Utensils,
  Moon,
  Wind,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  AlertTriangle,
  Flame,
  Info,
} from "lucide-react";

interface LifestyleCureCardProps {
  lifestyle: LifestyleRecommendations;
}

export default function LifestyleCureCard({ lifestyle }: LifestyleCureCardProps) {
  const [activeTab, setActiveTab] = useState<"yoga" | "diet" | "circadian" | "stress">("yoga");

  const { dietary, yogaAsanas, circadianSleep, stressManagement, disclaimer } = lifestyle;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Natural Lifestyle & Functional Medicine Protocol
            </h3>
            <p className="text-xs text-slate-500">
              Personalized non-pharmacological interventions aligned to your biomarker telemetry
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("yoga")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "yoga"
                ? "bg-white text-clinical-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🧘 Asanas</span>
            <span className="rounded-full bg-slate-200/80 px-1.5 py-0.2 text-[10px]">
              {yogaAsanas.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("diet")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "diet"
                ? "bg-white text-clinical-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Nutrition</span>
          </button>

          <button
            onClick={() => setActiveTab("circadian")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "circadian"
                ? "bg-white text-clinical-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Circadian</span>
          </button>

          <button
            onClick={() => setActiveTab("stress")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "stress"
                ? "bg-white text-clinical-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>Pranayama</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Yoga Asanas */}
      {activeTab === "yoga" && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {yogaAsanas.map((asana, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{asana.name}</h4>
                    {asana.sanskritName && (
                      <span className="text-[11px] font-medium text-clinical-700 italic">
                        {asana.sanskritName}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    <Clock className="h-3 w-3" />
                    {asana.duration}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-md p-1.5">
                  <Target className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Target: {asana.targetBiomarker}</span>
                </div>

                {/* Instructions */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Execution Steps:
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600 leading-relaxed">
                    {asana.instructions.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {asana.precautions && (
                <div className="mt-3.5 flex items-start gap-1 rounded-md bg-amber-50/80 p-2 text-[11px] text-amber-800 border border-amber-100">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{asana.precautions}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Nutrition & Diet */}
      {activeTab === "diet" && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl bg-clinical-50/60 p-4 border border-clinical-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-clinical-800">
              Dietary Strategy
            </h4>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed font-medium">
              {dietary.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Foods to include */}
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4">
              <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Foods to Incorporate Daily
              </h5>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {dietary.foodsToInclude.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to avoid */}
            <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-4">
              <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-800">
                <XCircle className="h-4 w-4 text-red-600" />
                Inflammatory Foods to Eliminate
              </h5>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {dietary.foodsToAvoid.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Nutrients & Meal Timing */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Targeted Clinical Micronutrients
              </h5>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {dietary.keyNutrients.map((n, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Meal Cadence & Chrono-Nutrition
              </h5>
              <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                {dietary.mealTimingTips.map((tip, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-clinical-600 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Circadian Rhythm */}
      {activeTab === "circadian" && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Optimal Wake</span>
              <p className="mt-1 text-xl font-extrabold text-slate-900 font-mono">
                {circadianSleep.optimalWakeTime}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Optimal Sleep</span>
              <p className="mt-1 text-xl font-extrabold text-slate-900 font-mono">
                {circadianSleep.optimalSleepTime}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center sm:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Morning Photonic Trigger</span>
              <p className="mt-1 text-xs font-medium text-slate-800">
                {circadianSleep.sunlightExposure}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Blue-Light Digital Sunset
            </h5>
            <p className="mt-1 text-xs text-blue-800">{circadianSleep.digitalSunset}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Circadian Protocols
            </h5>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
              {circadianSleep.protocols.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Moon className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Pranayama & Stress */}
      {activeTab === "stress" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Primary Pranayama Practice
              </h4>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {stressManagement.pranayama}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Acute Stress De-escalation
              </h5>
              <ul className="mt-2.5 space-y-2 text-xs text-slate-600">
                {stressManagement.techniques.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Mindfulness Rituals
              </h5>
              <ul className="mt-2.5 space-y-2 text-xs text-slate-600">
                {stressManagement.mindfulnessTips.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Medical Disclaimer */}
      <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-slate-500 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs leading-relaxed">
          <strong className="text-slate-700">Medical Disclaimer:</strong> {disclaimer}
        </p>
      </div>
    </div>
  );
}
