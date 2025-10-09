import { z } from "zod";

export const resetPwSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf kecil, huruf besar, dan angka"
      ),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sesuai",
    path: ["confirmPassword"],
  });

export type ResetPwFormData = z.infer<typeof resetPwSchema>;
