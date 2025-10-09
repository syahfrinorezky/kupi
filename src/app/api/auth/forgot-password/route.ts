import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  if (req.method !== "POST") return;

  try {
    const body = await req.json();

    const { email } = body;

    const user = await prisma.user.findUnique({
      where: { email, status: "ACTIVE" },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak terdaftar nih" },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomUUID();

    await prisma.resetPasswordToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const baseUrl =
      process.env.NEXT_AUTH_URL ||
      process.env.BASE_URL ||
      "http://localhost:3000";

    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail(email, resetUrl);

    return NextResponse.json(
      { message: "Coba cek email kamu ya, aku sudah kirim email ke kamu" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan, coba lagi ya" },
      { status: 500 }
    );
  }
}
