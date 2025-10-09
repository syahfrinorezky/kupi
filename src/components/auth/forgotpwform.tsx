"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ForgotPwFormData, forgotpwSchema } from "@/schemas/forgopwSchema";
import { forgotPassword } from "@/service/auth";
import { HiEnvelope } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import { fadeInOut } from "@/lib/variants";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function ForgotPwForm() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPwFormData>({
    resolver: zodResolver(forgotpwSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPwFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await forgotPassword(data);
      setSuccessMessage(res.message);
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
        LUPA PASSWORD
      </h1>

      <Image
        src="/images/mascot/penny-forgot-pw.png"
        alt="Mascot Penny Forgot Password"
        width={1080}
        height={1080}
        className="w-32 h-32 mx-auto mb-2"
      />

      <AnimatePresence>
        <motion.p
          key={errorMessage ? "error" : successMessage ? "success" : "default"}
          variants={fadeInOut}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full flex items-center justify-center text-center mb-3"
        >
          {errorMessage ? (
            <span className="text-red-500 text-xs">{errorMessage}</span>
          ) : successMessage ? (
            <span className="text-green-500 text-xs md:w-3/4">
              {successMessage}
            </span>
          ) : (
            <span className="text-gray-600 text-xs md:w-3/4">
              Kamu lupa password ya? Jangan khawatir, masukkan aja email yang
              kamu gunakan.
            </span>
          )}
        </motion.p>
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} method="post">
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

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full mt-5 py-2 bg-primary rounded-md flex text-center items-center justify-center text-white font-semibold hover:bg-shadow-primary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : "Kirim"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPwForm;
