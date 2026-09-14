import { NextResponse } from "next/server";
import { getFootballProvider } from "@/lib/providers";

export const revalidate = 60;

export async function GET() {
  const provider = getFootballProvider();
  const standings = await provider.getStandings();
  return NextResponse.json({ dataSource: provider.dataSource, standings });
}
