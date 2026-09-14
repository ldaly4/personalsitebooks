"use client";

import { motion } from "framer-motion";
import { teams } from "@/lib/sweepstake-data";

export function HeroSection() {
  const flags = teams.map((team) => team.flag).slice(0, 28);

  return (
    <section className="relative grid min-h-[620px] items-center gap-10 overflow-hidden py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 inline-flex rounded-full border border-yellow-200/40 bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-green-950">
          World Cup Sweepstake
        </p>
        <h1 className="text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">Sweepstake Mundial</h1>
        <p className="mt-6 text-2xl font-black text-yellow-200 sm:text-4xl">48 teams. 8 hopefuls. One unbearable winner.</p>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-emerald-50/90">
          Track every flag, every goal, every knockout heartbreak, and every group-chat meltdown.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#owners" className="rounded-full bg-yellow-300 px-6 py-3 font-black text-green-950 shadow-xl transition hover:scale-[1.03]">
            Enter the sweepstake
          </a>
          <a href="#live-chaos" className="rounded-full border border-white/20 bg-white/12 px-6 py-3 font-black text-white shadow-xl transition hover:bg-white/20">
            View live chaos
          </a>
        </div>
      </div>
      <div className="relative min-h-[360px]">
        <div className="absolute inset-4 rounded-full border border-white/20" />
        <motion.div
          className="absolute left-1/2 top-1/2 text-8xl drop-shadow-2xl sm:text-9xl"
          animate={{ y: [0, -14, 0], rotate: [0, 8, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          ⚽
        </motion.div>
        {flags.map((flag, index) => {
          const angle = (index / flags.length) * Math.PI * 2;
          const radius = 120 + (index % 5) * 18;
          return (
            <motion.span
              key={`${flag}-${index}`}
              className="absolute rounded-xl border border-white/15 bg-white/12 px-2 py-1 text-3xl shadow-xl backdrop-blur"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px)`,
              }}
              animate={{ y: [0, index % 2 ? 12 : -12, 0], rotate: [0, index % 2 ? 6 : -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 + (index % 5), ease: "easeInOut" }}
            >
              {flag}
            </motion.span>
          );
        })}
      </div>
    </section>
  );
}
