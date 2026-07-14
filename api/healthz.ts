export default function handler(_req: unknown, res: { json: (d: unknown) => void }) {
  res.json({ status: "ok" });
}
