import { attachOwnersToMatch } from "../mock-worldcup";
import { getTeamFlag } from "../sweepstake";
import { mockProvider } from "./mock-provider";
import type { FootballProvider, Match, MatchEvent, MatchStatus, ProviderTeam, Standing } from "./types";

const baseUrl = process.env.WORLD_CUP_API_BASE_URL || "https://v3.football.api-sports.io";
const leagueId = process.env.WORLD_CUP_LEAGUE_ID || "1";
const season = process.env.WORLD_CUP_SEASON || "2026";

function mapStatus(short?: string): MatchStatus {
  if (["1H", "2H", "ET", "BT", "P", "LIVE"].includes(short ?? "")) return "live";
  if (short === "HT") return "half-time";
  if (["FT", "AET", "PEN"].includes(short ?? "")) return "finished";
  if (["NS", "TBD"].includes(short ?? "")) return "scheduled";
  if (short === "PST") return "postponed";
  if (["CANC", "ABD"].includes(short ?? "")) return "cancelled";
  return "scheduled";
}

async function apiFootballFetch<T>(path: string, fallback: () => Promise<T>): Promise<T> {
  const key = process.env.WORLD_CUP_API_KEY;
  if (!key) return fallback();

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { "x-apisports-key": key },
      next: { revalidate: path.includes("status=") || path.includes("events") ? 15 : path.includes("standings") ? 60 : 600 },
    });

    if (!response.ok) throw new Error(`API-FOOTBALL ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.warn("API-FOOTBALL failed, falling back to mock provider:", error);
    return fallback();
  }
}

function normaliseFixture(item: any): Match {
  const homeTeam = item.teams?.home?.name ?? "Home";
  const awayTeam = item.teams?.away?.name ?? "Away";
  const match = {
    id: String(item.fixture?.id),
    utcDate: item.fixture?.date ?? new Date().toISOString(),
    stage: item.league?.round ?? "World Cup",
    group: item.league?.round?.match(/Group [A-L]/)?.[0]?.replace("Group ", ""),
    status: mapStatus(item.fixture?.status?.short),
    minute: item.fixture?.status?.elapsed ?? undefined,
    homeTeam,
    awayTeam,
    homeFlag: getTeamFlag(homeTeam),
    awayFlag: getTeamFlag(awayTeam),
    homeScore: item.goals?.home ?? undefined,
    awayScore: item.goals?.away ?? undefined,
    venue: item.fixture?.venue?.name,
  };
  return attachOwnersToMatch(match);
}

function normaliseEvent(item: any, fixtureId: string): MatchEvent {
  return {
    id: `${fixtureId}-${item.time?.elapsed ?? "x"}-${item.team?.name}-${item.type}-${item.detail}`,
    fixtureId,
    type: item.type === "Goal" ? "goal" : item.type === "Card" && item.detail?.includes("Red") ? "red-card" : "yellow-card",
    team: item.team?.name ?? "",
    minute: item.time?.elapsed,
    player: item.player?.name,
    message: `${item.team?.name ?? "Team"} ${item.detail ?? item.type}`,
    createdAt: new Date().toISOString(),
  };
}

export const apiFootballProvider: FootballProvider = {
  dataSource: "api-football",
  async getFixtures() {
    const data = await apiFootballFetch<any>(`/fixtures?league=${leagueId}&season=${season}`, mockProvider.getFixtures);
    if (Array.isArray(data)) return data;
    return (data.response ?? []).map(normaliseFixture);
  },
  async getLiveMatches() {
    const statuses = "1H-HT-2H-ET-P-BT-LIVE";
    const data = await apiFootballFetch<any>(
      `/fixtures?league=${leagueId}&season=${season}&status=${statuses}`,
      mockProvider.getLiveMatches,
    );
    if (Array.isArray(data)) return data;
    return (data.response ?? []).map(normaliseFixture);
  },
  async getStandings() {
    const data = await apiFootballFetch<any>(`/standings?league=${leagueId}&season=${season}`, mockProvider.getStandings);
    if (Array.isArray(data)) return data;
    const groups = data.response?.[0]?.league?.standings ?? [];
    return groups.flatMap((group: any[]) =>
      group.map(
        (row): Standing => ({
          group: row.group ?? "World Cup",
          team: row.team?.name,
          flag: getTeamFlag(row.team?.name),
          played: row.all?.played ?? 0,
          won: row.all?.win ?? 0,
          drawn: row.all?.draw ?? 0,
          lost: row.all?.lose ?? 0,
          goalsFor: row.all?.goals?.for ?? 0,
          goalsAgainst: row.all?.goals?.against ?? 0,
          goalDifference: row.goalsDiff ?? 0,
          points: row.points ?? 0,
          position: row.rank ?? 0,
          qualificationStatus: row.rank <= 2 ? "qualified" : row.rank === 3 ? "possible" : "eliminated",
        }),
      ),
    );
  },
  async getTeams() {
    const data = await apiFootballFetch<any>(`/teams?league=${leagueId}&season=${season}`, mockProvider.getTeams);
    if (Array.isArray(data)) return data;
    return (data.response ?? []).map(
      (item: any): ProviderTeam => ({
        id: String(item.team?.id),
        name: item.team?.name,
        flag: getTeamFlag(item.team?.name),
        fifaCode: item.team?.code,
      }),
    );
  },
  async getMatchEvents(fixtureId: string) {
    const data = await apiFootballFetch<any>(`/fixtures/events?fixture=${fixtureId}`, () => mockProvider.getMatchEvents(fixtureId));
    if (Array.isArray(data)) return data;
    return (data.response ?? []).map((item: any) => normaliseEvent(item, fixtureId));
  },
};
