export type MatchStatus =
  | "scheduled"
  | "live"
  | "half-time"
  | "finished"
  | "postponed"
  | "cancelled";

export type MatchEvent = {
  id: string;
  fixtureId: string;
  type: "goal" | "red-card" | "yellow-card" | "full-time" | "elimination" | "qualification";
  team: string;
  ownerId?: string;
  minute?: number;
  player?: string;
  message: string;
  createdAt: string;
};

export type Match = {
  id: string;
  utcDate: string;
  stage: string;
  group?: string;
  status: MatchStatus;
  minute?: number;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  homeOwnerId?: string;
  awayOwnerId?: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
  events?: MatchEvent[];
  ownerLine?: string;
};

export type Standing = {
  group: string;
  team: string;
  flag: string;
  ownerId?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
  qualificationStatus?: "qualified" | "possible" | "eliminated";
};

export type ProviderTeam = {
  id: string;
  name: string;
  flag: string;
  fifaCode?: string;
};

export type FootballProvider = {
  dataSource: "mock" | "api-football" | "football-data";
  getFixtures(): Promise<Match[]>;
  getLiveMatches(): Promise<Match[]>;
  getStandings(): Promise<Standing[]>;
  getTeams(): Promise<ProviderTeam[]>;
  getMatchEvents(fixtureId: string): Promise<MatchEvent[]>;
};
