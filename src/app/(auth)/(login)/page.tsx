import React from "react";
import Image from "next/image";
import LoginForm from "@/components/auth/loginform";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col space-y-5 items-center justify-center w-full">
      <div className="flex space-x-2">
        <Image
          src={"/images/mascot/penny.svg"}
          alt="Penny Mascot"
          width={1080}
          height={1080}
          className="w-16 h-16"
        />
        <Image
          src={"/images/logo/kupi-logo.svg"}
          alt="Kupi Logo"
          width={1080}
          height={1080}
          className="w-16 h-16"
        />
      </div>
      <LoginForm />
    </div>
  );
}
