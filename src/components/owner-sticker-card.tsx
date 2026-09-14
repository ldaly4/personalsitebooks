"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LeaderboardRow } from "@/lib/sweepstake";
import { FlagChip } from "./flag-chip";

export function OwnerStickerCard({ row }: { row: LeaderboardRow }) {
  const progress = Math.round((row.alive / row.total) * 100);

  return (
    <motion.article
      className="shine sticker-lines card-green rounded-3xl p-5 transition hover:-translate-y-1"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Link href={`/person/${row.owner.slug}`} className="relative z-10 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="gold-pill rounded-full px-3 py-1 text-sm font-black">#{row.rank}</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase">{row.owner.statusLine}</span>
        </div>
        <h3 className="text-3xl font-black">{row.owner.name}</h3>
        <p className="mt-2 text-2xl font-black text-yellow-100">
          {row.alive}/{row.total} flags flying
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-emerald-300" style={{ width: `${progress}%` }} />
        </div>
      </Link>
      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {row.teams.map((team) => (
          <FlagChip key={team.id} team={team} />
        ))}
      </div>
      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2 text-center">
        <Stat label="Qualified" value={row.qualified} />
        <Stat label="Points" value={row.points} />
        <Stat label="Goals" value={row.goals} />
      </div>
    </motion.article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
      <p className="text-xl font-black text-yellow-100">{value}</p>
      <p className="text-xs font-black uppercase text-emerald-50/70">{label}</p>
    </div>
  );
}
