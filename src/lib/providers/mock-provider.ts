import { teams } from "../sweepstake-data";
import { mockEvents, mockFixtures, mockLiveMatches, mockStandings } from "../mock-worldcup";
import type { FootballProvider } from "./types";

export const mockProvider: FootballProvider = {
  dataSource: "mock",
  async getFixtures() {
    return mockFixtures;
  },
  async getLiveMatches() {
    return mockLiveMatches;
  },
  async getStandings() {
    return mockStandings;
  },
  async getTeams() {
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      flag: team.flag,
      fifaCode: team.fifaCode,
    }));
  },
  async getMatchEvents(fixtureId: string) {
    return mockEvents.filter((event) => event.fixtureId === fixtureId);
  },
};
