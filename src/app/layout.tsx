import type { Metadata } from "next";
import { Poppins, Fredoka, Quicksand } from "next/font/google";
import "@/styles/globals.css";
import clsx from "clsx";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kupi - Pencatatan Keuangan Pribadi",
  description: "Bersama kupi atur keuangan pribadimu dengan mudah dan efisien.",
  icons: {
    icon: "/images/mascot/penny.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          poppins.variable,
          fredoka.variable,
          quicksand.variable,
          "antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
