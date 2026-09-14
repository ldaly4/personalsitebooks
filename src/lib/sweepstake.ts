import { aliasMap, flagMap, owners, teams, type Owner, type Team } from "./sweepstake-data";
import type { Match, MatchEvent } from "./providers/types";

export type OwnerStats = {
  ownerId: string;
  alive: number;
  total: number;
  qualified: number;
  eliminated: number;
  goals: number;
  points: number;
  teamsLive: number;
  recentGoals: number;
};

export type LeaderboardRow = OwnerStats & {
  rank: number;
  owner: Owner;
  teams: Team[];
};

const aliasLookup = new Map<string, string>(
  [...Object.entries(aliasMap), ...teams.map((team) => [team.name, team.name] as const)].map(([alias, canonical]) => [
    alias.toLowerCase(),
    canonical,
  ]),
);

export function normaliseTeamName(name: string): string {
  return aliasLookup.get(name.trim().toLowerCase()) ?? name.trim();
}

export function getOwnerByTeam(teamName: string): Owner | undefined {
  const normalised = normaliseTeamName(teamName);
  const team = teams.find((candidate) => candidate.name === normalised);
  return owners.find((owner) => owner.id === team?.ownerId);
}

export function getTeamByName(teamName: string): Team | undefined {
  const normalised = normaliseTeamName(teamName);
  return teams.find((team) => team.name === normalised);
}

export function getTeamById(teamId: string): Team | undefined {
  return teams.find((team) => team.id === teamId);
}

export function getTeamsForOwner(ownerId: string): Team[] {
  return teams.filter((team) => team.ownerId === ownerId);
}

export function getTeamFlag(teamName: string): string {
  return flagMap[normaliseTeamName(teamName)] ?? "🏳️";
}

export function isLiveStatus(status: string): boolean {
  return ["live", "half-time", "1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status);
}

export function hasRecentlyScored(teamName: string, events: MatchEvent[]): boolean {
  const normalised = normaliseTeamName(teamName);
  return events.some((event) => event.type === "goal" && normaliseTeamName(event.team) === normalised);
}

export function calculateOwnerStats(owner: Owner, ownerTeams: Team[], matches: Match[]): OwnerStats {
  const relevantEvents = matches.flatMap((match) => match.events ?? []).filter((event) => event.ownerId === owner.id);
  const aliveTeams = ownerTeams.filter((team) => team.status !== "eliminated");
  const qualified = ownerTeams.filter((team) => ["qualified", "winner"].includes(team.status)).length;
  const teamsLive = ownerTeams.filter((team) => team.status === "live").length;
  const goals = ownerTeams.reduce((total, team) => total + team.goalsFor, 0);
  const recentGoals = relevantEvents.filter((event) => event.type === "goal").length;
  const liveBonus = matches.filter((match) => match.homeOwnerId === owner.id || match.awayOwnerId === owner.id).length;

  return {
    ownerId: owner.id,
    alive: aliveTeams.length,
    total: ownerTeams.length,
    qualified,
    eliminated: ownerTeams.length - aliveTeams.length,
    goals,
    points:
      aliveTeams.length * 10 +
      ownerTeams.reduce((total, team) => total + team.won * 3 + team.drawn + team.goalsFor, 0) +
      qualified * 10 +
      liveBonus,
    teamsLive,
    recentGoals,
  };
}

export function calculateLeaderboard(allOwners: Owner[], allTeams: Team[], matches: Match[]): LeaderboardRow[] {
  return allOwners
    .map((owner) => {
      const ownerTeams = allTeams.filter((team) => team.ownerId === owner.id);
      return {
        ...calculateOwnerStats(owner, ownerTeams, matches),
        owner,
        teams: ownerTeams,
        rank: 0,
      };
    })
    .sort((a, b) => {
      if (b.alive !== a.alive) return b.alive - a.alive;
      if (b.qualified !== a.qualified) return b.qualified - a.qualified;
      if (b.points !== a.points) return b.points - a.points;
      if (b.goals !== a.goals) return b.goals - a.goals;
      return a.owner.name.localeCompare(b.owner.name);
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));
}
