import React, { useRef, useEffect, useCallback, useState } from "react";
import { X, Play, Tv2, Target, AlertTriangle, Flag, Activity, Star, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "../ui/button";
import { useGameStore, type MatchEvent, type MatchEventType } from "../../hooks/use-game-store";
import { playGoalSound, playFinalWhistle, playCardSound, playKickSound, playPassSound, playCornerWhistle } from "../../lib/sounds";

// ── Tipler ────────────────────────────────────────────────────────────────────

type EventType = MatchEventType;

interface TeamInfo {
  isim: string;
  formasyon: string;
  oyuncular: { isim: string; pozisyon: string; slotPozisyon?: string }[];
}

interface MatchSimulatorProps {
  matchId: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  onClose: () => void;
  onMatchComplete: (matchId: string, homeScore: number, awayScore: number) => void;
}

// ── Sabitler ──────────────────────────────────────────────────────────────────

const EVENT_INTERVAL_MS = 10_000; // 10 saniye
const ANIM_DURATION_MS  = 2_200;  // gol skor gecikmesi

// ── Canlı Yorum Şablonları ─────────────────────────────────────────────────

const COMMENTARY: Record<EventType, string[][]> = {
  GOL: [
    ["GOOOL! ", "{oyuncu} topu ağlarla buluşturdu! {dakika}. dakika, skor değişiyor!"],
    ["İNANILMAZ! ", "{dakika}'. {oyuncu} müthiş bir vuruşla fileyi havalandırdı!"],
    ["", "{dakika}. dakikada {takim} öne geçiyor — {oyuncu} bu fırsatı tepmiyor!"],
    ["GOL! ", "{oyuncu} soğukkanlılıkla bitiriyor. {takim} büyük avantaj yakaladı!"],
  ],
  SUT: [
    ["", "{dakika}' — {oyuncu}'nün sert şutu kaleci tarafından kornere çıkarıldı."],
    ["", "Tehlikeli! {oyuncu} denedi ama direkten döndü. {dakika}'."],
    ["", "{oyuncu} uzak mesafeden deniyor, top az farkla dışarı geçiyor. {dakika}'."],
    ["", "Şut! {oyuncu}'nün vuruşu kalecinin kollarına gidiyor. {dakika}'."],
  ],
  KART: [
    ["", "Hakem kartı çıkardı — {oyuncu} sarı gördü! {dakika}. dakika."],
    ["", "{dakika}' — {oyuncu} fazla ileri gitti, hakem uyarı vermeden geçmedi."],
    ["", "{oyuncu} itiraz etse de sonuç değişmedi: sarı kart. {dakika}'."],
    ["", "Gergin bir an; hakem {oyuncu}'ye kart gösteriyor. {dakika}'."],
  ],
  KOSE_VURUSU: [
    ["", "Köşe vuruşu! {takim} için tehlikeli bir fırsat. {dakika}'."],
    ["", "{dakika}' — {oyuncu} köşe vuruşunu kullanıyor, ceza sahasında kargaşa var!"],
    ["", "Top direkten çıktı, kornere çıkıyor. {oyuncu} kullanacak. {dakika}'."],
  ],
  OYUN: [
    ["", "{oyuncu} topu akıllıca sahaya yayıyor. {takim} oyunu kontrol ediyor. {dakika}'."],
    ["", "{dakika}' — {takim} baskı uyguluyor; {oyuncu} organizasyonun merkezinde."],
    ["", "{oyuncu} hızlı bir kombinasyonla tehlike kapıya kadar taşıyor. {dakika}'."],
    ["", "Top {oyuncu}'ya geliyor, zekice bir dokunuşla yönünü değiştiriyor. {dakika}'."],
  ],
};

function buildCommentary(ev: MatchEvent, homeName: string, awayName: string): string {
  const templates = COMMENTARY[ev.olay];
  const [prefix, tpl] = templates[Math.floor(Math.random() * templates.length)];
  const takimAdi = ev.takim === "ev" ? homeName : awayName;
  return prefix + tpl
    .replace("{oyuncu}", ev.oyuncu ?? "Oyuncu")
    .replace("{takim}", takimAdi)
    .replace(/\{dakika\}/g, String(ev.dakika));
}

const EVENT_ICON: Record<EventType, React.ReactNode> = {
  GOL: <span className="text-lg">⚽</span>,
  SUT: <Target className="w-4 h-4 text-orange-400" />,
  KART: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  KOSE_VURUSU: <Flag className="w-4 h-4 text-blue-400" />,
  OYUN: <Activity className="w-4 h-4 text-white/40" />,
};

const EVENT_COLOR: Record<EventType, string> = {
  GOL: "#22c55e",
  SUT: "#f97316",
  KART: "#eab308",
  KOSE_VURUSU: "#3b82f6",
  OYUN: "#ffffff33",
};


// ── Pozisyon Etiketleri ────────────────────────────────────────────────────────

const POS_LABEL: Record<string, string> = { GK: "KLC", DEF: "DEF", MID: "ORS", FWD: "FOR" };
const POS_BASE: Record<string, number> = { GK: 6.4, DEF: 6.2, MID: 6.5, FWD: 6.7 };

function ratingColor(r: number): string {
  if (r >= 8.5) return "#fbbf24";
  if (r >= 7.5) return "#22c55e";
  if (r >= 6.5) return "#3b82f6";
  if (r >= 5.5) return "#f97316";
  return "#ef4444";
}

// ── Oyuncu Puan Paneli ─────────────────────────────────────────────────────────

function PlayerRatingPanel({
  players,
  side,
  flashPlayer,
  label,
}: {
  players: { isim: string; pozisyon: string; slotPozisyon?: string; rating: number }[];
  side: "left" | "right";
  flashPlayer: string | null;
  label: string;
}) {
  return (
    <div className={`flex flex-col gap-0 w-44 shrink-0 ${side === "right" ? "items-end" : "items-start"}`}>
      <p className={`text-[9px] uppercase tracking-[0.2em] text-white/20 font-medium mb-1.5 ${side === "right" ? "text-right" : "text-left"} w-full px-1`}>
        {label}
      </p>
      {players.map((p) => {
        const flash = p.isim === flashPlayer;
        const color = ratingColor(p.rating);
        const uyumsuz = p.slotPozisyon && p.slotPozisyon !== p.pozisyon;
        return (
          <div
            key={p.isim}
            className="w-full rounded-lg border px-2.5 py-1.5 mb-1 transition-all duration-500"
            style={
              flash
                ? { borderColor: `${color}55`, background: `${color}12` }
                : uyumsuz
                ? { borderColor: "#f9731640", background: "rgba(249,115,22,0.06)" }
                : { borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }
            }
          >
            <div className={`flex items-center gap-1.5 ${side === "right" ? "flex-row-reverse" : ""}`}>
              <span
                className="font-display text-sm font-bold shrink-0 tabular-nums transition-all duration-500"
                style={{ color }}
              >
                {p.rating.toFixed(1)}
              </span>
              <span className="text-white/70 text-[11px] font-medium truncate flex-1 leading-none">
                {p.isim.split(" ").slice(-1)[0]}
              </span>
              <span className={`text-[9px] shrink-0 leading-none ${uyumsuz ? "text-orange-400" : "text-white/20"}`}>
                {uyumsuz ? "⚠" : (POS_LABEL[p.pozisyon] ?? p.pozisyon)}
              </span>
            </div>
            <div className={`flex items-center gap-1 mt-1 ${side === "right" ? "flex-row-reverse" : ""}`}>
              <div className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(p.rating / 10) * 100}%`, background: color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Ana Bileşen ────────────────────────────────────────────────────────────────

export function MatchSimulator({ matchId, homeTeam, awayTeam, onClose, onMatchComplete }: MatchSimulatorProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "done">("idle");
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [score, setScore] = useState({ ev: 0, dep: 0 });
  const [error, setError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<{ ev: number; dep: number } | null>(null);

  // ── Oyuncu puanlama state ───────────────────────────────────────────────────
  const [playerRatings, setPlayerRatings] = useState<Map<string, number>>(new Map());
  const [flashPlayer, setFlashPlayer] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [mutedSounds, setMutedSounds] = useState<Set<string>>(new Set());
  const [commentary, setCommentary] = useState<{ text: string; type: EventType } | null>(null);
  const commentaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutedSoundsRef = useRef<Set<string>>(new Set());
  mutedSoundsRef.current = mutedSounds;

  const toggleSoundType = (type: string) =>
    setMutedSounds(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (goalScoreTimerRef.current) clearTimeout(goalScoreTimerRef.current);
      if (commentaryTimerRef.current) clearTimeout(commentaryTimerRef.current);
    };
  }, []);

  // ── Oyuncu puanlarını başlat ───────────────────────────────────────────────

  useEffect(() => {
    const init = new Map<string, number>();
    for (const p of [...homeTeam.oyuncular, ...awayTeam.oyuncular]) {
      const base = POS_BASE[p.pozisyon] ?? 6.3;
      const uyumsuz = p.slotPozisyon && p.slotPozisyon !== p.pozisyon;
      const baslangic = uyumsuz ? base - 1.8 : base;
      init.set(p.isim, +(baslangic + (Math.random() - 0.5) * 0.8).toFixed(1));
    }
    setPlayerRatings(init);
  }, []);

  // ── Olaydan etkilenen oyuncunun puanını güncelle ───────────────────────────

  useEffect(() => {
    if (currentIdx < 0) return;
    const ev = events[currentIdx];
    if (!ev) return;

    const team = ev.takim === "ev" ? homeTeam.oyuncular : awayTeam.oyuncular;
    if (team.length === 0) return;

    // Olaya göre ağırlıklı oyuncu seçimi
    let pool = [...team];
    if (ev.olay === "GOL" || ev.olay === "SUT") {
      const f = team.filter(p => p.pozisyon === "FWD" || p.pozisyon === "MID");
      if (f.length > 0) pool = f;
    } else if (ev.olay === "KART") {
      const f = team.filter(p => p.pozisyon === "DEF" || p.pozisyon === "MID");
      if (f.length > 0) pool = f;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    const pickedUyumsuz = picked.slotPozisyon && picked.slotPozisyon !== picked.pozisyon;

    const DELTA: Record<string, number> = {
      GOL: +(1.4 + Math.random() * 0.8).toFixed(1),
      SUT: +(0.3 + Math.random() * 0.4).toFixed(1),
      KART: -(0.7 + Math.random() * 0.6).toFixed(1),
      KOSE_VURUSU: +(0.15 + Math.random() * 0.15).toFixed(1),
      OYUN: +(0.05 + Math.random() * 0.1).toFixed(1),
    };

    setPlayerRatings(prev => {
      const next = new Map(prev);
      const cur = next.get(picked.isim) ?? 6.5;
      let delta = DELTA[ev.olay] ?? 0;
      if (pickedUyumsuz && delta > 0) delta = +(delta * 0.45).toFixed(1);
      const updated = Math.max(3.5, Math.min(10.0, cur + delta));
      next.set(picked.isim, +updated.toFixed(1));
      return next;
    });

    setFlashPlayer(picked.isim);
    const t = setTimeout(() => setFlashPlayer(null), 900);
    return () => clearTimeout(t);
  }, [currentIdx]);

  // ── Olay kaydırma ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [currentIdx]);

  // ── Olayları sırayla oynat ────────────────────────────────────────────────
  // Senkronizasyon tasarımı:
  //   t=0          : top hareket eder + ses çalar + yorum görünür + dakika güncellenir
  //   t=ANIM(2200) : sadece GOL → skor güncellenir (top ağa girdi hissi)
  //   t=EVENT-600  : yorum kaybolur
  //   t=EVENT(10s) : sonraki olay

  const goalScoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playEvent = useCallback((idx: number, evList: MatchEvent[], currentScore: { ev: number; dep: number }) => {
    if (idx >= evList.length) {
      setStatus("done");
      return;
    }

    const ev = evList[idx];
    const ms = mutedSoundsRef.current;

    // Yeni skoru önceden hesapla
    let newScore = { ...currentScore };
    if (ev.olay === "GOL") {
      if (ev.takim === "ev") newScore = { ...newScore, ev: newScore.ev + 1 };
      else newScore = { ...newScore, dep: newScore.dep + 1 };
    }

    // Anında: dakika + log + yorum + ses
    setCurrentIdx(idx);

    // Ses — GOL'de skor animasyonuyla aynı anda (ANIM sonrası) çal
    if (ev.olay === "GOL") {
      if (goalScoreTimerRef.current) clearTimeout(goalScoreTimerRef.current);
      goalScoreTimerRef.current = setTimeout(() => {
        setScore(newScore);
        if (!ms.has("GOL")) playGoalSound();
      }, ANIM_DURATION_MS);
    } else if (ev.olay === "KART") {
      if (!ms.has("KART")) playCardSound();
    } else if (ev.olay === "SUT") {
      if (!ms.has("SUT")) playKickSound();
    } else if (ev.olay === "KOSE_VURUSU") {
      if (!ms.has("KOSE_VURUSU")) playCornerWhistle();
    } else if (ev.olay === "OYUN") {
      if (!ms.has("OYUN")) playPassSound();
    }

    // 3) Yorum — anında göster, sonraki olay başlamadan 600 ms önce sil
    if (commentaryTimerRef.current) clearTimeout(commentaryTimerRef.current);
    const commentaryText = ev.anlatim || buildCommentary(ev, homeTeam.isim, awayTeam.isim);
    setCommentary({ text: commentaryText, type: ev.olay });
    commentaryTimerRef.current = setTimeout(
      () => setCommentary(null),
      EVENT_INTERVAL_MS - 600
    );

    // 4) Sonraki olayı zamanla
    timerRef.current = setTimeout(() => {
      playEvent(idx + 1, evList, newScore);
    }, EVENT_INTERVAL_MS);
  }, [homeTeam.isim, awayTeam.isim]);

  // ── Maçı başlat ───────────────────────────────────────────────────────────

  const startMatch = async () => {
    setStatus("loading");
    setError(null);
    setEvents([]);
    setCurrentIdx(-1);
    setScore({ ev: 0, dep: 0 });
    setFinalScore(null);

    try {
      const resp = await fetch(`/api/analysis/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evSahibi: homeTeam,
          deplasman: awayTeam,
        }),
      });

      // Önce yanıt metnini al, sonra JSON olarak ayrıştır
      const text = await resp.text();
      let data: { success: boolean; olaylar?: MatchEvent[]; sonuc?: { ev: number; deplasman: number }; error?: string };
      try {
        data = JSON.parse(text);
      } catch {
        // HTML hata sayfası veya boş yanıt geldi
        if (!resp.ok) {
          throw new Error(`Yapay zeka sunucusuna bağlanılamadı (${resp.status}). Lütfen tekrar deneyin.`);
        }
        throw new Error("Sunucudan geçersiz yanıt alındı. Lütfen tekrar deneyin.");
      }

      if (!resp.ok || !data.success || !data.olaylar) throw new Error(data.error ?? "Sunucu hatası");

      setEvents(data.olaylar);
      setFinalScore(data.sonuc ? { ev: data.sonuc.ev, dep: data.sonuc.deplasman } : null);
      setStatus("playing");
      setTimeout(() => playEvent(0, data.olaylar!, { ev: 0, dep: 0 }), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      setStatus("idle");
    }
  };

  // ── Maç tamamlandı → skor & olayları kaydet ──────────────────────────────

  const { saveMatchEvents } = useGameStore();

  useEffect(() => {
    if (status === "done" && finalScore) {
      playFinalWhistle();
      onMatchComplete(matchId, finalScore.ev, finalScore.dep);
      if (events.length > 0) {
        saveMatchEvents(matchId, events);
      }
    }
  }, [status, finalScore, matchId, onMatchComplete, saveMatchEvents, events]);

  // ── Render ────────────────────────────────────────────────────────────────

  const currentEvent = currentIdx >= 0 ? events[currentIdx] : null;
  const matchMin = currentEvent?.dakika ?? 0;
  const progress = Math.min((matchMin / 90) * 100, 100);

  // Top-3 oyuncular (puana göre sıralı)
  const getTop3 = (players: { isim: string; pozisyon: string; slotPozisyon?: string }[]) =>
    [...players]
      .map(p => ({ ...p, rating: playerRatings.get(p.isim) ?? (POS_BASE[p.pozisyon] ?? 6.3) }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

  const homeTop3 = getTop3(homeTeam.oyuncular);
  const awayTop3 = getTop3(awayTeam.oyuncular);

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/80 backdrop-blur-sm md:p-4">
      <div className="bg-gray-950 border-0 md:border border-white/10 md:rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-screen md:max-h-[95vh] flex flex-col">

        {/* Başlık */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-black/40 shrink-0">
          <div className="flex items-center gap-2 text-white/50">
            <Tv2 className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest hidden sm:inline">Canlı Maç Simülasyonu</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Olay sesi toggle'ları */}
            <div className="flex items-center gap-0.5">
              {([
                { type: "GOL",         emoji: "⚽", label: "Gol sesi" },
                { type: "KART",        emoji: "🟨", label: "Kart sesi" },
                { type: "SUT",         emoji: "🎯", label: "Şut sesi" },
                { type: "KOSE_VURUSU", emoji: "🚩", label: "Köşe sesi" },
                { type: "OYUN",        emoji: "⚡", label: "Oyun sesi" },
              ] as const).map(({ type, emoji, label }) => {
                const muted = mutedSounds.has(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleSoundType(type)}
                    title={muted ? `${label} aç` : `${label} kapat`}
                    className="relative w-7 h-7 flex items-center justify-center rounded transition-all"
                    style={{ opacity: muted ? 0.25 : 0.75 }}
                  >
                    <span className="text-sm leading-none">{emoji}</span>
                    {muted && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-5 h-px bg-white/70 rotate-45 block" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Ses kontrolü */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={() => setVolume(v => v === 0 ? 80 : 0)}
                className="text-white/40 hover:text-white/80 transition-colors"
                title={volume === 0 ? "Sesi aç" : "Sesi kapat"}
              >
                {volume === 0
                  ? <VolumeX className="w-4 h-4" />
                  : volume <= 50
                  ? <Volume1 className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />
                }
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-20 h-1 accent-primary cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                title={`Ses: ${volume}%`}
              />
            </div>
            {/* Kapat */}
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 1. PROGRESS BAR ── */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-black/30 shrink-0">
          <span className="text-white/30 text-xs font-display w-10 text-right">
            {status === "playing" || status === "done" ? `${matchMin}'` : "–"}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: `${status === "done" ? 100 : progress}%` }}
            />
          </div>
          <span className="text-white/30 text-xs font-display w-6">90'</span>
        </div>

        {/* ── 2. CANLI ANLATIM BANDI ── */}
        {commentary && (() => {
          const goalStyle   = "border-green-500/40 bg-green-950/80 text-green-300";
          const cardStyle   = "border-yellow-500/40 bg-yellow-950/80 text-yellow-200";
          const shotStyle   = "border-orange-500/40 bg-orange-950/80 text-orange-200";
          const cornerStyle = "border-blue-500/40 bg-blue-950/80 text-blue-200";
          const playStyle   = "border-white/10 bg-black/80 text-white/60";
          const style = commentary.type === "GOL" ? goalStyle
            : commentary.type === "KART" ? cardStyle
            : commentary.type === "SUT" ? shotStyle
            : commentary.type === "KOSE_VURUSU" ? cornerStyle
            : playStyle;
          const [bold, rest] = (() => {
            const m = commentary.text.match(/^([A-ZÇĞİÖŞÜ!][A-ZÇĞİÖŞÜa-zçğışöüA-Z!\s]*?[!?])\s+(.+)$/s);
            return m ? [m[1], m[2]] : ["", commentary.text];
          })();
          return (
            <div
              className={`px-4 py-3 border-b text-sm leading-snug flex items-start gap-3 shrink-0 ${style}`}
              style={{ animation: "commentaryIn 0.3s ease-out" }}
            >
              <span className="text-xl shrink-0 mt-0.5">
                {commentary.type === "GOL" ? "⚽" : commentary.type === "KART" ? "🟨" : commentary.type === "SUT" ? "🎯" : commentary.type === "KOSE_VURUSU" ? "🚩" : "⚡"}
              </span>
              <span className="leading-relaxed">
                {bold && <strong className="font-bold mr-1">{bold}</strong>}
                {rest}
              </span>
            </div>
          );
        })()}

        {/* ── 3. AŞAĞI BÖLÜM — scroll edilebilir ── */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* Skor tablosu + Oyuncu Panelleri */}
          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-black/60 via-black/20 to-black/60 border-b border-white/5 gap-3 shrink-0">
            <PlayerRatingPanel players={homeTop3} side="left" flashPlayer={flashPlayer} label={`${homeTeam.isim} · En Aktif`} />
            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="text-right min-w-0 flex-1">
                <p className="font-display text-white text-sm md:text-base uppercase tracking-wider leading-tight truncate">{homeTeam.isim}</p>
                <p className="text-white/30 text-[10px] mt-0.5 hidden sm:block">{homeTeam.formasyon} · Ev Sahibi</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <span className={`font-display text-4xl md:text-5xl tabular-nums ${score.ev > score.dep ? "text-primary" : "text-white"}`}>{score.ev}</span>
                <span className="text-white/20 text-xl md:text-2xl font-display">–</span>
                <span className={`font-display text-4xl md:text-5xl tabular-nums ${score.dep > score.ev ? "text-primary" : "text-white"}`}>{score.dep}</span>
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-display text-white text-sm md:text-base uppercase tracking-wider leading-tight truncate">{awayTeam.isim}</p>
                <p className="text-white/30 text-[10px] mt-0.5 hidden sm:block">{awayTeam.formasyon} · Deplasman</p>
              </div>
            </div>
            <PlayerRatingPanel players={awayTop3} side="right" flashPlayer={flashPlayer} label={`${awayTeam.isim} · En Aktif`} />
          </div>

          {/* Sol + Sağ içerik */}
          <div className="flex flex-col md:flex-row">

            {/* Sol: Buton / Yükleme / İstatistikler */}
            <div className="flex-1 p-4 flex flex-col gap-3">

            {/* Buton */}
            {status === "idle" && (
              <Button
                onClick={startMatch}
                className="bg-primary text-black hover:bg-primary/80 font-display tracking-widest uppercase text-sm"
              >
                <Play className="w-4 h-4 mr-2 fill-black" /> Maçı Başlat
              </Button>
            )}
            {status === "loading" && (
              <div className="flex items-center justify-center py-4">
                <div className="relative w-14 h-14">
                  {/* Dış halka */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/8" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" style={{ animationDuration: "1s" }} />
                  {/* Orta halka (ters yön) */}
                  <div className="absolute inset-[5px] rounded-full border-2 border-transparent border-t-primary/50 animate-spin" style={{ animationDuration: "0.75s", animationDirection: "reverse" }} />
                  {/* İç dot */}
                  <div className="absolute inset-[18px] rounded-full bg-primary/70 animate-pulse" />
                </div>
              </div>
            )}
            {status === "done" && events.length > 0 && (() => {
              const keyEvents = events.filter(e => e.olay === "GOL" || e.olay === "KART" || e.olay === "SUT");
              const goals = events.filter(e => e.olay === "GOL");
              const cards = events.filter(e => e.olay === "KART");
              const shots = events.filter(e => e.olay === "SUT");

              // İstatistikler
              const hGol    = goals.filter(e => e.takim === "ev").length;
              const aGol    = goals.filter(e => e.takim === "deplasman").length;
              const hSut    = events.filter(e => e.olay === "SUT" && e.takim === "ev").length;
              const aSut    = events.filter(e => e.olay === "SUT" && e.takim === "deplasman").length;
              const hKart   = events.filter(e => e.olay === "KART" && e.takim === "ev").length;
              const aKart   = events.filter(e => e.olay === "KART" && e.takim === "deplasman").length;
              const hKose   = events.filter(e => e.olay === "KOSE_VURUSU" && e.takim === "ev").length;
              const aKose   = events.filter(e => e.olay === "KOSE_VURUSU" && e.takim === "deplasman").length;
              const hOyun   = events.filter(e => e.olay === "OYUN" && e.takim === "ev").length;
              const aOyun   = events.filter(e => e.olay === "OYUN" && e.takim === "deplasman").length;
              const topTop  = hOyun + aOyun || 1;
              const hPoss   = Math.round((hOyun / topTop) * 100);
              const aPoss   = 100 - hPoss;

              const StatRow = ({ label, h, a, color = "bg-primary" }: { label: string; h: number; a: number; color?: string }) => {
                const total = h + a || 1;
                const hPct = (h / total) * 100;
                const aPct = (a / total) * 100;
                return (
                  <div className="flex items-center gap-3 py-1.5">
                    <span className="text-white font-display text-sm tabular-nums w-5 text-right">{h}</span>
                    <div className="flex-1 flex h-1.5 rounded-full overflow-hidden bg-white/5 gap-px">
                      <div className={`h-full ${color} rounded-l-full transition-all`} style={{ width: `${hPct}%` }} />
                      <div className="h-full bg-white/20 rounded-r-full transition-all" style={{ width: `${aPct}%` }} />
                    </div>
                    <span className="text-white font-display text-sm tabular-nums w-5">{a}</span>
                    <span className="text-white/40 text-[10px] uppercase tracking-wider w-14 text-center">{label}</span>
                  </div>
                );
              };

              return (
                <>
                {/* Maç Sonu İstatistikler */}
                <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-white/5">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    <span className="text-white/60 text-xs uppercase tracking-widest font-medium">Maç İstatistikleri</span>
                    <div className="ml-auto flex gap-2 text-[10px] text-white/30">
                      <span className="truncate max-w-[70px]">{homeTeam.isim}</span>
                      <span>vs</span>
                      <span className="truncate max-w-[70px] text-right">{awayTeam.isim}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 space-y-0.5">
                    <StatRow label="Gol"    h={hGol}  a={aGol}  color="bg-green-500" />
                    <StatRow label="Şut"    h={hSut}  a={aSut}  color="bg-orange-400" />
                    <StatRow label="Kart"   h={hKart} a={aKart} color="bg-yellow-400" />
                    <StatRow label="Korner" h={hKose} a={aKose} color="bg-blue-400" />
                    <StatRow label="Topla"  h={hPoss} a={aPoss} color="bg-primary" />
                    <div className="flex items-center justify-between pt-1 pb-0.5">
                      <span className="text-white/20 text-[9px]">Top. %{hPoss}</span>
                      <span className="text-white/20 text-[9px]">Top. %{aPoss}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                  {/* Başlık */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-white/5">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-white/60 text-xs uppercase tracking-widest font-medium">Önemli Dakikalar</span>
                    <div className="ml-auto flex items-center gap-3 text-xs text-white/30">
                      <span>⚽ {goals.length}</span>
                      <span>🟨 {cards.length}</span>
                      <span>🎯 {shots.length}</span>
                    </div>
                  </div>

                  {/* Olay listesi */}
                  <div className="p-3 space-y-1.5 max-h-48 overflow-y-auto">
                    {keyEvents.length === 0 ? (
                      <p className="text-center text-white/20 text-xs py-3">Önemli olay bulunmadı</p>
                    ) : keyEvents.map((ev, i) => {
                      const isGoal = ev.olay === "GOL";
                      const isCard = ev.olay === "KART";
                      const isHome = ev.takim === "ev";
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-2 rounded-lg"
                          style={{
                            background: isGoal
                              ? "rgba(34,197,94,0.08)"
                              : isCard
                              ? "rgba(234,179,8,0.06)"
                              : "rgba(249,115,22,0.05)",
                          }}
                        >
                          {/* Dakika */}
                          <span className="font-display text-sm tabular-nums shrink-0 w-8 text-right text-white/40">
                            {ev.dakika}'
                          </span>

                          {/* İkon */}
                          <span className="text-base leading-none shrink-0 mt-0.5">
                            {isGoal ? "⚽" : isCard ? "🟨" : "🎯"}
                          </span>

                          {/* İçerik */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isGoal && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">GOL!</span>
                              )}
                              {isCard && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Sarı Kart</span>
                              )}
                              {ev.oyuncu && (
                                <span className={`text-[10px] font-semibold truncate max-w-[90px] ${isGoal ? "text-green-300" : isCard ? "text-yellow-300" : "text-white/60"}`}>
                                  {ev.oyuncu.split(" ").slice(-1)[0]}
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 text-[11px] leading-snug mt-0.5 line-clamp-2">
                              {ev.anlatim}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Alt bilgi */}
                  <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <p className="text-white/20 text-[10px]">Skor tabloya işlendi ✓</p>
                    <p className="text-primary font-display text-xs tracking-widest uppercase">Maç Bitti</p>
                  </div>
                </div>
                </>
              );
            })()}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Sağ: Olay günlüğü */}
          <div className="w-72 border-l border-white/5 flex flex-col">
            <div className="px-4 py-3 border-b border-white/5 bg-black/20 flex items-center gap-2">
              <p className="text-white/30 text-xs uppercase tracking-widest flex-1">
                {status === "done" ? "Tüm Olaylar" : "Maç Olayları"}
              </p>
              {status === "done" && (
                <span className="text-[10px] text-primary uppercase tracking-widest">
                  {events.length} olay
                </span>
              )}
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[460px]">
              {events.slice(0, currentIdx + 1).map((ev, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border transition-all ${
                    i === currentIdx
                      ? "bg-white/10 border-white/20 scale-[1.02]"
                      : "bg-black/30 border-white/5"
                  }`}
                  style={ev.olay === "GOL" ? { borderColor: `${EVENT_COLOR.GOL}44` } : {}}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/30 font-display text-sm w-8 shrink-0">{ev.dakika}'</span>
                    {EVENT_ICON[ev.olay]}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-xs uppercase tracking-wider font-medium shrink-0"
                          style={{ color: EVENT_COLOR[ev.olay] }}
                        >
                          {ev.olay === "GOL" ? "⚡ GOL!" : ev.olay === "KART" ? "🟨 Sarı Kart" : ev.olay.replace("_", " ")}
                        </span>
                        {ev.oyuncu && (ev.olay === "GOL" || ev.olay === "KART" || ev.olay === "SUT") && (
                          <span className="text-[10px] font-semibold truncate" style={{ color: EVENT_COLOR[ev.olay] }}>
                            {ev.oyuncu.split(" ").slice(-1)[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    {ev.oyuncu && !(ev.olay === "GOL" || ev.olay === "KART" || ev.olay === "SUT") && (
                      <span className="text-white/20 text-[10px] shrink-0 truncate max-w-[60px]">
                        {ev.oyuncu.split(" ").slice(-1)[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-10">{ev.anlatim}</p>
                </div>
              ))}
              {(status === "idle" || status === "loading") && events.length === 0 && (
                <div className="text-center text-white/15 text-xs py-8">
                  Maç başladığında olaylar burada görünecek
                </div>
              )}
            </div>
          </div>

          </div>{/* /flex col-row */}
        </div>{/* /scrollable section */}
      </div>{/* /card */}
    </div>
  );
}
