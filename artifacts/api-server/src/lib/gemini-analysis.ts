import { GoogleGenAI } from "@google/genai";

// ── TypeScript Arayüzleri ────────────────────────────────────────────────────

export interface AnalysisPlayer {
  name: string;
  position: string;
}

export interface AnalysisRequest {
  managerName: string;
  teamName: string;
  formation: string;
  players: AnalysisPlayer[];
}

export interface TacticalAnalysis {
  managerName: string;
  teamName: string;
  overallRating: number;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  strengths: string[];
  weaknesses: string[];
  tacticalComment: string;
  predictedStyle: string;
  keyPlayer: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: TacticalAnalysis;
  error?: string;
}

// ── Gemini İstemcisi ─────────────────────────────────────────────────────────

function createClient(): GoogleGenAI {
  const baseUrl = process.env["AI_INTEGRATIONS_GEMINI_BASE_URL"];
  const integrationKey = process.env["AI_INTEGRATIONS_GEMINI_API_KEY"];

  if (baseUrl && integrationKey) {
    return new GoogleGenAI({
      apiKey: integrationKey,
      httpOptions: { apiVersion: "", baseUrl },
    });
  }

  const userKey = process.env["GEMINI_API_KEY"];
  if (userKey) {
    return new GoogleGenAI({ apiKey: userKey });
  }

  throw new Error("Gemini API anahtarı bulunamadı (AI_INTEGRATIONS_GEMINI_API_KEY veya GEMINI_API_KEY).");
}

// ── Taktik Analiz Prompt ──────────────────────────────────────────────────────

function buildPrompt(req: AnalysisRequest): string {
  const byPosition: Record<string, string[]> = { GK: [], DEF: [], MID: [], FWD: [] };

  for (const p of req.players) {
    const pos = p.position in byPosition ? p.position : "MID";
    byPosition[pos].push(p.name);
  }

  return `
Sen dünya klasında bir futbol teknik direktörüsün. Sana bir takımın kadrosu verildi.
2025-2026 sezonu bilgilerine dayanarak TÜM oyuncuları gerçek özelliklerine göre değerlendir.

YÖNETİCİ: ${req.managerName}
TAKIM: ${req.teamName}
FORMASYON: ${req.formation}

KADRO:
- Kaleciler: ${byPosition.GK.join(", ") || "Yok"}
- Defans: ${byPosition.DEF.join(", ") || "Yok"}
- Orta Saha: ${byPosition.MID.join(", ") || "Yok"}
- Forvet: ${byPosition.FWD.join(", ") || "Yok"}

Aşağıdaki JSON formatında yanıt ver (başka hiçbir şey yazma, sadece JSON):
{
  "overallRating": <1-10 arası sayı>,
  "attackRating": <1-10 arası sayı>,
  "midfieldRating": <1-10 arası sayı>,
  "defenseRating": <1-10 arası sayı>,
  "strengths": ["<güçlü yön 1>", "<güçlü yön 2>", "<güçlü yön 3>"],
  "weaknesses": ["<zayıf yön 1>", "<zayıf yön 2>"],
  "tacticalComment": "<3-4 cümle detaylı teknik direktör yorumu, Türkçe>",
  "predictedStyle": "<oyun stili tahmini, örn: Yüksek Pressing, Tiki-Taka, Karşı Atak>",
  "keyPlayer": "<en kritik oyuncunun adı ve neden>"
}
`.trim();
}

// ── Maç Simülasyonu Tipleri ──────────────────────────────────────────────────

export type MatchEventType = "GOL" | "SUT" | "KART" | "KOSE_VURUSU" | "OYUN";

export interface MatchEvent {
  dakika: number;
  anlatim: string;
  olay: MatchEventType;
  koordinatlar: { x: number; y: number };
  takim: "ev" | "deplasman";
  oyuncu?: string;
}

export interface MatchTeam {
  isim: string;
  formasyon: string;
  oyuncular: { isim: string; pozisyon: string; slotPozisyon?: string }[];
}

export interface MatchSimRequest {
  evSahibi: MatchTeam;
  deplasman: MatchTeam;
}

export interface MatchSimResponse {
  success: boolean;
  olaylar?: MatchEvent[];
  sonuc?: { ev: number; deplasman: number };
  error?: string;
}

// ── ① Matematiksel Skor Algoritması ─────────────────────────────────────────

const POZISYON_AGIRLIK: Record<string, number> = {
  GK: 5,
  DEF: 6,
  MID: 7,
  FWD: 8,
};

function kadroGucu(takim: MatchTeam): number {
  const pozisyonSkoru = takim.oyuncular.reduce((acc, p) => {
    const agirlik = POZISYON_AGIRLIK[p.pozisyon] ?? 6;
    const uyumsuz = p.slotPozisyon && p.slotPozisyon !== p.pozisyon;
    return acc + agirlik * (uyumsuz ? 0.60 : 1.0);
  }, 0);
  // Formasyon hücum bonusu: son rakam = forvet sayısı
  const fwdSayi = parseInt(((takim.formasyon ?? "4-3-3").split("-").pop()) ?? "1", 10);
  const formasyonBonus = isNaN(fwdSayi) ? 2 : fwdSayi * 1.5;
  // Rastgelelik: her maçta gün formuna göre küçük sapma
  const gunFormu = Math.random() * 18;
  return pozisyonSkoru + formasyonBonus + gunFormu;
}

function agirlikliGol(): number {
  const r = Math.random() * 100;
  if (r < 15) return 0;   // %15 → 0 gol
  if (r < 55) return 1;   // %40 → 1 gol
  if (r < 85) return 2;   // %30 → 2 gol
  if (r < 95) return 3;   // %10 → 3 gol
  return 4;               // %5  → 4 gol
}

export function macSonucuHesapla(evSahibi: MatchTeam, deplasman: MatchTeam): { ev: number; deplasman: number } {
  const evGuc = kadroGucu(evSahibi);
  const depGuc = kadroGucu(deplasman);
  const evDahaGuclu = evGuc >= depGuc;

  // Kazanma olasılıkları (%)
  let evKazanma: number, beraberlik: number, depKazanma: number;

  if (evDahaGuclu) {
    evKazanma = 65;  // 60 (güçlü) + 5 (ev avantajı)
    beraberlik = 20;
    depKazanma = 15;
  } else {
    depKazanma = 60;           // Deplasman daha güçlü, %60 baz
    evKazanma = 25 + 5;        // Zayıf ev sahibi + 5 ev avantajı = %30
    beraberlik = 10;
  }

  const r = Math.random() * 100;

  if (r < evKazanma) {
    // Ev sahibi kazanır
    const evGol = Math.max(1, agirlikliGol());
    const depGol = Math.floor(Math.random() * evGol); // 0 ile evGol-1 arası
    return { ev: evGol, deplasman: depGol };
  } else if (r < evKazanma + beraberlik) {
    // Beraberlik
    const gol = agirlikliGol();
    return { ev: gol, deplasman: gol };
  } else {
    // Deplasman kazanır
    const depGol = Math.max(1, agirlikliGol());
    const evGol = Math.floor(Math.random() * depGol); // 0 ile depGol-1 arası
    return { ev: evGol, deplasman: depGol };
  }
}

// ── ② Gemini Prompt: Skor sabit, sadece olay koordinatları ─────────────────

function buildMatchPrompt(req: MatchSimRequest, sonuc: { ev: number; deplasman: number }): string {
  const fmt = (t: MatchTeam) =>
    `Formasyon: ${t.formasyon}\n` +
    t.oyuncular.map((o) => `  - ${o.isim} (${o.pozisyon})`).join("\n");

  return `
Sen profesyonel bir futbol maç yorumcususun. Sana maçın sonucu önceden verildi.
Görevin: Bu sonuca BIREBIR uyan olay akışını Türkçe anlatımlarla üret.

EV SAHİBİ: ${req.evSahibi.isim}
${fmt(req.evSahibi)}

DEPLASMAN: ${req.deplasman.isim}
${fmt(req.deplasman)}

KESİN MAÇ SONUCU: ${req.evSahibi.isim} ${sonuc.ev} - ${sonuc.deplasman} ${req.deplasman.isim}
(Bu skora uymayan hiçbir gol veya olay üretme!)

KOORDINAT SİSTEMİ:
- x: 0 = deplasman kalesi, 100 = ev sahibi kalesi
- y: 0 = üst taç, 100 = alt taç
- Goller: x 92-100 (ev) veya x 0-8 (deplasman)
- Şutlar: x 65-90 (ev) veya x 10-35 (deplasman)
- Köşe: x 0-5 veya 95-100, y 0-5 veya 95-100

KURALLAR:
1. Toplam ${sonuc.ev + sonuc.deplasman} gol olayı üret — ne fazla ne eksik
2. Tam olarak 12-14 olay üret, dakikaları 1-90 arasına yay
3. Gollerden önce şut, köşe veya pas olayları ekle (gerçekçi akış)
4. Ev sahibi ${sonuc.ev} gol, deplasman ${sonuc.deplasman} gol atar
5. Anlatımı tamamen Türkçe yaz; oyuncu isimlerini kullan
6. Sadece JSON yanıt ver, başka hiçbir şey yazma

JSON FORMATI:
{
  "olaylar": [
    {
      "dakika": <1-90>,
      "anlatim": "<Türkçe anlatım, oyuncu ismi geçmeli>",
      "olay": "<GOL|SUT|KART|KOSE_VURUSU|OYUN>",
      "koordinatlar": { "x": <0-100>, "y": <0-100> },
      "takim": "<ev|deplasman>",
      "oyuncu": "<olayı gerçekleştiren futbolcunun tam adı>"
    }
  ]
}
`.trim();
}

// ── ③ simulateMatch: Önce TS skoru hesapla, sonra Gemini'ye gönder ───────────

export async function simulateMatch(req: MatchSimRequest): Promise<MatchSimResponse> {
  // Adım 1: TypeScript matematiksel skor algoritması
  const sonuc = macSonucuHesapla(req.evSahibi, req.deplasman);

  try {
    const ai = createClient();

    // Adım 2: Gemini'ye sabit skoru ver, sadece olay koordinatlarını al
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: buildMatchPrompt(req, sonuc) }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = (response.text ?? "")
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(text) as { olaylar: MatchEvent[] };
    parsed.olaylar.sort((a, b) => a.dakika - b.dakika);

    // Adım 3: Skor her zaman TS algoritmasından gelir
    return { success: true, olaylar: parsed.olaylar, sonuc };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Maç simülasyonu başarısız: ${message}` };
  }
}

// ── Ana Taktik Analiz Fonksiyonu ─────────────────────────────────────────────

export async function analyzeTactically(req: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const ai = createClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: buildPrompt(req) }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = (response.text ?? "")
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(text) as Omit<TacticalAnalysis, "managerName" | "teamName">;

    return {
      success: true,
      analysis: {
        managerName: req.managerName,
        teamName: req.teamName,
        ...parsed,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Analiz yapılamadı: ${message}` };
  }
}
