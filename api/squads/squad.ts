import { getSquad } from "../_lib/api-football.js";

export default async function handler(
  req: { query: Record<string, string | string[]> },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void }
) {
  const teamId = Number(req.query.teamId);
  if (!teamId || isNaN(teamId)) {
    res.status(400).json({ error: "teamId parametresi gerekli (sayı)" });
    return;
  }
  try {
    const players = await getSquad(teamId);
    res.json({ players, teamId, cached: true });
  } catch (err) {
    res.status(500).json({ error: "Kadro alınamadı", detail: String(err) });
  }
}
