"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { resendOtp, verifyOtp } from "@/service/auth";
import { AnimatePresence, motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { HiClock } from "react-icons/hi2";
import Alert from "../ui/Alert";
import { fadeInOut } from "@/lib/variants";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionToken = searchParams.get("session");
    if (!sessionToken) {
      router.push("/register");
    }
  }, [router, searchParams]);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countDown, setCountdown] = useState<number | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const isValid = otp.every((d) => d.length === 1);

  const handleChange = (index: number, value: string) => {
    if (/[0-9]/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeydown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setCountdown(null);

    try {
      const sessionToken = searchParams.get("session");
      const data = await verifyOtp(sessionToken || "", otp.join(""));

      setSuccessMessage(data.message || "Berhasil verifikasi email nih!");
      setErrorMessage("");

      let timeout = 3;
      setCountdown(timeout);

      const interval = setInterval(() => {
        timeout -= 1;
        setCountdown(timeout);

        if (timeout <= 0) {
          clearInterval(interval);
          router.push("/login");
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
      setSuccessMessage("");
      setCountdown(null);

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetOtp = async () => {
    setResetLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const sessionToken = searchParams.get("session");
      const data = await resendOtp(sessionToken || "");
      setSuccessMessage(data.message);
      setErrorMessage("");

      if (data.sessionToken) {
        router.replace(`/verify-otp?session=${data.sessionToken}`);
      }

      let cooldown = 30;
      setResendCooldown(cooldown);

      const interval = setInterval(() => {
        cooldown -= 1;
        setResendCooldown(cooldown);

        if (cooldown <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
      setSuccessMessage("");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-400 shadow-md rounded-md p-4 max-w-4/5 md:max-w-1/2 lg:max-w-2/7 w-full">
      <h1 className="font-semibold text-primary text-center text-xl md:text-2xl mb-3">
        Verifikasi OTP
      </h1>
      {}
      <div className="w-full flex flex-col items-center justify-center mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={
              errorMessage ? "error" : successMessage ? "success" : "default"
            }
            variants={fadeInOut}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full"
          >
            {errorMessage ? (
              <Image
                src="/images/mascot/penny-otp-failed.png"
                alt="Mascot Penny OTP failed"
                width={1080}
                height={1080}
                className="w-32 h-32 mx-auto mb-2"
              />
            ) : successMessage ? (
              <Image
                src="/images/mascot/penny-otp-success.png"
                alt="Mascot Penny OTP success"
                width={1080}
                height={1080}
                className="w-32 h-32 mx-auto mb-2"
              />
            ) : (
              <Image
                src="/images/mascot/penny-otp.png"
                alt="Mascot Penny OTP"
                width={1080}
                height={1080}
                className="w-32 h-32 mx-auto mb-2"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={
              errorMessage
                ? "error-text"
                : successMessage
                ? "success-text"
                : "default-text"
            }
            variants={fadeInOut}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full flex items-center justify-center mb-3"
          >
            {errorMessage ? (
              <p className="text-center text-red-500 text-xs md:w-3/4">
                {errorMessage}
              </p>
            ) : successMessage ? (
              <div className="text-center flex items-center justify-center space-x-2 md:w-3/4">
                <p className="text-green-500 text-xs">{successMessage}</p>
                {countDown !== null && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <HiClock className="w-4 h-4" />
                    <span>{countDown}s</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-xs md:w-3/4">
                Aku sudah kirim kode OTP ke email kamu nih, buruan dicek ya!
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <form
        onSubmit={onSubmit}
        method="post"
        className="flex flex-col gap-4 items-center mb-3"
      >
        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              type="text"
              key={index}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeydown(index, e)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={clsx(
                "w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-lg",
                digit ? "border-primary" : ""
              )}
            />
          ))}
        </div>
      </form>

      <div className="flex flex-col items-center justify-center mb-3">
        <p className="text-center text-gray-500 text-xs">
          Kamu tidak menerima email?{" "}
          <button
            onClick={resetOtp}
            disabled={resetLoading || resendCooldown > 0}
            className="text-shadow-primary hover:text-primary hover:underline font-semibold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetLoading ? (
              <FaSpinner className="animate-spin inline-block" />
            ) : resendCooldown > 0 ? (
              `(${resendCooldown})`
            ) : (
              "Kirim ulang"
            )}
          </button>
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="mt-5 w-full py-2 bg-primary rounded-md flex text-center items-center justify-center text-white font-semibold hover:bg-shadow-primary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <FaSpinner className="animate-spin mr-2" /> : "Verifikasi"}
      </button>
    </div>
  );
}

export default VerifyOtpForm;
