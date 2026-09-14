import Link from "next/link";
import { notFound } from "next/navigation";
import { FootballPitchBackground } from "@/components/football-pitch-background";
import { SiteNav } from "@/components/site-nav";
import { TeamCard } from "@/components/team-card";
import { getFootballProvider } from "@/lib/providers";
import { getTeamById } from "@/lib/sweepstake";
import { owners, teams } from "@/lib/sweepstake-data";

export function generateStaticParams() {
  return teams.map((team) => ({ teamId: team.id }));
}

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = getTeamById(teamId);
  if (!team) notFound();

  const provider = getFootballProvider();
  const fixtures = await provider.getFixtures();
  const owner = owners.find((candidate) => candidate.id === team.ownerId);
  const teamFixtures = fixtures.filter((fixture) => fixture.homeTeam === team.name || fixture.awayTeam === team.name);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#052e16] text-white">
      <FootballPitchBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <SiteNav dataSource={provider.dataSource} />
        <section className="py-12">
          <Link href={owner ? `/person/${owner.slug}` : "/"} className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-black">
            Back to {owner?.name ?? "dashboard"}
          </Link>
          <TeamCard team={team} nextFixture={teamFixtures.find((fixture) => fixture.status === "scheduled")} />
        </section>
      </div>
    </main>
  );
}
