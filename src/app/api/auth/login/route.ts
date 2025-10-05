import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt.server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({}, { status: 405 });
  }

  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak terdaftar nih" },
        { status: 404 }
      );
    }

    if (user.status === "INACTIVE") {
      return NextResponse.json(
        { message: "Akun kamu belum diverifikasi, hubungi admin ya" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email atau password salah nih" },
        { status: 401 }
      );
    }

    const token = signJwt({
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server nih!" },
      { status: 500 }
    );
  }
}
