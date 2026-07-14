import { Router, type IRouter, type Request, type Response } from "express";
import { getTeamsByLeague, getSquad, searchTeam, LEAGUE_IDS } from "../lib/api-football.js";
import { cache } from "../lib/cache.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/squads/leagues — desteklenen liglerin listesi
router.get("/squads/leagues", (_req: Request, res: Response) => {
  res.json({
    leagues: Object.entries(LEAGUE_IDS).map(([name, id]) => ({ id, name })),
  });
});

// GET /api/squads/teams?leagueId=39 — bir ligdeki takımlar
router.get("/squads/teams", async (req: Request, res: Response) => {
  const leagueId = Number(req.query.leagueId);
  if (!leagueId || isNaN(leagueId)) {
    res.status(400).json({ error: "leagueId parametresi gerekli (sayı)" });
    return;
  }
  try {
    const teams = await getTeamsByLeague(leagueId);
    res.json({ teams });
  } catch (err) {
    logger.error({ err }, "Takım listesi hatası");
    res.status(500).json({ error: "Takım listesi alınamadı", detail: String(err) });
  }
});

// GET /api/squads/squad?teamId=530 — bir takımın kadrosu
router.get("/squads/squad", async (req: Request, res: Response) => {
  const teamId = Number(req.query.teamId);
  if (!teamId || isNaN(teamId)) {
    res.status(400).json({ error: "teamId parametresi gerekli (sayı)" });
    return;
  }
  try {
    const players = await getSquad(teamId);
    res.json({ players, teamId, cached: true });
  } catch (err) {
    logger.error({ err }, "Kadro çekme hatası");
    res.status(500).json({ error: "Kadro alınamadı", detail: String(err) });
  }
});

// GET /api/squads/search?name=Barcelona — takım arama
router.get("/squads/search", async (req: Request, res: Response) => {
  const name = String(req.query.name ?? "").trim();
  if (!name || name.length < 2) {
    res.status(400).json({ error: "name en az 2 karakter olmalı" });
    return;
  }
  try {
    const teams = await searchTeam(name);
    res.json({ teams });
  } catch (err) {
    logger.error({ err }, "Takım arama hatası");
    res.status(500).json({ error: "Arama yapılamadı", detail: String(err) });
  }
});

// GET /api/squads/cache-stats — önbellek durumu
router.get("/squads/cache-stats", (_req: Request, res: Response) => {
  res.json({ entries: cache.size() });
});

export default router;
