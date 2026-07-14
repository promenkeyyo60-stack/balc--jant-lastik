import { LEAGUE_IDS } from "../_lib/api-football.js";

export default function handler(
  _req: unknown,
  res: { json: (d: unknown) => void }
) {
  res.json({
    leagues: Object.entries(LEAGUE_IDS).map(([name, id]) => ({ id, name })),
  });
}
