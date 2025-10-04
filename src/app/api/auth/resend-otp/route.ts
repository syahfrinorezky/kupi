import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  if (req.method !== "POST") return;

  try {
    const { sessionToken } = await req.json();

    const existingToken = await prisma.verificationToken.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!existingToken) {
      return NextResponse.json(
        { message: "Session tidak ditemukan nih!" },
        { status: 404 }
      );
    }

    const user = existingToken.user;

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email sudah terverifikasi" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.verificationToken.update({
      where: { sessionToken },
      data: { used: true },
    });

    const newSessionToken = crypto.randomUUID();

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: hashedOtp,
        sessionToken: newSessionToken,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        used: false,
      },
    });

    await sendOtpEmail(user.email, otp);

    return NextResponse.json(
      {
        message: "OTP baru sudah dikirim ke emailmu!",
        sessionToken: newSessionToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan, coba lagi nanti!" },
      { status: 500 }
    );
  }
}
