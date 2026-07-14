import { searchTeam } from "../_lib/api-football.js";

export default async function handler(
  req: { query: Record<string, string | string[]> },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void }
) {
  const name = String(req.query.name ?? "").trim();
  if (!name || name.length < 2) {
    res.status(400).json({ error: "name en az 2 karakter olmalı" });
    return;
  }
  try {
    const teams = await searchTeam(name);
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ error: "Arama yapılamadı", detail: String(err) });
  }
}
