import { apiFootballProvider } from "./api-football-provider";
import { footballDataProvider } from "./football-data-provider";
import { mockProvider } from "./mock-provider";
import type { FootballProvider } from "./types";

export function getFootballProvider(): FootballProvider {
  const requestedProvider = process.env.FOOTBALL_PROVIDER ?? "mock";

  if (requestedProvider === "api-football") return apiFootballProvider;
  if (requestedProvider === "football-data") return footballDataProvider;

  return mockProvider;
}
