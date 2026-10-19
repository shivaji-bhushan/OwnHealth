import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { status, doctorNotes } = await request.json();

    const alert = await prisma.consultationAlert.findUnique({
      where: { id: params.id },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    const updated = await prisma.consultationAlert.update({
      where: { id: params.id },
      data: {
        status: status || alert.status,
        doctorNotes: doctorNotes !== undefined ? doctorNotes : alert.doctorNotes,
        doctorId: user?.id || alert.doctorId,
      },
    });

    return NextResponse.json({ success: true, alert: updated });
  } catch (error) {
    console.error("Update alert error:", error);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}
