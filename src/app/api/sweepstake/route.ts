import { NextResponse } from "next/server";
import { getFootballProvider } from "@/lib/providers";
import { owners, teams } from "@/lib/sweepstake-data";
import { calculateLeaderboard } from "@/lib/sweepstake";

export const dynamic = "force-static";

export async function GET() {
  const provider = getFootballProvider();
  const fixtures = await provider.getFixtures();

  return NextResponse.json({
    dataSource: provider.dataSource,
    owners,
    teams,
    fixtures,
    leaderboard: calculateLeaderboard(owners, teams, fixtures),
  });
}
