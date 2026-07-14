import { cache, TTL } from "./cache.js";

const BASE_URL = "https://v3.football.api-sports.io";
const SEASON = 2024;

export const LEAGUE_IDS: Record<string, number> = {
  "Premier League": 39,
  "La Liga": 140,
  "Bundesliga": 78,
  "Serie A": 135,
  "Ligue 1": 61,
  "Süper Lig": 203,
  "TFF 1. Lig": 204,
  "Eredivisie": 88,
  "Primeira Liga": 94,
};

export interface ApiPlayer {
  id: number;
  name: string;
  position: string;
  number: number | null;
}

export interface ApiTeam {
  id: number;
  name: string;
  logo: string;
  leagueId: number;
  leagueName: string;
}

function mapPosition(pos: string): string {
  switch (pos) {
    case "Goalkeeper": return "GK";
    case "Defender":   return "DEF";
    case "Midfielder": return "MID";
    case "Attacker":   return "FWD";
    default:           return "MID";
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.API_FOOTBALL_KEY ?? "";
  if (!apiKey) throw new Error("API_FOOTBALL_KEY ortam değişkeni tanımlı değil");

  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { headers: { "x-apisports-key": apiKey } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API-Football HTTP ${res.status}: ${text}`);
  }

  const json = (await res.json()) as { errors?: unknown; response: T };
  if (json.errors && Object.keys(json.errors as object).length > 0) {
    throw new Error(`API-Football hatası: ${JSON.stringify(json.errors)}`);
  }
  return json.response;
}

export async function getTeamsByLeague(leagueId: number): Promise<ApiTeam[]> {
  const cacheKey = `teams:league:${leagueId}:${SEASON}`;
  const cached = cache.get<ApiTeam[]>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<Array<{ team: { id: number; name: string; logo: string } }>>(
    `/teams?league=${leagueId}&season=${SEASON}`
  );

  const teams: ApiTeam[] = raw.map((r) => ({
    id: r.team.id,
    name: r.team.name,
    logo: r.team.logo,
    leagueId,
    leagueName: Object.entries(LEAGUE_IDS).find(([, id]) => id === leagueId)?.[0] ?? "Bilinmeyen",
  }));

  cache.set(cacheKey, teams, TTL.TEAMS);
  return teams;
}

export async function getSquad(teamId: number): Promise<ApiPlayer[]> {
  const cacheKey = `squad:${teamId}:${SEASON}`;
  const cached = cache.get<ApiPlayer[]>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<Array<{ players: Array<{ id: number; name: string; position: string; number: number | null }> }>>(
    `/players/squads?team=${teamId}`
  );

  const players: ApiPlayer[] = (raw[0]?.players ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    position: mapPosition(p.position),
    number: p.number,
  }));

  cache.set(cacheKey, players, TTL.SQUAD);
  return players;
}

export async function searchTeam(name: string): Promise<ApiTeam[]> {
  const cacheKey = `search:${name.toLowerCase()}`;
  const cached = cache.get<ApiTeam[]>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<Array<{ team: { id: number; name: string; logo: string } }>>(
    `/teams?search=${encodeURIComponent(name)}`
  );

  const teams: ApiTeam[] = raw.map((r) => ({
    id: r.team.id,
    name: r.team.name,
    logo: r.team.logo,
    leagueId: 0,
    leagueName: "Bilinmeyen",
  }));

  cache.set(cacheKey, teams, TTL.SEARCH);
  return teams;
}
