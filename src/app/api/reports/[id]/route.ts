import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.labReport.findUnique({
      where: { id: params.id },
      include: {
        analysis: true,
        patient: { select: { id: true, name: true, phone: true } },
        alerts: {
          include: {
            doctor: { select: { id: true, name: true, specialty: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const formatted = {
      id: report.id,
      patientId: report.patientId,
      patientName: report.patient?.name || "Patient",
      patientPhone: report.patient?.phone || "Confidential",
      originalFileName: report.originalFileName,
      fileUrl: report.fileUrl,
      ipfsCid: report.ipfsCid,
      sepoliaTxHash: report.sepoliaTxHash,
      stellarTxHash: report.stellarTxHash,
      createdAt: report.createdAt.toISOString(),
      analysis: report.analysis
        ? {
            id: report.analysis.id,
            overallScore: report.analysis.overallScore,
            summary: report.analysis.summary,
            extractedBiomarkers: JSON.parse(report.analysis.extractedBiomarkers),
            anomalies: JSON.parse(report.analysis.anomalies),
            lifestyleRecommendations: JSON.parse(report.analysis.lifestyleRecommendations),
          }
        : null,
      alerts: report.alerts,
    };

    return NextResponse.json({ success: true, report: formatted });
  } catch (error) {
    console.error("Fetch single report error:", error);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}
