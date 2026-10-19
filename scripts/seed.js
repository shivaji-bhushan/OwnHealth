const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Own Health database...");

  // 1. Create Patient User
  const patient = await prisma.user.upsert({
    where: { phone: "+15551234567" },
    update: {},
    create: {
      phone: "+15551234567",
      name: "Alex Patel",
      role: "PATIENT",
      email: "alex.patel@ownhealth.network",
    },
  });

  // 2. Create Doctor User
  const doctor = await prisma.user.upsert({
    where: { phone: "+15550198234" },
    update: {},
    create: {
      phone: "+15550198234",
      name: "Dr. Sarah Jenkins, MD",
      role: "DOCTOR",
      email: "dr.jenkins@metropolitanhealth.org",
      specialty: "Cardiology & Lifestyle Medicine Specialist",
    },
  });

  // Check if initial report already exists
  const existingReport = await prisma.labReport.findFirst({
    where: { patientId: patient.id },
  });

  if (!existingReport) {
    const biomarkers = [
      {
        name: "Fasting Blood Glucose",
        value: 124,
        unit: "mg/dL",
        referenceRange: { low: 70, high: 99, text: "70 - 99 mg/dL" },
        status: "HIGH",
        category: "METABOLIC",
        clinicalInsight: "Impaired fasting glucose requiring dietary carbohydrate regulation.",
      },
      {
        name: "HbA1c",
        value: 6.4,
        unit: "%",
        referenceRange: { low: 4.0, high: 5.6, text: "4.0 - 5.6 %" },
        status: "HIGH",
        category: "METABOLIC",
        clinicalInsight: "Pre-diabetic glycosylation threshold over past 3 months.",
      },
      {
        name: "Total Cholesterol",
        value: 228,
        unit: "mg/dL",
        referenceRange: { low: 125, high: 200, text: "125 - 200 mg/dL" },
        status: "HIGH",
        category: "LIPID",
        clinicalInsight: "Elevated circulating atherogenic particles.",
      },
      {
        name: "Triglycerides",
        value: 215,
        unit: "mg/dL",
        referenceRange: { low: 50, high: 150, text: "50 - 150 mg/dL" },
        status: "HIGH",
        category: "LIPID",
        clinicalInsight: "Significantly elevated blood fats linked to sedentary lifestyle.",
      },
      {
        name: "HDL Cholesterol",
        value: 37,
        unit: "mg/dL",
        referenceRange: { low: 40, high: 60, text: "40 - 60 mg/dL" },
        status: "LOW",
        category: "LIPID",
        clinicalInsight: "Suboptimal cardioprotective lipid levels.",
      },
      {
        name: "Vitamin D3 (25-OH)",
        value: 19.2,
        unit: "ng/mL",
        referenceRange: { low: 30, high: 100, text: "30 - 100 ng/mL" },
        status: "LOW",
        category: "VITAMINS_HORMONES",
        clinicalInsight: "Hypovitaminosis D affecting cellular insulin sensitivity.",
      },
      {
        name: "Serum Creatinine",
        value: 0.92,
        unit: "mg/dL",
        referenceRange: { low: 0.6, high: 1.2, text: "0.6 - 1.2 mg/dL" },
        status: "NORMAL",
        category: "RENAL",
        clinicalInsight: "Optimal kidney filtration and glomerular function.",
      },
    ];

    const anomalies = biomarkers.filter((b) => b.status !== "NORMAL");

    const lifestyle = {
      dietary: {
        summary: "Low-glycemic Mediterranean-DASH hybrid focused on high-fiber prebiotic foods to blunt glucose spikes.",
        foodsToInclude: [
          "Steamed cruciferous vegetables (broccoli, kale, cauliflower)",
          "Sprouted fenugreek & chia seeds (soluble fiber for glucose buffering)",
          "Cold-pressed extra virgin olive oil and avocado",
          "Wild-caught fatty fish or walnuts for Omega-3 EPA/DHA",
        ],
        foodsToAvoid: [
          "Refined flours, high-fructose corn syrups, and sugary soda/energy drinks",
          "Hydrogenated vegetable oils and deep-fried fast foods",
          "Late-night starch-dense snacks after 8:00 PM",
        ],
        keyNutrients: [
          "Magnesium Glycinate (400mg) for insulin receptor activation",
          "Berberine or Ceylon Cinnamon for hepatic glucose regulation",
          "Vitamin D3 (3000 IU) + Vitamin K2 (MK-7)",
        ],
        mealTimingTips: [
          "Practice 14:10 intermittent circadian fasting (Finish dinner by 7:30 PM)",
          "Perform a 10-minute leisurely walk immediately following your largest meal",
        ],
      },
      yogaAsanas: [
        {
          name: "Mandukasana (Frog Pose)",
          sanskritName: "Mandukasana",
          duration: "3 rounds of 60 seconds each",
          targetBiomarker: "Pancreatic beta-cells & Fasting Blood Glucose",
          instructions: [
            "Sit in Vajrasana (kneeling position).",
            "Make fists with thumbs inside, press against navel.",
            "Exhale deeply and bend forward touching chest to thighs while looking forward.",
          ],
          precautions: "Avoid if experiencing acute lumbar discomfort.",
        },
        {
          name: "Paschimottanasana (Seated Forward Bend)",
          sanskritName: "Paschimottanasana",
          duration: "Hold for 2-3 minutes with calm diaphragmatic breath",
          targetBiomarker: "Cortisol, Sympathetic Drive & Triglycerides",
          instructions: [
            "Extend legs straight ahead on mat with spine erect.",
            "Inhale arms overhead, exhale hinging from hips to clasp shins or feet.",
            "Relax neck and shoulders, allowing parasympathetic vagal activation.",
          ],
          precautions: "Bend knees slightly if hamstrings are tight.",
        },
        {
          name: "Ardha Matsyendrasana (Half Lord of the Fishes Twist)",
          sanskritName: "Ardha Matsyendrasana",
          duration: "90 seconds per side",
          targetBiomarker: "Hepatic detoxification & Lipid Clearance",
          instructions: [
            "Sit with right foot over left knee on the floor.",
            "Twist torso to the right, placing left elbow on outside of right knee.",
            "Keep gaze over right shoulder and breathe evenly into abdomen.",
          ],
          precautions: "Keep spine elongated; do not force twist with arms.",
        },
      ],
      circadianSleep: {
        optimalWakeTime: "06:15 AM",
        optimalSleepTime: "10:15 PM",
        sunlightExposure:
          "Step outside for 15-20 minutes within 45 minutes of sunrise without sunglasses to calibrate master circadian clock.",
        digitalSunset: "Activate warm night-shift filters and eliminate bright screens starting at 09:15 PM.",
        protocols: [
          "Maintain bedroom temperature at 66°F - 68°F (19°C) for optimal slow-wave sleep induction.",
          "Stop caffeine consumption by 12:00 PM midday to prevent adenosine receptor disruption.",
        ],
      },
      stressManagement: {
        pranayama: "Nadi Shodhana (Alternate Nostril Breathing) - 10 minutes twice daily",
        techniques: [
          "Double-inhale physiological sigh repeated 3-5 times during acute stress spikes.",
          "Box breathing (4-second inhale, 4-second hold, 4-second exhale, 4-second hold).",
        ],
        mindfulnessTips: [
          "Avoid reading news or work emails within the first 30 minutes of waking.",
          "Eat meals without digital screens, chewing slowly.",
        ],
      },
      disclaimer:
        "AI-generated recommendations are for lifestyle management only and do not replace professional clinical advice.",
    };

    const report = await prisma.labReport.create({
      data: {
        patientId: patient.id,
        originalFileName: "metabolic_glycemic_profile_2026.pdf",
        fileUrl: "https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        sepoliaTxHash: "0x4a8c9b2f1e6d3a7c8b5e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
        stellarTxHash: "7b3d1f8a9c2e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
        analysis: {
          create: {
            extractedBiomarkers: JSON.stringify(biomarkers),
            anomalies: JSON.stringify(anomalies),
            lifestyleRecommendations: JSON.stringify(lifestyle),
            overallScore: 68,
            summary:
              "Biometric evaluation identified elevated Fasting Blood Glucose (124 mg/dL), HbA1c (6.4%), and Triglycerides (215 mg/dL) with subtherapeutic Vitamin D3. Immediate lifestyle modifications are outlined below.",
          },
        },
      },
    });

    await prisma.consultationAlert.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        reportId: report.id,
        status: "PENDING",
        whatsappSent: true,
        criticalMarkers: "Fasting Blood Glucose: 124 mg/dL, HbA1c: 6.4%, Triglycerides: 215 mg/dL",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
