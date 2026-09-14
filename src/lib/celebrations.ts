import type { Owner } from "./sweepstake-data";
import type { Match, MatchEvent } from "./providers/types";
import { getTeamFlag } from "./sweepstake";

export type Celebration = {
  headline: string;
  subline: string;
  intensity: "low" | "medium" | "high" | "chaos";
  animation: "confetti" | "flag-burst" | "fireworks" | "flag-down";
  sound?: "crowd" | "whistle" | "sad-trombone";
};

export function getCelebrationForEvent(event: MatchEvent, _match?: Match, owner?: Owner): Celebration {
  const flag = getTeamFlag(event.team);
  const ownerName = owner?.name ?? "Someone";

  if (event.type === "goal") {
    return {
      headline: `GOOOOAL ${event.team.toUpperCase()} ${flag}`,
      subline: `${ownerName} is absolutely flying.`,
      intensity: "chaos",
      animation: "confetti",
      sound: "crowd",
    };
  }

  if (event.type === "qualification") {
    return {
      headline: `${event.team} ${flag} ARE THROUGH`,
      subline: `${ownerName} has flags in the knockout conversation.`,
      intensity: "high",
      animation: "flag-burst",
      sound: "crowd",
    };
  }

  if (event.type === "elimination") {
    return {
      headline: `${event.team} ${flag} are out`,
      subline: `${ownerName} is staring into the middle distance.`,
      intensity: "medium",
      animation: "flag-down",
      sound: "sad-trombone",
    };
  }

  return {
    headline: `${event.team} ${flag}`,
    subline: event.message,
    intensity: "low",
    animation: "flag-burst",
    sound: "whistle",
  };
}
