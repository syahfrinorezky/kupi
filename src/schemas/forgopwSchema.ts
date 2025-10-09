import z from "zod";

export const forgotpwSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
});

export type ForgotPwFormData = z.infer<typeof forgotpwSchema>;
