"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HiEnvelope, HiKey, HiEye, HiEyeSlash } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Alert from "../ui/Alert";
import { loginFormData, loginSchema } from "@/schemas/loginSchema";
import { loginUser } from "@/service/auth";

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: loginFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await loginUser(data);

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-400 shadow-md rounded-md p-4 max-w-4/5 md:w-1/2 lg:w-2/7 w-full">
      <h1 className="font-semibold text-primary text-center text-xl md:text-2xl mb-2">
        LOGIN
      </h1>

      <AnimatePresence>
        {errorMessage && <Alert type="error" message={errorMessage} />}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="mb-4 flex flex-col gap-y-3"
      >
        {/* email */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-semibold text-gray-600">
            <span>
              <HiEnvelope className="inline-block mr-1 text-primary"></HiEnvelope>
            </span>
            Email
          </label>
          <input
            type="text"
            id="email"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-none focus:outline-primary"
            required
            {...register("email")}
          />
          {errors.email && (
            <motion.p
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* password */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="font-semibold text-gray-600">
            <span>
              <HiKey className="inline-block mr-1 text-primary" />
            </span>
            Password
          </label>
          <div className="flex space-x-2 w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-none focus:outline-primary"
              required
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 aspect-square bg-primary rounded-md text-white hover:bg-shadow-primary transition-all duration-300 ease-in-out"
            >
              {showPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 py-2 bg-primary rounded-md flex text-center items-center justify-center text-white font-semibold hover:bg-shadow-primary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : "Login"}
        </button>
      </form>

      <div className="mt-5 flex flex-col items-center justify-center gap-y-3 text-sm w-full">
        <p>
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-shadow-primary hover:text-primary hover:underline"
          >
            Daftar
          </Link>
        </p>
        <div className="flex items-center space-x-2 w-1/2">
          <hr className="border-gray-300 flex-grow" />
          <p className="text-gray-400">atau</p>
          <hr className="border-gray-300 flex-grow" />
        </div>
        <p>
          Kamu lupa password?{" "}
          <Link
            href="/forgot-password"
            className="text-shadow-primary hover:text-primary hover:underline"
          >
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
