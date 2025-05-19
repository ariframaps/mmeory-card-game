"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function FlipCard({ show }: { show: boolean }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (show) {
      // trigger flip
      setFlipped(true);
    } else {
      setFlipped(false);
    }
  }, [show]);

  return (
    <div className="w-40 h-28 relative perspective">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}>
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden bg-gray-200 flex items-center justify-center rounded">
          FRONT
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-green-500 text-white flex items-center justify-center rounded">
          BACK
        </div>
      </motion.div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
