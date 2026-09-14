import { teams } from "@/lib/sweepstake-data";

export function FlagBunting() {
  const flags = [...teams, ...teams];

  return (
    <section className="my-6 overflow-hidden rounded-2xl border border-white/15 bg-green-950/55 py-3 shadow-2xl">
      <div className="bunting-track flex w-max gap-3 px-3">
        {flags.map((team, index) => (
          <span
            key={`${team.id}-${index}`}
            className="inline-flex min-w-16 items-center justify-center rounded-xl border border-white/15 bg-white/12 px-3 py-2 text-3xl shadow"
            title={team.name}
          >
            {team.flag}
          </span>
        ))}
      </div>
    </section>
  );
}
