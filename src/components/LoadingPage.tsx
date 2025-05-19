import elomate from "@/assets/kassen-logo.png";
import Image from "next/image";
import { motion } from "framer-motion";

const LoadingPage = ({ isAbsolute }: { isAbsolute?: boolean }) => {
  return (
    <div
      className={`${
        isAbsolute ? "absolute" : ""
      } inset-0 z-[100] flex justify-center items-center animate-pulse`}>
      <motion.div
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          // rotate: [0, 360],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.2, // Lebih smooth
          times: [0, 0.1, 1], // Scale selesai di 40% durasi
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1, // Jeda **1 detik** sebelum animasi berulang lagi

          repeatType: "loop",
        }}
        className="bg-white px-7 py-5 rounded-xl">
        <Image
          src={elomate}
          height={45}
          alt="Elomate United Tractor"
          unoptimized
        />
      </motion.div>
    </div>
  );
};

export default LoadingPage;
