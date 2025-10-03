import { RegisterFormData } from "@/schemas/registerSchema";

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
