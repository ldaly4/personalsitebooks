export type Owner = {
  id: string;
  name: string;
  slug: string;
  statusLine: string;
  teams: string[];
};

export type TeamStatus =
  | "alive"
  | "live"
  | "qualified"
  | "at-risk"
  | "eliminated"
  | "winner";

export type Team = {
  id: string;
  name: string;
  aliases: string[];
  flag: string;
  fifaCode?: string;
  group?: string;
  ownerId: string;
  status: TeamStatus;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
};

export const owners: Owner[] = [
  {
    id: "willie",
    name: "Willie",
    slug: "willie",
    statusLine: "Quietly dangerous",
    teams: ["Spain", "Belgium", "Croatia", "Paraguay", "Democratic Republic of the Congo", "Saudi Arabia"],
  },
  {
    id: "tracey",
    name: "Tracey",
    slug: "tracey",
    statusLine: "Tournament technician",
    teams: ["Netherlands", "Uruguay", "Canada", "Korea Republic", "Bosnia and Herzegovina", "Iraq"],
  },
  {
    id: "lucy",
    name: "Lucy",
    slug: "lucy",
    statusLine: "Brazil-powered chaos",
    teams: ["Brazil", "Mexico", "Sweden", "Scotland", "Australia", "Haiti"],
  },
  {
    id: "holly",
    name: "Holly",
    slug: "holly",
    statusLine: "Favourite energy",
    teams: ["France", "United States", "Switzerland", "Czechia", "Panama", "New Zealand"],
  },
  {
    id: "alice",
    name: "Alice",
    slug: "alice",
    statusLine: "Group-stage menace",
    teams: ["Germany", "Japan", "Senegal", "Côte d'Ivoire", "Qatar", "Cape Verde"],
  },
  {
    id: "patrick",
    name: "Patrick",
    slug: "patrick",
    statusLine: "Stress levels rising",
    teams: ["England", "Colombia", "Austria", "Egypt", "Iran", "Jordan"],
  },
  {
    id: "luke-oc",
    name: "Luke O'C",
    slug: "luke-oc",
    statusLine: "Dark horse merchant",
    teams: ["Portugal", "Morocco", "Ecuador", "Algeria", "Tunisia", "Curaçao"],
  },
  {
    id: "luke-k",
    name: "Luke K",
    slug: "luke-k",
    statusLine: "Argentina insurance policy",
    teams: ["Argentina", "Norway", "Türkiye", "Ghana", "Uzbekistan", "South Africa"],
  },
];

export const flagMap: Record<string, string> = {
  Spain: "🇪🇸",
  Belgium: "🇧🇪",
  Croatia: "🇭🇷",
  Paraguay: "🇵🇾",
  "Democratic Republic of the Congo": "🇨🇩",
  "Saudi Arabia": "🇸🇦",
  Netherlands: "🇳🇱",
  Uruguay: "🇺🇾",
  Canada: "🇨🇦",
  "Korea Republic": "🇰🇷",
  "Bosnia and Herzegovina": "🇧🇦",
  Iraq: "🇮🇶",
  Brazil: "🇧🇷",
  Mexico: "🇲🇽",
  Sweden: "🇸🇪",
  Scotland: "🏴",
  Australia: "🇦🇺",
  Haiti: "🇭🇹",
  France: "🇫🇷",
  "United States": "🇺🇸",
  Switzerland: "🇨🇭",
  Czechia: "🇨🇿",
  Panama: "🇵🇦",
  "New Zealand": "🇳🇿",
  Germany: "🇩🇪",
  Japan: "🇯🇵",
  Senegal: "🇸🇳",
  "Côte d'Ivoire": "🇨🇮",
  Qatar: "🇶🇦",
  "Cape Verde": "🇨🇻",
  England: "🏴",
  Colombia: "🇨🇴",
  Austria: "🇦🇹",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  Jordan: "🇯🇴",
  Portugal: "🇵🇹",
  Morocco: "🇲🇦",
  Ecuador: "🇪🇨",
  Algeria: "🇩🇿",
  Tunisia: "🇹🇳",
  Curaçao: "🇨🇼",
  Argentina: "🇦🇷",
  Norway: "🇳🇴",
  Türkiye: "🇹🇷",
  Ghana: "🇬🇭",
  Uzbekistan: "🇺🇿",
  "South Africa": "🇿🇦",
};

export const aliasMap: Record<string, string> = {
  US: "United States",
  USA: "United States",
  "United States of America": "United States",
  "South Korea": "Korea Republic",
  Korea: "Korea Republic",
  "Korea Republic": "Korea Republic",
  Czech: "Czechia",
  "Czech Republic": "Czechia",
  Turkey: "Türkiye",
  Turkiye: "Türkiye",
  "Ivory Coast": "Côte d'Ivoire",
  "Cote d'Ivoire": "Côte d'Ivoire",
  "Côte d’Ivoire": "Côte d'Ivoire",
  Bosnia: "Bosnia and Herzegovina",
  "Bosnia & Herzegovina": "Bosnia and Herzegovina",
  "DR Congo": "Democratic Republic of the Congo",
  DRC: "Democratic Republic of the Congo",
  "Congo DR": "Democratic Republic of the Congo",
  "Democratic Republic of Congo": "Democratic Republic of the Congo",
  Curacao: "Curaçao",
  Curaçao: "Curaçao",
  "Cape Verde Islands": "Cape Verde",
};

const sampleStats: Partial<Record<string, Partial<Team>>> = {
  Spain: { status: "live", played: 1, won: 1, goalsFor: 2, goalsAgainst: 1, points: 3 },
  Brazil: { status: "live", played: 1, won: 1, goalsFor: 1, goalsAgainst: 0, points: 3 },
  Portugal: { status: "live", played: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  Morocco: { status: "live", played: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  England: { status: "live", played: 1, drawn: 1, goalsFor: 1, goalsAgainst: 1, points: 1 },
  "United States": { status: "live", played: 1, drawn: 1, goalsFor: 1, goalsAgainst: 1, points: 1 },
  France: { status: "qualified", played: 1, won: 1, goalsFor: 3, goalsAgainst: 0, points: 3 },
  Argentina: { status: "qualified", played: 1, won: 1, goalsFor: 2, goalsAgainst: 0, points: 3 },
  Germany: { status: "at-risk", played: 1, lost: 1, goalsFor: 0, goalsAgainst: 1, points: 0 },
  "Cape Verde": { status: "at-risk", played: 1, lost: 1, goalsFor: 1, goalsAgainst: 2, points: 0 },
};

export const teams: Team[] = owners.flatMap((owner, ownerIndex) =>
  owner.teams.map((name, teamIndex) => {
    const stat = sampleStats[name] ?? {};
    return {
      id: name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      name,
      aliases: Object.entries(aliasMap)
        .filter(([, canonical]) => canonical === name)
        .map(([alias]) => alias),
      flag: flagMap[name],
      fifaCode: name.slice(0, 3).toUpperCase(),
      group: String.fromCharCode(65 + ((ownerIndex * 6 + teamIndex) % 12)),
      ownerId: owner.id,
      status: "alive",
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      ...stat,
    };
  }),
);
