import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.consultationAlert.findMany({
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        report: {
          select: {
            id: true,
            originalFileName: true,
            ipfsCid: true,
            sepoliaTxHash: true,
            stellarTxHash: true,
            analysis: {
              select: {
                overallScore: true,
                summary: true,
                anomalies: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = alerts.map((a) => {
      let anomaliesCount = 0;
      if (a.report?.analysis?.anomalies) {
        try {
          anomaliesCount = JSON.parse(a.report.analysis.anomalies).length;
        } catch (e) {
          anomaliesCount = 1;
        }
      }
      return {
        id: a.id,
        patientId: a.patientId,
        patientName: a.patient?.name || "Patient",
        patientPhone: a.patient?.phone || "Confidential",
        reportId: a.reportId,
        originalFileName: a.report?.originalFileName || "Lab_Report.pdf",
        status: a.status,
        whatsappSent: a.whatsappSent,
        criticalMarkers: a.criticalMarkers,
        doctorNotes: a.doctorNotes,
        createdAt: a.createdAt.toISOString(),
        overallScore: a.report?.analysis?.overallScore ?? 75,
        anomaliesCount,
        ipfsCid: a.report?.ipfsCid,
        sepoliaTxHash: a.report?.sepoliaTxHash,
        stellarTxHash: a.report?.stellarTxHash,
      };
    });

    return NextResponse.json({ success: true, alerts: formatted });
  } catch (error) {
    console.error("List alerts error:", error);
    return NextResponse.json({ error: "Failed to fetch consultation alerts" }, { status: 500 });
  }
}
