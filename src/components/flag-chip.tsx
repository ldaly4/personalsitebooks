import Link from "next/link";
import type { Team } from "@/lib/sweepstake-data";

export function FlagChip({ team, compact = false }: { team: Team; compact?: boolean }) {
  return (
    <Link
      href={`/team/${team.id}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
    >
      <span className={compact ? "text-lg" : "text-xl"}>{team.flag}</span>
      {!compact && <span className="truncate">{team.name}</span>}
    </Link>
  );
}
