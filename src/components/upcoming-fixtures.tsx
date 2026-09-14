import { owners } from "@/lib/sweepstake-data";
import type { Match } from "@/lib/providers/types";

export function UpcomingFixtures({ fixtures, compact = false }: { fixtures: Match[]; compact?: boolean }) {
  const getOwner = (ownerId?: string) => owners.find((owner) => owner.id === ownerId)?.name ?? "Unclaimed";

  return (
    <section className={compact ? "mt-5" : "py-8"} id="fixtures">
      {!compact && (
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-200">Fixtures</p>
          <h2 className="text-4xl font-black">Next stress appointments</h2>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        {fixtures.map((fixture) => (
          <article key={fixture.id} className="card-green rounded-3xl p-5">
            <p className="text-sm font-black uppercase text-yellow-200">
              {new Intl.DateTimeFormat("en-IE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(fixture.utcDate))}
            </p>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <Team flag={fixture.homeFlag} name={fixture.homeTeam} />
              <span className="rounded-full bg-white/12 px-3 py-2 text-sm font-black">vs</span>
              <Team flag={fixture.awayFlag} name={fixture.awayTeam} right />
            </div>
            <p className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3 text-center font-black">
              {getOwner(fixture.homeOwnerId)} vs {getOwner(fixture.awayOwnerId)}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 text-sm font-bold text-emerald-50/75">
              <span>{fixture.stage}</span>
              <button disabled className="rounded-full border border-white/15 px-3 py-1 opacity-70">
                Set reminder
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Team({ flag, name, right = false }: { flag: string; name: string; right?: boolean }) {
  return (
    <div className={right ? "text-right" : ""}>
      <div className="text-4xl">{flag}</div>
      <p className="mt-1 text-base font-black">{name}</p>
    </div>
  );
}
