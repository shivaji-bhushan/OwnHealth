export interface SampleReportPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  rawText: string;
}

export const SAMPLE_LAB_REPORTS: SampleReportPreset[] = [
  {
    id: "sample-metabolic-syndrome",
    title: "Metabolic Syndrome & Glycemic Risk Panel",
    category: "Metabolic / Diabetes",
    description: "Features elevated Fasting Blood Glucose, high HbA1c, high Triglycerides, and low Vitamin D3.",
    fileName: "metabolic_glycemic_profile_2026.pdf",
    rawText: `CLINICAL PATHOLOGY LABORATORY REPORT
PATIENT: Alex Patel (DOB: 12/04/1988)
ORDERING PHYSICIAN: Dr. Sarah Jenkins, MD
COLLECTION DATE: 18-Oct-2026 07:30 AM
SAMPLE: Fasting Venous Plasma

TEST PERFORMED                     RESULT    UNIT      REFERENCE RANGE   STATUS
---------------------------------------------------------------------------------
Fasting Blood Glucose              124.0     mg/dL     70 - 99           HIGH
HbA1c (Glycated Hemoglobin)         6.4      %         4.0 - 5.6         HIGH
Total Cholesterol                  228.0     mg/dL     125 - 200         HIGH
Triglycerides                      215.0     mg/dL     50 - 150          HIGH
HDL Cholesterol                     37.0     mg/dL     40 - 60           LOW
LDL Cholesterol                    148.0     mg/dL     50 - 100          HIGH
Blood Pressure                     138/88    mmHg      90-120 / 60-80    HIGH
Vitamin D3 (25-OH)                  19.2     ng/mL     30 - 100          LOW
Serum Creatinine                    0.92     mg/dL     0.6 - 1.2         NORMAL
Hemoglobin                          14.4     g/dL      13.0 - 17.0       NORMAL

CLINICAL IMPRESSION:
Biomarkers reflect early stage insulin resistance, dyslipidemia, and borderline hypertension. Suggest lifestyle glycemic management, dietary modulation, and structured physical routine.`,
  },
  {
    id: "sample-cardio-lipid",
    title: "Advanced Cardiovascular Lipid Risk Panel",
    category: "Cardiovascular / Lipids",
    description: "Elevated Total Cholesterol, high LDL, high Triglycerides, and elevated Blood Pressure.",
    fileName: "cardiac_lipid_biomarkers.pdf",
    rawText: `METROPOLITAN CARDIOLOGY DIAGNOSTICS
PATIENT: Michael Thorne (DOB: 23/08/1979)
ORDERING PHYSICIAN: Dr. Sarah Jenkins, MD
COLLECTION DATE: 17-Oct-2026 08:00 AM
SAMPLE: Fasting Serum

TEST PERFORMED                     RESULT    UNIT      REFERENCE RANGE   STATUS
---------------------------------------------------------------------------------
Total Cholesterol                  265.0     mg/dL     125 - 200         CRITICAL
LDL Cholesterol                    178.0     mg/dL     50 - 100          HIGH
Triglycerides                      240.0     mg/dL     50 - 150          HIGH
HDL Cholesterol                     36.0     mg/dL     40 - 60           LOW
Blood Pressure                     145/92    mmHg      90-120 / 60-80    CRITICAL
Fasting Blood Glucose               98.0     mg/dL     70 - 99           NORMAL
HbA1c                                5.4      %         4.0 - 5.6         NORMAL
Serum Creatinine                    1.05     mg/dL     0.6 - 1.2         NORMAL
Vitamin D3                          28.0     ng/mL     30 - 100          LOW

CLINICAL IMPRESSION:
Marked atherogenic lipid phenotype and Stage 1 essential hypertension. Immediate physician consultation advised.`,
  },
  {
    id: "sample-optimal-wellness",
    title: "Comprehensive Wellness & Vitality Panel",
    category: "Preventive / Optimal",
    description: "Optimal metabolic, lipid, and hematology ranges reflecting healthy active lifestyle.",
    fileName: "annual_executive_wellness.pdf",
    rawText: `PRIME HEALTHCARE INTEGRATED LABS
PATIENT: Alex Patel (DOB: 12/04/1988)
ORDERING PHYSICIAN: Dr. Sarah Jenkins, MD
COLLECTION DATE: 19-Oct-2026 08:15 AM
SAMPLE: Fasting Blood

TEST PERFORMED                     RESULT    UNIT      REFERENCE RANGE   STATUS
---------------------------------------------------------------------------------
Fasting Blood Glucose               84.0     mg/dL     70 - 99           NORMAL
HbA1c                                5.1      %         4.0 - 5.6         NORMAL
Total Cholesterol                  172.0     mg/dL     125 - 200         NORMAL
Triglycerides                       88.0     mg/dL     50 - 150          NORMAL
HDL Cholesterol                     58.0     mg/dL     40 - 60           NORMAL
LDL Cholesterol                     96.0     mg/dL     50 - 100          NORMAL
Blood Pressure                     116/76    mmHg      90-120 / 60-80    NORMAL
Vitamin D3                          48.5     ng/mL     30 - 100          NORMAL
Serum Creatinine                    0.88     mg/dL     0.6 - 1.2         NORMAL
Hemoglobin                          15.1     g/dL      13.0 - 17.0       NORMAL

CLINICAL IMPRESSION:
All biometric markers reside within healthy clinical reference thresholds. Continue restorative circadian and nutritional practices.`,
  },
];
