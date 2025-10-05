import { RegisterFormData } from "@/schemas/registerSchema";
import { loginFormData } from "@/schemas/loginSchema";
import { setTokenToStorage } from "@/lib/jwt.client";

export async function registerUser(data: RegisterFormData) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Terjadi kesalahan");
  }

  return res.json();
}

export async function verifyOtp(sessionToken: string, otp: string) {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionToken, otp }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Terjadi kesalahan");
  }

  return res.json();
}

export async function resendOtp(sessionToken: string) {
  const res = await fetch("/api/auth/resend-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionToken }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Terjadi kesalahan");
  }

  return res.json();
}

export async function loginUser(data: loginFormData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const resultData = await res.json();
  setTokenToStorage(resultData.token);

  return resultData;
}
