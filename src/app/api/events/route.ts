import { NextResponse } from "next/server";
import { getFootballProvider } from "@/lib/providers";

export const dynamic = "force-static";
export const revalidate = 15;

export async function GET() {
  const provider = getFootballProvider();
  const fixtures = await provider.getFixtures();
  return NextResponse.json({
    dataSource: provider.dataSource,
    events: fixtures.flatMap((fixture) => fixture.events ?? []),
  });
}
