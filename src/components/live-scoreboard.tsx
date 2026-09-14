"use client";

import { motion } from "framer-motion";
import { hasRecentlyScored } from "@/lib/sweepstake";
import type { Match, MatchEvent } from "@/lib/providers/types";
import { UpcomingFixtures } from "./upcoming-fixtures";

export function LiveScoreboard({ matches, events, upcoming }: { matches: Match[]; events: MatchEvent[]; upcoming: Match[] }) {
  if (matches.length === 0) {
    return (
      <section className="glass-green rounded-3xl p-5 sm:p-8">
        <h2 className="text-3xl font-black">No live chaos right now.</h2>
        <p className="mt-2 text-emerald-50/80">The flags are resting. The group chat is not.</p>
        <UpcomingFixtures fixtures={upcoming.slice(0, 3)} compact />
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-200">Live Now</p>
          <h2 className="text-4xl font-black">Scoreboard chaos</h2>
        </div>
        <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-black uppercase text-white shadow-lg animate-pulse">Live</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => {
          const homeGlow = hasRecentlyScored(match.homeTeam, events);
          const awayGlow = hasRecentlyScored(match.awayTeam, events);
          return (
            <motion.article
              key={match.id}
              className="card-green relative overflow-hidden rounded-3xl p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase animate-pulse">
                LIVE {match.minute}'
              </div>
              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <TeamScore flag={match.homeFlag} name={match.homeTeam} glow={homeGlow} />
                <div className="rounded-2xl bg-yellow-300 px-4 py-3 text-4xl font-black text-green-950 shadow-xl">
                  {match.homeScore ?? 0}-{match.awayScore ?? 0}
                </div>
                <TeamScore flag={match.awayFlag} name={match.awayTeam} glow={awayGlow} alignRight />
              </div>
              <p className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-3 text-center text-lg font-black text-yellow-100">
                {match.ownerLine}
              </p>
              <p className="mt-3 text-center text-sm font-bold text-emerald-50/70">
                {match.stage} {match.group ? `- Group ${match.group}` : ""} {match.venue ? `- ${match.venue}` : ""}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function TeamScore({ flag, name, glow, alignRight = false }: { flag: string; name: string; glow: boolean; alignRight?: boolean }) {
  return (
    <div className={`min-w-0 ${alignRight ? "text-right" : ""} ${glow ? "party-pulse" : ""}`}>
      <div className={`text-5xl drop-shadow-xl ${glow ? "rounded-full bg-yellow-300/20" : ""}`}>{flag}</div>
      <p className="mt-2 truncate text-xl font-black">{name}</p>
    </div>
  );
}
