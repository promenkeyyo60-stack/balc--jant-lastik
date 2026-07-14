import { GoogleGenAI } from "@google/genai";

export interface AnalysisPlayer {
  name: string;
  position: string;
  ovr?: number;
  subPos?: string;
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

  throw new Error("Gemini API anahtarı bulunamadı (GEMINI_API_KEY).");
}

// ── Formasyon bazlı taktik açıklamaları ──────────────────────────────────────

const FORMASYON_ACIKLAMA: Record<string, string> = {
  "4-3-3": "Üç forvetle geniş kanat oyunu ve yüksek pressing. Kanatlar sürekli genişlik sağlar, orta saha üçlüsü hem savunma hem hücumda dönüşümlü görev üstlenir.",
  "4-4-2": "Klasik iki forvet + dört orta saha dengesi. Dar blok savunması ve iki santrafor arasındaki sinerjiye dayalı agresif topsuzluk baskısı.",
  "4-2-3-1": "Çift pivot üzerine inşa edilmiş kontrol sistemi. Ofansif orta saha trio'su ve tek forvet birlikteliği, hücumda sayısal üstünlük sağlar.",
  "3-5-2": "Kanat beklerle geniş alan kontrolü ve yoğun orta saha. Beş kişilik orta saha bloğu hem savunma hem hücumda rakibi ezebilir.",
  "3-4-3": "Üç stoper arkasında güçlü kanat bekleri ve agresif hücum. Kanat bekleri hem savunma hem sol/sağ hücumda kritik.",
  "5-3-2": "Beş kişilik savunma bloğu ve organize kontr atak. Geç hücum geçişlerinde iki forvet sürpriz kopar.",
  "4-1-4-1": "Tek pivot arkasında geniş dörtlü hat. Yüksek topossession ve kontrollü pozisyonel oyun.",
  "4-3-2-1": "Noel ağacı: Dar ve dikey hücum koridorları. Merkez ağırlıklı oyun, iki ofansif OS ve tek forvet.",
};

function getFormasyonAciklama(formasyon: string): string {
  return FORMASYON_ACIKLAMA[formasyon] ?? `${formasyon} dizilişi özgün taktik yapısıyla rakiplere karşı adaptif bir kadro sunar.`;
}

function ovrToLabel(ovr?: number): string {
  if (!ovr) return "standart form";
  if (ovr >= 92) return "dünyanın en iyileri arasında";
  if (ovr >= 88) return "elit dünya seviyesi";
  if (ovr >= 84) return "yüksek kaliteli";
  if (ovr >= 80) return "güçlü lig standardı";
  if (ovr >= 75) return "dengeli form";
  if (ovr >= 70) return "ortalama lig seviyesi";
  return "genç/gelişmekte";
}

function formatPlayerLine(p: AnalysisPlayer): string {
  const subInfo = p.subPos ? p.subPos : p.position;
  const ovrInfo = p.ovr ? `OVR:${p.ovr}(${ovrToLabel(p.ovr)})` : "";
  return `${p.name} [${subInfo}${ovrInfo ? " " + ovrInfo : ""}]`;
}

function buildPrompt(req: AnalysisRequest): string {
  const byPosition: Record<string, string[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  for (const p of req.players) {
    const pos = p.position in byPosition ? p.position : "MID";
    byPosition[pos].push(formatPlayerLine(p));
  }

  const formasyonAciklama = getFormasyonAciklama(req.formation);
  const avgOvr = req.players.filter(p => p.ovr).reduce((s, p) => s + (p.ovr ?? 0), 0) / (req.players.filter(p => p.ovr).length || 1);
  const ovrStr = avgOvr > 0 ? ` (Kadro OVR Ortalaması: ~${Math.round(avgOvr)})` : "";

  return `Sen futbol taktiklerinde uzman, eleştirel düşünen bir teknik direktör ve analistsin.
2025-2026 sezonu güncel bilgilerini kullanarak aşağıdaki kadroyu değerlendir.

━━━ TEMEL BİLGİLER ━━━
YÖNETİCİ: ${req.managerName}
FORMASYON: ${req.formation}${ovrStr}
Diziliş Karakteri: ${formasyonAciklama}

━━━ KADRO (mevki · OVR · form) ━━━
KALECILER: ${byPosition.GK.join(" | ") || "Yok"}
SAVUNMA: ${byPosition.DEF.join(" | ") || "Yok"}
ORTA SAHA: ${byPosition.MID.join(" | ") || "Yok"}
FORVET: ${byPosition.FWD.join(" | ") || "Yok"}

━━━ ANALİZ YÖNERGELERİ ━━━
1. FORMASYON ZORUNLU: Tüm analizini ${req.formation} dizilişine göre yap. 4-3-3 veya başka bir diziliş varsayma.
   - ${req.formation} dizilişinde kaç defans, kaç orta saha, kaç forvet olduğuna göre yorum yap
   - Bu dizilişin doğal güçlü ve zayıf yönlerini bu kadroyla örtüştür

2. OVR & FORM: Her oyuncunun OVR değerini ve gerçek özelliklerini hesaba kat
   - Yüksek OVR'lı oyuncuları kadronun motoru olarak öne çıkar
   - Düşük OVR'lı oyuncuları dürüstçe değerlendir
   - Oyuncuların gerçek karakterlerini yansıt (hızlı kanat oyuncusu, güçlü stoper, yaratıcı orta saha vb.)

3. KİŞİSELLEŞTİRME: ${req.managerName} yöneticisine ve bu özgün kadroya has, başka kadroyla karıştırılmayacak bir yorum yaz
   - Somut oyuncu isimlerini kullan
   - Kadronun güçlü kombinasyonlarını belirt
   - ${req.formation} dizilişiyle bu kadronun sinerjisini analiz et

4. OYUN STİLİ: "${req.formation}" dizilişi ve bu kadronun OVR profili göz önünde bulundurularak gerçekçi oyun stili belirle

Yanıtı YALNIZCA aşağıdaki JSON formatında ver, başka hiçbir şey yazma:
{
  "overallRating": <kadronun gerçek OVR ortalamasına dayalı 1-10>,
  "attackRating": <forvet ve ofansif oyuncu OVR'larına dayalı 1-10>,
  "midfieldRating": <orta saha OVR'larına dayalı 1-10>,
  "defenseRating": <defans OVR'larına dayalı 1-10>,
  "strengths": ["<${req.formation} ve bu kadroya özgü güçlü yön 1>", "<güçlü yön 2>", "<güçlü yön 3>"],
  "weaknesses": ["<${req.formation}'e özgü zayıf yön 1>", "<bu kadronun eksikliği>"],
  "tacticalComment": "<${req.formation} dizilişiyle ${req.managerName}'ın bu özgün kadrosuna has, oyuncu isimlerini geçiren, 3-4 cümle derinlikli Türkçe taktik yorum>",
  "predictedStyle": "<${req.formation} ve kadro OVR profiline dayalı özgün oyun stili>",
  "keyPlayer": "<bu kadroda gerçekten kritik olan oyuncunun adı ve ${req.formation} içindeki rolü>"
}`.trim();
}

const POZISYON_AGIRLIK: Record<string, number> = { GK: 5, DEF: 6, MID: 7, FWD: 8 };

function kadroGucu(takim: MatchTeam): number {
  const pozisyonSkoru = takim.oyuncular.reduce((acc, p) => {
    const agirlik = POZISYON_AGIRLIK[p.pozisyon] ?? 6;
    const uyumsuz = p.slotPozisyon && p.slotPozisyon !== p.pozisyon;
    return acc + agirlik * (uyumsuz ? 0.60 : 1.0);
  }, 0);
  const fwdSayi = parseInt(((takim.formasyon ?? "4-3-3").split("-").pop()) ?? "1", 10);
  const formasyonBonus = isNaN(fwdSayi) ? 2 : fwdSayi * 1.5;
  const gunFormu = Math.random() * 18;
  return pozisyonSkoru + formasyonBonus + gunFormu;
}

function agirlikliGol(): number {
  const r = Math.random() * 100;
  if (r < 15) return 0;
  if (r < 55) return 1;
  if (r < 85) return 2;
  if (r < 95) return 3;
  return 4;
}

export function macSonucuHesapla(evSahibi: MatchTeam, deplasman: MatchTeam): { ev: number; deplasman: number } {
  const evGuc = kadroGucu(evSahibi);
  const depGuc = kadroGucu(deplasman);
  const evDahaGuclu = evGuc >= depGuc;

  let evKazanma: number, beraberlik: number;
  if (evDahaGuclu) {
    evKazanma = 65; beraberlik = 20;
  } else {
    evKazanma = 30; beraberlik = 10;
  }

  const r = Math.random() * 100;
  if (r < evKazanma) {
    const evGol = Math.max(1, agirlikliGol());
    return { ev: evGol, deplasman: Math.floor(Math.random() * evGol) };
  } else if (r < evKazanma + beraberlik) {
    const gol = agirlikliGol();
    return { ev: gol, deplasman: gol };
  } else {
    const depGol = Math.max(1, agirlikliGol());
    return { ev: Math.floor(Math.random() * depGol), deplasman: depGol };
  }
}

function buildMatchPrompt(req: MatchSimRequest, sonuc: { ev: number; deplasman: number }): string {
  const fmt = (t: MatchTeam) =>
    `Formasyon: ${t.formasyon}\n` +
    t.oyuncular.map((o) => `  - ${o.isim} (${o.pozisyon}${o.slotPozisyon && o.slotPozisyon !== o.pozisyon ? ` ⚠ ${o.slotPozisyon} pozisyonunda oynuyor` : ""})`).join("\n");

  return `
Sen profesyonel bir futbol maç yorumcususun. Sana maçın sonucu önceden verildi.
Görevin: Bu sonuca BIREBIR uyan olay akışını Türkçe anlatımlarla üret.

EV SAHİBİ: ${req.evSahibi.isim} (${req.evSahibi.formasyon})
${fmt(req.evSahibi)}

DEPLASMAN: ${req.deplasman.isim} (${req.deplasman.formasyon})
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

export async function simulateMatch(req: MatchSimRequest): Promise<MatchSimResponse> {
  const sonuc = macSonucuHesapla(req.evSahibi, req.deplasman);
  try {
    const ai = createClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: buildMatchPrompt(req, sonuc) }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = (response.text ?? "")
      .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    const parsed = JSON.parse(text) as { olaylar: MatchEvent[] };
    parsed.olaylar.sort((a, b) => a.dakika - b.dakika);
    return { success: true, olaylar: parsed.olaylar, sonuc };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Maç simülasyonu başarısız: ${message}` };
  }
}

export async function analyzeTactically(req: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const ai = createClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: buildPrompt(req) }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = (response.text ?? "")
      .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    const parsed = JSON.parse(text) as Omit<TacticalAnalysis, "managerName" | "teamName">;
    return {
      success: true,
      analysis: { managerName: req.managerName, teamName: req.teamName, ...parsed },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Analiz yapılamadı: ${message}` };
  }
}
