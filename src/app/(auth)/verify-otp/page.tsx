"use client";

import Link from "next/link";
import Image from "next/image";
import VerifyOtpForm from "@/components/auth/verifyotpform";

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex flex-col space-y-5 items-center justify-center w-full">
      <Link href={"/"} className="flex space-x-2">
        <Image
          src={"/images/mascot/penny.svg"}
          alt="Penny Mascot"
          width={64}
          height={64}
        />
        <Image
          src={"/images/logo/kupi-logo.svg"}
          alt="Kupi Logo"
          width={64}
          height={64}
        />
      </Link>
      <VerifyOtpForm />
    </div>
  );
}
