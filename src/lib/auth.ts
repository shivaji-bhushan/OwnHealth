import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserSession } from "@/types";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ownhealth-super-secure-jwt-secret-key-32charsmin!"
);

const TOKEN_COOKIE_NAME = "ownhealth_session";

export async function createSessionToken(user: UserSession): Promise<string> {
  return await new SignJWT({
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    email: user.email,
    specialty: user.specialty,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      phone: payload.phone as string,
      name: payload.name as string,
      role: payload.role as "PATIENT" | "DOCTOR",
      email: payload.email as string | undefined,
      specialty: payload.specialty as string | undefined,
    };
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    const session = await verifySessionToken(token);
    if (!session?.id) return null;

    // Verify user actually exists in the database to prevent foreign key errors with stale sessions
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        email: true,
        specialty: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role as "PATIENT" | "DOCTOR",
      email: user.email || undefined,
      specialty: user.specialty || undefined,
    };
  } catch (error) {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: TOKEN_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
