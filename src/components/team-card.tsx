import { owners } from "@/lib/sweepstake-data";
import type { Team } from "@/lib/sweepstake-data";
import type { Match } from "@/lib/providers/types";
import { StatusBadge } from "./status-badge";

export function TeamCard({ team, nextFixture }: { team: Team; nextFixture?: Match }) {
  const owner = owners.find((candidate) => candidate.id === team.ownerId);

  return (
    <article className={`card-green rounded-3xl p-5 ${team.status === "eliminated" ? "opacity-65 grayscale" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-6xl">{team.flag}</div>
          <h3 className="mt-2 text-2xl font-black">{team.name}</h3>
          <p className="font-bold text-yellow-100">{owner?.name}</p>
        </div>
        <StatusBadge status={team.status} />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2 text-center">
        <MiniStat label="P" value={team.played} />
        <MiniStat label="W-D-L" value={`${team.won}-${team.drawn}-${team.lost}`} />
        <MiniStat label="GF/GA" value={`${team.goalsFor}/${team.goalsAgainst}`} />
        <MiniStat label="Pts" value={team.points} />
      </div>
      <p className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3 text-sm font-bold text-emerald-50/80">
        Next: {nextFixture ? `${nextFixture.homeTeam} vs ${nextFixture.awayTeam}` : "Fixture watch"}
      </p>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-2">
      <p className="font-black text-yellow-100">{value}</p>
      <p className="text-xs font-black uppercase text-white/65">{label}</p>
    </div>
  );
}
