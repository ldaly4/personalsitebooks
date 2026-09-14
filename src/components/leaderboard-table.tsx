import type { LeaderboardRow } from "@/lib/sweepstake";

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <section className="py-8" id="leaderboard">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-200">Leaderboard</p>
        <h2 className="text-4xl font-black">Flags flying table</h2>
      </div>
      <div className="glass-green overflow-hidden rounded-3xl">
        <div className="hidden grid-cols-[80px_1.2fr_1fr_1fr_1fr_1.4fr_1.3fr] gap-3 border-b border-white/15 bg-white/10 px-5 py-3 text-sm font-black uppercase text-emerald-50/75 lg:grid">
          <span>Rank</span>
          <span>Owner</span>
          <span>Flags flying</span>
          <span>Qualified</span>
          <span>Points</span>
          <span>Flags</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map((row) => (
            <article key={row.ownerId} className="grid gap-3 px-5 py-4 lg:grid-cols-[80px_1.2fr_1fr_1fr_1fr_1.4fr_1.3fr] lg:items-center">
              <div className="flex items-center gap-3">
                <span className="gold-pill inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-black">#{row.rank}</span>
              </div>
              <a href={`/person/${row.owner.slug}`} className="text-2xl font-black text-white hover:text-yellow-200">
                {row.owner.name}
              </a>
              <p className="text-xl font-black text-yellow-100">
                {row.alive}/{row.total} flags flying
              </p>
              <p className="font-bold">{row.qualified} qualified</p>
              <p className="font-black">{row.points} pts</p>
              <div className="flex flex-wrap gap-1 text-2xl">
                {row.teams.map((team) => (
                  <span key={team.id} title={team.name}>
                    {team.flag}
                  </span>
                ))}
              </div>
              <p className="font-bold text-emerald-50/85">{row.owner.statusLine}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
