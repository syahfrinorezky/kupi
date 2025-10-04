"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterFormData } from "@/schemas/registerSchema";
import { registerUser } from "@/service/auth";
import { PasswordStrengthBar } from "../ux/PasswordStrengthBar";
import { fadeInOut } from "@/lib/variants";
import {
  HiUser,
  HiEnvelope,
  HiEye,
  HiEyeSlash,
  HiKey,
  HiLockClosed,
  HiClock,
} from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Alert from "../ui/Alert";

function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countDown, setCountdown] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      setCountdown(null);

      await registerUser(data);
      setSuccessMessage("Daftar akun berhasil");

      let timeout = 3;
      setCountdown(timeout);

      const interval = setInterval(() => {
        timeout -= 1;
        setCountdown(timeout);

        if (timeout <= 0) {
          clearInterval(interval);
          router.push("/verify-otp?email=" + encodeURIComponent(data.email));
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-400 shadow-md rounded-md p-4 max-w-4/5 md:w-1/2 lg:w-2/7 w-full">
      <h1 className="font-semibold text-primary text-center text-xl md:text-2xl mb-2">
        DAFTAR
      </h1>
      {successMessage && (
        <Alert type="success" message={successMessage}>
          {countDown !== null && (
            <span className="flex items-center space-x-1">
              <HiClock className="w-4 h-4" />
              <span>{countDown}</span>
            </span>
          )}
        </Alert>
      )}

      <AnimatePresence>
        {errorMessage && <Alert type="error" message={errorMessage} />}
      </AnimatePresence>
      <AnimatePresence>
        {!successMessage && !errorMessage && (
          <motion.p
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="text-center text-sm"
          >
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-shadow-primary hover:text-primary hover:underline transition duration-300 ease-in-out"
            >
              Masuk
            </Link>
          </motion.p>
        )}
      </AnimatePresence>
      {/* form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="mt-4 flex flex-col gap-y-3"
      >
        {/* name */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-semibold text-gray-600">
            <span>
              <HiUser className="inline-block mr-1 text-primary" />
            </span>
            Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-none focus:outline-primary"
            required
            {...register("name")}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                className="text-xs text-red-500 mt-1"
                variants={fadeInOut}
                initial="hidden"
                animate="visible"
                exit={"hidden"}
              >
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {/* email */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-semibold text-gray-600">
            <span>
              <HiEnvelope className="inline-block mr-1 text-primary" />
            </span>
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-none focus:outline-primary"
            required
            {...register("email")}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                className="text-xs text-red-500 mt-1"
                variants={fadeInOut}
                initial="hidden"
                animate="visible"
                exit={"hidden"}
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
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
        {/* confirm password */}
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
          {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : "Daftar"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
