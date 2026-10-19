import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeLabReportText } from "@/lib/llm/analyzer";
import { uploadToIPFS } from "@/lib/web3/ipfs";
import { anchorToSepolia, computePatientHash } from "@/lib/web3/sepolia";
import { logHealthScoreOnStellar } from "@/lib/web3/stellar";

export async function POST(request: Request) {
  try {
    let currentUser = await getCurrentUser();

    // Auto-fallback for quick testing if no cookie yet
    if (!currentUser) {
      let defaultUser = await prisma.user.findFirst({ where: { role: "PATIENT" } });
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            phone: "+15551234567",
            name: "Alex Patel",
            role: "PATIENT",
          },
        });
      }
      currentUser = {
        id: defaultUser.id,
        phone: defaultUser.phone,
        name: defaultUser.name,
        role: "PATIENT",
      };
    }

    const contentType = request.headers.get("content-type") || "";
    let originalFileName = "Lab_Report.txt";
    let rawText = "";
    let fileBuffer: Buffer = Buffer.from("");

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const textParam = formData.get("text") as string | null;

      if (file) {
        originalFileName = file.name;
        const arrayBuf = await file.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuf);
        // If text file or readable string
        rawText = fileBuffer.toString("utf-8");
      } else if (textParam) {
        rawText = textParam;
        fileBuffer = Buffer.from(rawText);
      }
    } else {
      const body = await request.json();
      originalFileName = body.fileName || "clinical_panel.txt";
      rawText = body.text || "";
      fileBuffer = Buffer.from(rawText);
    }

    if (!rawText || rawText.trim().length === 0) {
      rawText = `Fasting Blood Glucose: 122 mg/dL\nHbA1c: 6.3%\nTriglycerides: 198 mg/dL\nHDL Cholesterol: 38 mg/dL\nTotal Cholesterol: 215 mg/dL\nBlood Pressure: 138/88 mmHg\nVitamin D3: 21 ng/mL`;
      fileBuffer = Buffer.from(rawText);
    }

    // Step 1: LLM Clinical Biomarker Extraction & Lifestyle Synthesis
    const analysis = await analyzeLabReportText(rawText);

    // Step 2: Patient Hash
    const patientHash = computePatientHash(currentUser.phone, currentUser.id);

    // Step 3: IPFS Upload & CID generation
    const ipfsResult = await uploadToIPFS(fileBuffer, originalFileName, {
      patientId: currentUser.id,
      biomarkerCount: analysis.extractedBiomarkers.length,
      healthScore: analysis.overallScore,
    });

    // Step 4: Ethereum Sepolia Smart Contract Anchor
    const sepoliaResult = await anchorToSepolia(patientHash, ipfsResult.cid);

    // Temporary ID for Stellar memo linking
    const tempReportId = `REP-${Date.now().toString().slice(-6)}`;

    // Step 5: Stellar Testnet Memo & Score Logging
    const stellarResult = await logHealthScoreOnStellar(
      analysis.overallScore,
      tempReportId,
      patientHash
    );

    // Step 6: Store in Prisma Database
    const labReport = await prisma.labReport.create({
      data: {
        patientId: currentUser.id,
        originalFileName,
        fileUrl: ipfsResult.url,
        ipfsCid: ipfsResult.cid,
        sepoliaTxHash: sepoliaResult.txHash,
        stellarTxHash: stellarResult.txHash,
        analysis: {
          create: {
            extractedBiomarkers: JSON.stringify(analysis.extractedBiomarkers),
            anomalies: JSON.stringify(analysis.anomalies),
            lifestyleRecommendations: JSON.stringify(analysis.lifestyleRecommendations),
            overallScore: analysis.overallScore,
            summary: analysis.summary,
          },
        },
      },
      include: {
        analysis: true,
      },
    });

    // Step 7: Create consultation alert if critical markers detected
    if (analysis.anomalies.length > 0) {
      const criticalNames = analysis.anomalies
        .filter((a) => a.status === "CRITICAL" || a.status === "HIGH")
        .map((a) => `${a.name} (${a.value} ${a.unit})`)
        .slice(0, 4)
        .join(", ");

      const defaultDoctor = await prisma.user.findFirst({
        where: { role: "DOCTOR" },
      });

      await prisma.consultationAlert.create({
        data: {
          patientId: currentUser.id,
          doctorId: defaultDoctor?.id || null,
          reportId: labReport.id,
          status: "PENDING",
          whatsappSent: false,
          criticalMarkers: criticalNames,
        },
      });
    }

    return NextResponse.json({
      success: true,
      reportId: labReport.id,
      originalFileName: labReport.originalFileName,
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.url,
      sepoliaTxHash: sepoliaResult.txHash,
      sepoliaExplorerUrl: sepoliaResult.explorerUrl,
      stellarTxHash: stellarResult.txHash,
      stellarExplorerUrl: stellarResult.stellarExplorerUrl,
      analysis,
    });
  } catch (error) {
    console.error("Report upload & analysis error:", error);
    return NextResponse.json(
      { error: "Failed to process and analyze lab report." },
      { status: 500 }
    );
  }
}
