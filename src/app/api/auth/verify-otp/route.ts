import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, getSessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { phone, code, role, name, specialty } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone number and OTP code are required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanCode = code.trim();

    // Verify OTP against database or default demo OTP
    const isDemoOtp = cleanCode === (process.env.DEMO_OTP || "123456");

    if (!isDemoOtp) {
      const record = await prisma.otpVerification.findFirst({
        where: {
          phone: cleanPhone,
          code: cleanCode,
          verified: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!record) {
        return NextResponse.json({ error: "Invalid or expired OTP code." }, { status: 400 });
      }

      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { verified: true },
      });
    }

    // Upsert User
    const userRole = role === "DOCTOR" ? "DOCTOR" : "PATIENT";
    const defaultName =
      name?.trim() ||
      (userRole === "DOCTOR" ? "Dr. Sarah Jenkins, MD" : "Alex Patel");
    const defaultSpecialty =
      userRole === "DOCTOR"
        ? specialty || "Cardiology & Lifestyle Medicine Specialist"
        : undefined;

    let user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          role: userRole,
          name: defaultName,
          specialty: defaultSpecialty,
        },
      });
    } else {
      // If logging in with specified role/name, update if requested
      if (role && role !== user.role) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role: userRole,
            name: name?.trim() || user.name,
            specialty: defaultSpecialty || user.specialty,
          },
        });
      }
    }

    const sessionUser = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role as "PATIENT" | "DOCTOR",
      email: user.email || undefined,
      specialty: user.specialty || undefined,
    };

    const token = await createSessionToken(sessionUser);
    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
