import { attachOwnersToMatch } from "../mock-worldcup";
import { getTeamFlag } from "../sweepstake";
import { mockProvider } from "./mock-provider";
import type { FootballProvider, Match, MatchStatus, Standing } from "./types";

const baseUrl = process.env.WORLD_CUP_API_BASE_URL || "https://api.football-data.org/v4";
const competitionCode = process.env.WORLD_CUP_COMPETITION_CODE || "WC";
const competitionId = process.env.WORLD_CUP_COMPETITION_ID || "2000";
const season = process.env.WORLD_CUP_SEASON || "2026";

function mapStatus(status?: string): MatchStatus {
  if (status === "LIVE" || status === "IN_PLAY" || status === "PAUSED") return "live";
  if (status === "FINISHED") return "finished";
  if (status === "POSTPONED") return "postponed";
  if (status === "CANCELLED") return "cancelled";
  return "scheduled";
}

async function footballDataFetch<T>(path: string, fallback: () => Promise<T>): Promise<T> {
  const key = process.env.WORLD_CUP_API_KEY;
  if (!key) return fallback();

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { "X-Auth-Token": key },
      next: { revalidate: path.includes("LIVE") || path.includes("scorers") ? 15 : path.includes("standings") ? 60 : 600 },
    });

    if (!response.ok) throw new Error(`football-data ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.warn("football-data.org failed, falling back to mock provider:", error);
    return fallback();
  }
}

function normaliseMatch(item: any): Match {
  return attachOwnersToMatch({
    id: String(item.id),
    utcDate: item.utcDate,
    stage: item.stage ?? item.group ?? "World Cup",
    group: item.group,
    status: mapStatus(item.status),
    homeTeam: item.homeTeam?.name ?? "Home",
    awayTeam: item.awayTeam?.name ?? "Away",
    homeFlag: getTeamFlag(item.homeTeam?.name),
    awayFlag: getTeamFlag(item.awayTeam?.name),
    homeScore: item.score?.fullTime?.home ?? item.score?.regularTime?.home ?? undefined,
    awayScore: item.score?.fullTime?.away ?? item.score?.regularTime?.away ?? undefined,
  });
}

export const footballDataProvider: FootballProvider = {
  dataSource: "football-data",
  async getFixtures() {
    const data = await footballDataFetch<any>(`/competitions/${competitionCode}/matches?season=${season}`, mockProvider.getFixtures);
    if (Array.isArray(data)) return data;
    return (data.matches ?? []).map(normaliseMatch);
  },
  async getLiveMatches() {
    const data = await footballDataFetch<any>(
      `/competitions/${competitionCode}/matches?season=${season}&status=LIVE`,
      mockProvider.getLiveMatches,
    );
    if (Array.isArray(data)) return data;
    return (data.matches ?? []).map(normaliseMatch);
  },
  async getStandings() {
    const data = await footballDataFetch<any>(`/competitions/${competitionCode}/standings?season=${season}`, mockProvider.getStandings);
    if (Array.isArray(data)) return data;
    return (data.standings ?? []).flatMap((standing: any) =>
      (standing.table ?? []).map(
        (row: any): Standing => ({
          group: standing.group ?? "World Cup",
          team: row.team?.name,
          flag: getTeamFlag(row.team?.name),
          played: row.playedGames ?? 0,
          won: row.won ?? 0,
          drawn: row.draw ?? 0,
          lost: row.lost ?? 0,
          goalsFor: row.goalsFor ?? 0,
          goalsAgainst: row.goalsAgainst ?? 0,
          goalDifference: row.goalDifference ?? 0,
          points: row.points ?? 0,
          position: row.position ?? 0,
          qualificationStatus: row.position <= 2 ? "qualified" : row.position === 3 ? "possible" : "eliminated",
        }),
      ),
    );
  },
  async getTeams() {
    const data = await footballDataFetch<any>(`/competitions/${competitionCode}/teams?season=${season}`, mockProvider.getTeams);
    if (Array.isArray(data)) return data;
    return (data.teams ?? []).map((team: any) => ({
      id: String(team.id),
      name: team.name,
      flag: getTeamFlag(team.name),
      fifaCode: team.tla,
    }));
  },
  async getMatchEvents(fixtureId: string) {
    await footballDataFetch<any>(`/matches?competitions=${competitionId}`, async () => ({ matches: [] }));
    return mockProvider.getMatchEvents(fixtureId);
  },
};
