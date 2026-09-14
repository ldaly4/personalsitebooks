import { NextRequest, NextResponse } from "next/server";
import { getFootballProvider } from "@/lib/providers";

export const revalidate = 15;

export async function GET(request: NextRequest) {
  const provider = getFootballProvider();
  const fixtureId = request.nextUrl.searchParams.get("fixtureId");

  if (!fixtureId) {
    const fixtures = await provider.getFixtures();
    return NextResponse.json({
      dataSource: provider.dataSource,
      events: fixtures.flatMap((fixture) => fixture.events ?? []),
    });
  }

  const events = await provider.getMatchEvents(fixtureId);
  return NextResponse.json({ dataSource: provider.dataSource, events });
}
