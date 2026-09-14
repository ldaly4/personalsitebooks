import Link from "next/link";
import { notFound } from "next/navigation";
import { CelebrationOverlay } from "@/components/celebration-overlay";
import { FootballPitchBackground } from "@/components/football-pitch-background";
import { PartyModeButton } from "@/components/party-mode-button";
import { SiteNav } from "@/components/site-nav";
import { TeamCard } from "@/components/team-card";
import { getCelebrationForEvent } from "@/lib/celebrations";
import { mockEvents } from "@/lib/mock-worldcup";
import { getFootballProvider } from "@/lib/providers";
import { owners, teams } from "@/lib/sweepstake-data";
import { calculateOwnerStats } from "@/lib/sweepstake";

export function generateStaticParams() {
  return owners.map((owner) => ({ slug: owner.slug }));
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const owner = owners.find((candidate) => candidate.slug === slug);
  if (!owner) notFound();

  const provider = getFootballProvider();
  const fixtures = await provider.getFixtures();
  const ownerTeams = teams.filter((team) => team.ownerId === owner.id);
  const stats = calculateOwnerStats(owner, ownerTeams, fixtures);
  const ownerMatches = fixtures.filter((fixture) => fixture.homeOwnerId === owner.id || fixture.awayOwnerId === owner.id);
  const ownerEvents = mockEvents.filter((event) => event.ownerId === owner.id);
  const goalEvent = ownerEvents.find((event) => event.type === "goal");
  const celebration = goalEvent ? getCelebrationForEvent(goalEvent, ownerMatches.find((match) => match.id === goalEvent.fixtureId), owner) : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#052e16] text-white">
      <FootballPitchBackground />
      <CelebrationOverlay celebration={celebration} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SiteNav dataSource={provider.dataSource} />
        <section className={`relative py-14 text-center ${goalEvent ? "party-pulse" : ""}`}>
          <div className="mx-auto max-w-5xl">
            <Link href="/" className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black">
              Back to dashboard
            </Link>
            <div className="mx-auto mb-6 flex max-w-3xl flex-wrap justify-center gap-3 text-5xl">
              {ownerTeams.map((team) => (
                <span key={team.id} className="rounded-2xl border border-white/15 bg-white/12 px-3 py-2 shadow-xl">
                  {team.flag}
                </span>
              ))}
            </div>
            <h1 className={`text-6xl font-black leading-none sm:text-8xl ${goalEvent ? "text-yellow-200 drop-shadow-2xl" : ""}`}>{owner.name}</h1>
            <p className="mt-4 text-3xl font-black text-yellow-100">
              {stats.alive}/{stats.total} flags flying
            </p>
            <p className="mt-3 text-2xl font-black text-emerald-50/90">{owner.statusLine}</p>
            {goalEvent && (
              <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-yellow-200/40 bg-yellow-300 p-5 text-green-950 shadow-2xl">
                <p className="text-3xl font-black">GOOOOAL - {owner.name} is absolutely flying.</p>
                <p className="mt-2 text-6xl">{ownerTeams.find((team) => team.name === goalEvent.team)?.flag}</p>
              </div>
            )}
            <div className="mt-8">
              <PartyModeButton ownerName={owner.name} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Qualified" value={stats.qualified} />
          <Stat label="Points" value={stats.points} />
          <Stat label="Goals" value={stats.goals} />
          <Stat label="Live teams" value={stats.teamsLive} />
        </section>

        <section className="py-8">
          <h2 className="mb-5 text-4xl font-black">The six flags</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ownerTeams.map((team) => (
              <TeamCard key={team.id} team={team} nextFixture={ownerMatches.find((match) => match.homeTeam === team.name || match.awayTeam === team.name)} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-2">
          <div className="glass-green rounded-3xl p-5">
            <h2 className="text-3xl font-black">Recent chaos</h2>
            <div className="mt-4 space-y-3">
              {(ownerEvents.length ? ownerEvents : [{ id: "none", message: "No personal disasters yet. Suspiciously calm." }]).map((event) => (
                <p key={event.id} className="rounded-2xl border border-white/15 bg-white/10 p-3 font-bold">
                  {"message" in event ? event.message : ""}
                </p>
              ))}
            </div>
          </div>
          <div className="glass-green rounded-3xl p-5">
            <h2 className="text-3xl font-black">Live matches</h2>
            <div className="mt-4 space-y-3">
              {(ownerMatches.filter((match) => match.status === "live").length ? ownerMatches.filter((match) => match.status === "live") : ownerMatches.slice(0, 3)).map((match) => (
                <p key={match.id} className="rounded-2xl border border-white/15 bg-white/10 p-3 font-black">
                  {match.homeFlag} {match.homeTeam} {match.homeScore ?? "-"} - {match.awayScore ?? "-"} {match.awayTeam} {match.awayFlag}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-green rounded-3xl p-5 text-center">
      <p className="text-4xl font-black text-yellow-100">{value}</p>
      <p className="mt-1 text-sm font-black uppercase text-emerald-50/75">{label}</p>
    </div>
  );
}
