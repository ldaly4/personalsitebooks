import Link from "next/link";

export function SiteNav({ dataSource = "mock" }: { dataSource?: string }) {
  const badges = ["48 teams", "8 owners", "6 flags each", dataSource === "mock" ? "Mock data" : "Live"];

  return (
    <nav className="glass-green sticky top-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <Link href="/" className="text-lg font-black tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300">
        ⚽ Sweepstake Mundial
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((badge) => (
          <span key={badge} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase text-white/90">
            {badge}
          </span>
        ))}
        <a
          href="/#live-chaos"
          className="gold-pill rounded-full px-4 py-2 text-sm font-black shadow-lg transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          Live chaos
        </a>
      </div>
    </nav>
  );
}
