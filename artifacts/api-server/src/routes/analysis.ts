import { Router, type IRouter, type Request, type Response } from "express";
import { analyzeTactically, simulateMatch, type AnalysisRequest, type MatchSimRequest } from "../lib/gemini-analysis.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// POST /api/analysis/tactical
router.post("/analysis/tactical", async (req: Request, res: Response) => {
  try {
    const body = req.body as AnalysisRequest;

    if (!body.managerName || !body.players || !Array.isArray(body.players)) {
      res.status(400).json({
        success: false,
        error: "managerName ve players alanları gereklidir.",
      });
      return;
    }

    if (body.players.length === 0) {
      res.status(400).json({
        success: false,
        error: "Kadro boş olamaz.",
      });
      return;
    }

    logger.info({ managerName: body.managerName, playerCount: body.players.length }, "Taktik analiz isteği");

    const result = await analyzeTactically(body);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (err) {
    logger.error({ err }, "Taktik analiz route hatası");
    res.status(500).json({
      success: false,
      error: "Sunucu hatası. Lütfen tekrar deneyin.",
    });
  }
});

// POST /api/analysis/match
router.post("/analysis/match", async (req: Request, res: Response) => {
  try {
    const body = req.body as MatchSimRequest;

    if (!body.evSahibi?.isim || !body.deplasman?.isim) {
      res.status(400).json({ success: false, error: "evSahibi ve deplasman alanları gereklidir." });
      return;
    }

    logger.info({ home: body.evSahibi.isim, away: body.deplasman.isim }, "Maç simülasyonu isteği");

    const result = await simulateMatch(body);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (err) {
    logger.error({ err }, "Maç simülasyonu route hatası");
    res.status(500).json({ success: false, error: "Sunucu hatası. Lütfen tekrar deneyin." });
  }
});

export default router;
