"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Celebration } from "@/lib/celebrations";

export function CelebrationOverlay({ celebration }: { celebration?: Celebration }) {
  const [visible, setVisible] = useState(Boolean(celebration));

  useEffect(() => {
    setVisible(Boolean(celebration));
    if (!celebration) return;
    const timeout = window.setTimeout(() => setVisible(false), 4200);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  if (!celebration || !visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-green-950/35 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: celebration.intensity === "chaos" ? 70 : 36 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute text-2xl"
            initial={{ top: "-10%", left: `${(index * 37) % 100}%`, rotate: 0 }}
            animate={{ top: "110%", rotate: 360 }}
            transition={{ duration: 2.4 + (index % 7) * 0.18, ease: "easeOut" }}
          >
            {index % 3 === 0 ? "🎉" : index % 3 === 1 ? "⚽" : "🏆"}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="glass-green max-w-2xl rounded-3xl p-8 text-center shadow-2xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <p className="text-4xl font-black text-yellow-200 sm:text-6xl">{celebration.headline}</p>
        <p className="mt-4 text-2xl font-black">{celebration.subline}</p>
      </motion.div>
    </motion.div>
  );
}
