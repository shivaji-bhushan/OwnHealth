export type Role = "PATIENT" | "DOCTOR";

export type BiomarkerStatus = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type BiomarkerCategory =
  | "METABOLIC"
  | "LIPID"
  | "HEMATOLOGY"
  | "RENAL"
  | "HEPATIC"
  | "CARDIOVASCULAR"
  | "VITAMINS_HORMONES"
  | "OTHER";

export interface Biomarker {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: {
    low: number;
    high: number;
    text: string;
  };
  status: BiomarkerStatus;
  category: BiomarkerCategory;
  clinicalInsight: string;
}

export interface YogaAsana {
  name: string;
  sanskritName?: string;
  duration: string;
  targetBiomarker: string;
  instructions: string[];
  precautions?: string;
}

export interface DietaryProtocol {
  summary: string;
  foodsToInclude: string[];
  foodsToAvoid: string[];
  keyNutrients: string[];
  mealTimingTips: string[];
}

export interface CircadianProtocol {
  optimalWakeTime: string;
  optimalSleepTime: string;
  sunlightExposure: string;
  digitalSunset: string;
  protocols: string[];
}

export interface StressProtocol {
  pranayama: string;
  techniques: string[];
  mindfulnessTips: string[];
}

export interface LifestyleRecommendations {
  dietary: DietaryProtocol;
  yogaAsanas: YogaAsana[];
  circadianSleep: CircadianProtocol;
  stressManagement: StressProtocol;
  disclaimer: string;
}

export interface ParsedAnalysisResult {
  overallScore: number; // 0-100
  summary: string;
  extractedBiomarkers: Biomarker[];
  anomalies: Biomarker[];
  lifestyleRecommendations: LifestyleRecommendations;
}

export interface Web3AnchorResult {
  ipfsCid: string;
  ipfsUrl: string;
  sepoliaTxHash: string;
  sepoliaExplorerUrl: string;
  stellarTxHash: string;
  stellarExplorerUrl: string;
  timestamp: number;
}

export interface UserSession {
  id: string;
  phone: string;
  name: string;
  role: Role;
  email?: string;
  specialty?: string;
}

export interface LabReportDetail {
  id: string;
  patientId: string;
  originalFileName: string;
  fileUrl: string;
  ipfsCid: string | null;
  sepoliaTxHash: string | null;
  stellarTxHash: string | null;
  createdAt: string;
  patient?: {
    name: string;
    phone: string;
  };
  analysis?: {
    id: string;
    overallScore: number;
    summary: string | null;
    extractedBiomarkers: Biomarker[];
    anomalies: Biomarker[];
    lifestyleRecommendations: LifestyleRecommendations;
  };
  alerts?: ConsultationAlertDetail[];
}

export interface ConsultationAlertDetail {
  id: string;
  patientId: string;
  doctorId: string | null;
  reportId: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  whatsappSent: boolean;
  criticalMarkers: string | null;
  doctorNotes: string | null;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    phone: string;
  };
  report?: {
    id: string;
    originalFileName: string;
    ipfsCid: string | null;
    sepoliaTxHash: string | null;
    stellarTxHash: string | null;
  };
}
