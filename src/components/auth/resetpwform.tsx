"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPwSchema, ResetPwFormData } from "@/schemas/resetpwSchema";
import { PasswordStrengthBar } from "../ux/PasswordStrengthBar";
import { fadeInOut } from "@/lib/variants";
import { HiKey, HiLockClosed, HiEyeSlash, HiEye } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Alert from "../ui/Alert";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const resetToken = searchParams.get("session");
    if (!resetToken) {
      router.back();
    }
  }, [router, searchParams]);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPwFormData>({
    resolver: zodResolver(resetPwSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPwFormData) => {
    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

    

    } catch (error) {}
  };

  return (
    <div className="bg-white border border-gray-400 shadow-md rounded-md p-4 max-w-4/5 md:w-1/2 lg:w-2/7 w-full">
      <h1 className="font-semibold text-primary text-center text-xl md:text-2xl mb-2">
        RESET PASSWORD
      </h1>

      <form method="post" className="mt-4 flex flex-col gap-y-3">
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
              value={password}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-none focus:outline-primary"
              required
              {...register("password", {
                onChange: (e) => setPassword(e.target.value),
              })}
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
          <AnimatePresence>
            {errors.password && (
              <motion.p
                variants={fadeInOut}
                initial="hidden"
                animate="visible"
                exit={"hidden"}
                className="text-xs text-red-500 mt-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
          {/* password strength bar */}
          <PasswordStrengthBar password={password} />
        </div>

        <div className="flex flex-col space-y-1">
          <label
            htmlFor="confirmPassword"
            className="font-semibold text-gray-600"
          >
            <span>
              <HiLockClosed className="inline-block mr-1 text-primary" />
            </span>
            Password Confirmation
          </label>
          <div className="flex space-x-2 w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-none focus:outline-primary"
              required
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-2 aspect-square bg-primary rounded-md text-white hover:bg-shadow-primary transition-all duration-300 ease-in-out"
            >
              {showConfirmPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                variants={fadeInOut}
                initial="hidden"
                animate="visible"
                exit={"hidden"}
                className="text-xs text-red-500 mt-1"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="mt-5 py-2 bg-primary rounded-md flex text-center items-center justify-center text-white font-semibold hover:bg-shadow-primary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : "Reset"}
        </button>
      </form>
    </div>
  );
}
