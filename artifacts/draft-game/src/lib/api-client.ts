const API_BASE = "/api";

export interface ApiPlayer {
  id: number;
  name: string;
  position: string;  // GK | DEF | MID | FWD
  number: number | null;
}

export interface ApiTeam {
  id: number;
  name: string;
  logo: string;
  leagueId: number;
  leagueName: string;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchSquad(teamId: number): Promise<ApiPlayer[]> {
  const data = await apiFetch<{ players: ApiPlayer[] }>(`/squads/squad?teamId=${teamId}`);
  return data.players;
}

export async function fetchTeamsByLeague(leagueId: number): Promise<ApiTeam[]> {
  const data = await apiFetch<{ teams: ApiTeam[] }>(`/squads/teams?leagueId=${leagueId}`);
  return data.teams;
}

export async function searchTeams(name: string): Promise<ApiTeam[]> {
  const data = await apiFetch<{ teams: ApiTeam[] }>(`/squads/search?name=${encodeURIComponent(name)}`);
  return data.teams;
}

export async function fetchLeagues(): Promise<{ id: number; name: string }[]> {
  const data = await apiFetch<{ leagues: { id: number; name: string }[] }>("/squads/leagues");
  return data.leagues;
}
