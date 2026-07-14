import { analyzeTactically, type AnalysisRequest } from "../_lib/gemini-analysis.js";

export default async function handler(
  req: { method?: string; body: AnalysisRequest },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void }
) {
  const body = req.body;

  if (!body?.managerName || !body?.players || !Array.isArray(body.players)) {
    res.status(400).json({ success: false, error: "managerName ve players alanları gereklidir." });
    return;
  }

  if (body.players.length === 0) {
    res.status(400).json({ success: false, error: "Kadro boş olamaz." });
    return;
  }

  const result = await analyzeTactically(body);
  if (!result.success) {
    res.status(500).json(result);
    return;
  }
  res.json(result);
}
