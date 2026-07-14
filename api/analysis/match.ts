import {
  simulateMatch,
  type MatchSimRequest,
} from "../_lib/gemini-analysis.js";

export default async function handler(
  req: { method?: string; body: MatchSimRequest },
  res: {
    status: (c: number) => { json: (d: unknown) => void };
    json: (d: unknown) => void;
  },
) {
  const body = req.body;

  if (!body?.evSahibi?.isim || !body?.deplasman?.isim) {
    res
      .status(400)
      .json({
        success: false,
        error: "evSahibi ve deplasman alanları gereklidir.",
      });
    return;
  }

  const result = await simulateMatch(body);
  if (!result.success) {
    res.status(500).json(result);
    return;
  }
  res.json(result);
}
