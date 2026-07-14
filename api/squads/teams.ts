import { getTeamsByLeague } from "../_lib/api-football.js";

export default async function handler(
  req: { query: Record<string, string | string[]> },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void }
) {
  const leagueId = Number(req.query.leagueId);
  if (!leagueId || isNaN(leagueId)) {
    res.status(400).json({ error: "leagueId parametresi gerekli (sayı)" });
    return;
  }
  try {
    const teams = await getTeamsByLeague(leagueId);
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ error: "Takım listesi alınamadı", detail: String(err) });
  }
}
