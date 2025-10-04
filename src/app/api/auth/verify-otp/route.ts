import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  if (req.method !== "POST") return;

  try {
    const body = await req.json();

    const { sessionToken, otp } = body;

    if (!sessionToken || !otp) {
      return NextResponse.json(
        { message: "Session token dan OTP harus diisi" },
        { status: 400 }
      );
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "Format OTP tidak valid" },
        { status: 400 }
      );
    }

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Sesi anda sudah kadaluarsa nih" },
        { status: 400 }
      );
    }

    const tokenUsed = tokenRecord.used;

    if (tokenUsed) {
      return NextResponse.json(
        { message: "Kode OTP sudah tidak berlaku nih" },
        { status: 400 }
      );
    }

    const isValidOtp = await bcrypt.compare(otp, tokenRecord.token);

    if (!isValidOtp) {
      return NextResponse.json(
        { message: "Kode OTP tidak valid nih" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailVerified: new Date(), status: "ACTIVE" },
    });

    await prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    return NextResponse.json(
      { message: "Email berhasil diverifikasi" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
