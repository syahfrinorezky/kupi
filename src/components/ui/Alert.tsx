import { motion } from "framer-motion";
import { fadeInOut } from "@/lib/variants";
import clsx from "clsx";

export default function Alert({
  type,
  message,
  children,
}: {
  type: "success" | "error";
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.p
      className={clsx(
        "px-3 py-2 border rounded-md flex justify-between items-center",
        {
          "bg-green-200 text-green-800 border-green-600": type === "success",
          "bg-red-200 text-red-800 border-red-600": type === "error",
        }
      )}
      variants={fadeInOut}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <span>{message}</span>
      {children}
    </motion.p>
  );
}
