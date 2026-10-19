import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.trim().length < 8) {
      return NextResponse.json(
        { error: "Please enter a valid phone number with country code." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    // Default demo OTP is 123456 or generated 6 digits
    const code = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert or create verification record
    await prisma.otpVerification.create({
      data: {
        phone: cleanPhone,
        code,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanPhone}. (For demo, use code: ${code})`,
      demoCode: code,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
