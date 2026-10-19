import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dispatchDoctorWhatsAppAlert } from "@/lib/alerts/whatsapp";

export async function POST(request: Request) {
  try {
    const { reportId, doctorPhone } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required." }, { status: 400 });
    }

    const report = await prisma.labReport.findUnique({
      where: { id: reportId },
      include: {
        patient: true,
        analysis: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Extract critical markers
    let criticalMarkersList: string[] = [];
    if (report.analysis) {
      try {
        const anomalies = JSON.parse(report.analysis.anomalies);
        criticalMarkersList = anomalies.map(
          (a: { name: string; value: string | number; unit: string }) =>
            `${a.name}: ${a.value} ${a.unit}`
        );
      } catch (err) {
        criticalMarkersList = ["Abnormal metabolic profile"];
      }
    }

    const patientName = report.patient?.name || "Patient";
    const patientPhone = report.patient?.phone || "Confidential";

    // Dispatch WhatsApp alert
    const dispatchResult = await dispatchDoctorWhatsAppAlert({
      patientName,
      patientPhone,
      reportId: report.id,
      criticalMarkers: criticalMarkersList,
      doctorPhone,
    });

    // Update or create ConsultationAlert
    const existingAlert = await prisma.consultationAlert.findFirst({
      where: { reportId: report.id },
      orderBy: { createdAt: "desc" },
    });

    let updatedAlert;
    if (existingAlert) {
      updatedAlert = await prisma.consultationAlert.update({
        where: { id: existingAlert.id },
        data: {
          whatsappSent: true,
          status: "PENDING",
        },
      });
    } else {
      const defaultDoctor = await prisma.user.findFirst({
        where: { role: "DOCTOR" },
      });

      updatedAlert = await prisma.consultationAlert.create({
        data: {
          patientId: report.patientId,
          doctorId: defaultDoctor?.id || null,
          reportId: report.id,
          status: "PENDING",
          whatsappSent: true,
          criticalMarkers: criticalMarkersList.join(", "),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp alert dispatched to doctor successfully.",
      dispatch: dispatchResult,
      alert: updatedAlert,
    });
  } catch (error) {
    console.error("Notify doctor error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch WhatsApp alert to doctor." },
      { status: 500 }
    );
  }
}
