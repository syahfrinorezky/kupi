import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json({
        message: "Email telah terdaftar",
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({
      message: "Kode OTP telah dikirim ke email kamu",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
