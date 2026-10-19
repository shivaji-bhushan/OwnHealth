import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    let reports;
    if (user && user.role === "PATIENT") {
      reports = await prisma.labReport.findMany({
        where: { patientId: user.id },
        include: {
          analysis: true,
          patient: { select: { id: true, name: true, phone: true } },
          alerts: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Doctor or preview mode: show all reports
      reports = await prisma.labReport.findMany({
        include: {
          analysis: true,
          patient: { select: { id: true, name: true, phone: true } },
          alerts: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const formatted = reports.map((r) => ({
      id: r.id,
      patientId: r.patientId,
      patientName: r.patient?.name || "Anonymous Patient",
      patientPhone: r.patient?.phone || "Confidential",
      originalFileName: r.originalFileName,
      fileUrl: r.fileUrl,
      ipfsCid: r.ipfsCid,
      sepoliaTxHash: r.sepoliaTxHash,
      stellarTxHash: r.stellarTxHash,
      createdAt: r.createdAt.toISOString(),
      analysis: r.analysis
        ? {
            id: r.analysis.id,
            overallScore: r.analysis.overallScore,
            summary: r.analysis.summary,
            extractedBiomarkers: JSON.parse(r.analysis.extractedBiomarkers),
            anomalies: JSON.parse(r.analysis.anomalies),
            lifestyleRecommendations: JSON.parse(r.analysis.lifestyleRecommendations),
          }
        : null,
      alerts: r.alerts,
    }));

    return NextResponse.json({ success: true, reports: formatted });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports." }, { status: 500 });
  }
}
