import React, { useRef, useEffect, useState, useCallback } from "react";
import { Maximize2, Play, Pause } from "lucide-react";
import type { MatchEvent, MatchEventType } from "../../hooks/use-game-store";
import { HighlightsReplayModal } from "./HighlightsReplayModal";

// ── Canvas boyutları (kompakt) ────────────────────────────────────────────────
const CW = 220;
const CH = 140;
const PAD = { l: 10, r: 10, t: 10, b: 10 };
const PW = CW - PAD.l - PAD.r;
const PH = CH - PAD.t - PAD.b;
const toX = (x: number) => PAD.l + (x / 100) * PW;
const toY = (y: number) => PAD.t + (y / 100) * PH;

const EVENT_COLOR: Record<MatchEventType, string> = {
  GOL: "#22c55e",
  SUT: "#f97316",
  KART: "#eab308",
  KOSE_VURUSU: "#3b82f6",
  OYUN: "#ffffff33",
};

const EVENT_ICON: Record<MatchEventType, string> = {
  GOL: "⚽",
  SUT: "🎯",
  KART: "🟨",
  KOSE_VURUSU: "🚩",
  OYUN: "•",
};

const EVENT_TR: Record<MatchEventType, string> = {
  GOL: "GOL",
  SUT: "Şut",
  KART: "Sarı Kart",
  KOSE_VURUSU: "Köşe",
  OYUN: "Oyun",
};

// ── Saha çizici ───────────────────────────────────────────────────────────────
function drawMiniPitch(ctx: CanvasRenderingContext2D) {
  const L = PAD.l, T = PAD.t, R = L + PW, B = T + PH;
  const CX = L + PW / 2, CY = T + PH / 2;

  ctx.fillStyle = "#1a6b2f";
  ctx.fillRect(0, 0, CW, CH);

  const sw = PW / 8;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#1a6b2f" : "#1c7232";
    ctx.fillRect(L + i * sw, T, sw, PH);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1;
  ctx.strokeRect(L, T, PW, PH);

  ctx.beginPath(); ctx.moveTo(CX, T); ctx.lineTo(CX, B); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, 28, 0, Math.PI * 2); ctx.stroke();

  const penW = PW * 0.16, penH = PH * 0.58, penY = CY - penH / 2;
  ctx.strokeRect(L, penY, penW, penH);
  ctx.strokeRect(R - penW, penY, penW, penH);

  const gH = PH * 0.22, gW = 5;
  ctx.strokeRect(L - gW, CY - gH / 2, gW, gH);
  ctx.strokeRect(R, CY - gH / 2, gW, gH);
}

// ── Top ───────────────────────────────────────────────────────────────────────
function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#fff"; ctx.fill();
  ctx.strokeStyle = "#333"; ctx.lineWidth = 0.7; ctx.stroke();
  ctx.restore();
}

// ── Ripple ────────────────────────────────────────────────────────────────────
function drawRipple(ctx: CanvasRenderingContext2D, x: number, y: number, p: number, color: string) {
  ctx.save();
  ctx.globalAlpha = (1 - p) * 0.55;
  ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 24 * p, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// ── İstatistik satırı ────────────────────────────────────────────────────────
function StatRow({
  label,
  home,
  away,
  homeColor,
  awayColor,
  isPercent = false,
}: {
  label: string;
  home: number;
  away: number;
  homeColor: string;
  awayColor: string;
  isPercent?: boolean;
}) {
  const total = home + away || 1;
  const homePct = Math.round((home / total) * 100);
  const awayPct = 100 - homePct;
  const homeDisplay = isPercent ? `%${home}` : String(home);
  const awayDisplay = isPercent ? `%${away}` : String(away);
  return (
    <div className="px-3 py-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] font-bold tabular-nums" style={{ color: homeColor }}>
          {homeDisplay}
        </span>
        <span className="text-[10px] text-white/35 uppercase tracking-wider">{label}</span>
        <span className="text-[12px] font-bold tabular-nums" style={{ color: awayColor }}>
          {awayDisplay}
        </span>
      </div>
      <div className="flex h-[3px] rounded-full overflow-hidden gap-px">
        <div
          className="rounded-full transition-all"
          style={{ width: `${homePct}%`, background: homeColor, opacity: 0.75 }}
        />
        <div
          className="rounded-full transition-all"
          style={{ width: `${awayPct}%`, background: awayColor, opacity: 0.75 }}
        />
      </div>
    </div>
  );
}

// ── Bileşen ───────────────────────────────────────────────────────────────────
interface MatchSummaryPanelProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeColor?: string;
  awayColor?: string;
}

const LOOP_MS = 16_000; // 16 saniyede tüm key event'lar döner

export function MatchSummaryPanel({
  events,
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  homeColor = "#22c55e",
  awayColor = "#3b82f6",
}: MatchSummaryPanelProps) {
  const keyEvents = events.filter(
    e => e.olay === "GOL" || e.olay === "SUT" || e.olay === "KART" || e.olay === "KOSE_VURUSU"
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const prevBallRef = useRef({ x: CW / 2, y: CH / 2 });
  const ballRef = useRef({ x: CW / 2, y: CH / 2 });
  const rippleRef = useRef(0);
  const lastIdxRef = useRef(-1);
  const isPlayingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showFullReplay, setShowFullReplay] = useState(false);

  const perEvent = keyEvents.length > 0 ? LOOP_MS / keyEvents.length : LOOP_MS;

  // ── Statik ilk kare çiz (duraklatıldığında) ───────────────────────────────
  const drawStaticFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CW, CH);
    drawMiniPitch(ctx);
    const firstEv = keyEvents[0];
    const bx = firstEv ? toX(firstEv.koordinatlar?.x ?? 50) : CW / 2;
    const by = firstEv ? toY(firstEv.koordinatlar?.y ?? 50) : CH / 2;
    const color = firstEv ? EVENT_COLOR[firstEv.olay] : "#22c55e";
    drawBall(ctx, bx, by, color);
  }, [keyEvents]);

  // ── Animasyon döngüsü ─────────────────────────────────────────────────────
  const render = useCallback((now: number) => {
    if (!isPlayingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = (now - startRef.current) % LOOP_MS;
    const rawIdx = keyEvents.length > 0 ? Math.floor(elapsed / perEvent) : 0;
    const clamped = Math.min(rawIdx, keyEvents.length - 1);

    if (clamped !== lastIdxRef.current) {
      prevBallRef.current = { ...ballRef.current };
      lastIdxRef.current = clamped;
      rippleRef.current = 0;
      setActiveIdx(clamped);
    }

    const ev = keyEvents[clamped];
    const tx = ev ? toX(ev.koordinatlar?.x ?? 50) : CW / 2;
    const ty = ev ? toY(ev.koordinatlar?.y ?? 50) : CH / 2;
    const color = ev ? EVENT_COLOR[ev.olay] : "#22c55e";

    const tInSlot = elapsed - clamped * perEvent;
    const t = Math.min(tInSlot / 800, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const bx = prevBallRef.current.x + (tx - prevBallRef.current.x) * ease;
    const by = prevBallRef.current.y + (ty - prevBallRef.current.y) * ease;
    ballRef.current = { x: bx, y: by };

    if (t >= 1) {
      rippleRef.current = Math.min(rippleRef.current + 0.025, 1);
      if (rippleRef.current >= 1) rippleRef.current = 0;
    }

    ctx.clearRect(0, 0, CW, CH);
    drawMiniPitch(ctx);

    if (t >= 0.9) {
      ctx.save(); ctx.globalAlpha = 0.18;
      const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 30);
      g.addColorStop(0, color); g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(tx, ty, 30, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    if (rippleRef.current > 0) drawRipple(ctx, tx, ty, rippleRef.current, color);

    if (t < 1) {
      ctx.save(); ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(prevBallRef.current.x, prevBallRef.current.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.restore();
    }

    drawBall(ctx, bx, by, color);
    rafRef.current = requestAnimationFrame(render);
  }, [keyEvents, perEvent]);

  // ── Oynat/Durdur ──────────────────────────────────────────────────────────
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      // Animasyonu sıfırla ve başlat
      lastIdxRef.current = -1;
      rippleRef.current = 0;
      prevBallRef.current = { x: CW / 2, y: CH / 2 };
      ballRef.current = { x: CW / 2, y: CH / 2 };
      startRef.current = performance.now();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(render);
    } else {
      // Durdur
      cancelAnimationFrame(rafRef.current);
      drawStaticFrame();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, render, drawStaticFrame]);

  // ── İlk açılışta statik kareyi çiz ───────────────────────────────────────
  useEffect(() => {
    drawStaticFrame();
  }, [drawStaticFrame]);

  const activeEvent = keyEvents[activeIdx] ?? null;

  // ── İstatistikleri eventlerden hesapla ────────────────────────────────
  const homeShots   = events.filter(e => e.olay === "SUT"         && e.takim === "ev").length;
  const awayShots   = events.filter(e => e.olay === "SUT"         && e.takim === "deplasman").length;
  const homeCorners = events.filter(e => e.olay === "KOSE_VURUSU" && e.takim === "ev").length;
  const awayCorners = events.filter(e => e.olay === "KOSE_VURUSU" && e.takim === "deplasman").length;
  const homeCards   = events.filter(e => e.olay === "KART"        && e.takim === "ev").length;
  const awayCards   = events.filter(e => e.olay === "KART"        && e.takim === "deplasman").length;

  const possTotal = homeShots + awayShots + homeCorners + awayCorners + homeScore + awayScore || 1;
  const homePossRaw = Math.round(
    ((homeShots + homeCorners + homeScore) / possTotal) * 100
  );
  const homePoss = Math.min(70, Math.max(30, homePossRaw));
  const awayPoss = 100 - homePoss;

  if (keyEvents.length === 0) {
    return (
      <div className="p-3 text-center text-white/20 text-xs">
        Bu maçta kayıtlı animasyon verisi yok
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/8 bg-black/40">
        {/* Canvas */}
        <div className="relative w-full" style={{ height: CH }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="block w-full h-full"
            style={{ objectFit: "fill" }}
          />

          {/* Ortada büyük play butonu — yalnızca duraksatıldığında */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              title="Animasyonu başlat"
            >
              <div className="w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center group-hover:bg-black/90 group-hover:border-white/40 transition-all">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
            </button>
          )}

          {/* Aktif olay badge */}
          {isPlaying && activeEvent && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm border"
              style={{
                background: `${EVENT_COLOR[activeEvent.olay]}25`,
                borderColor: `${EVENT_COLOR[activeEvent.olay]}50`,
                color: EVENT_COLOR[activeEvent.olay],
              }}
            >
              {EVENT_ICON[activeEvent.olay]} {activeEvent.dakika}'
            </div>
          )}

          {/* Durdur / Büyüt butonları */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            {/* Durdur/Başlat */}
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="w-6 h-6 rounded-md bg-black/60 hover:bg-black/90 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
              title={isPlaying ? "Durdur" : "Başlat"}
            >
              {isPlaying
                ? <Pause className="w-3 h-3" />
                : <Play className="w-3 h-3 ml-px" />
              }
            </button>
            {/* Tam ekran */}
            <button
              onClick={() => setShowFullReplay(true)}
              className="w-6 h-6 rounded-md bg-black/60 hover:bg-black/90 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
              title="Tam ekran replay"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Olay listesi */}
        <div className="border-t border-white/5 divide-y divide-white/5 max-h-[180px] overflow-y-auto">
          {keyEvents.map((ev, i) => {
            const isActive = isPlaying && i === activeIdx;
            const playerName = ev.oyuncu ?? null;
            const isGoal = ev.olay === "GOL";
            const isCard = ev.olay === "KART";
            const isCorner = ev.olay === "KOSE_VURUSU";
            const isShot = ev.olay === "SUT";
            return (
              <div
                key={i}
                className="px-3 py-2 transition-colors"
                style={{
                  background: isActive ? `${EVENT_COLOR[ev.olay]}12` : "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs shrink-0 tabular-nums w-7 text-right font-medium"
                    style={{ color: isActive ? EVENT_COLOR[ev.olay] : "rgba(255,255,255,0.3)" }}
                  >
                    {ev.dakika}'
                  </span>
                  <span className="text-sm shrink-0">{EVENT_ICON[ev.olay]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wide shrink-0"
                        style={{ color: isActive ? EVENT_COLOR[ev.olay] : "rgba(255,255,255,0.5)" }}
                      >
                        {isGoal ? "GOL" : isCard ? "Sarı Kart" : isCorner ? "Korner" : "Şut"}
                      </span>
                      {playerName && (isGoal || isCard || isShot) && (
                        <span
                          className="text-[11px] font-semibold truncate"
                          style={{ color: isGoal ? "#4ade80" : isCard ? "#facc15" : "rgba(255,255,255,0.6)" }}
                        >
                          {playerName.split(" ").slice(-1)[0]}
                        </span>
                      )}
                      {playerName && isGoal && playerName.split(" ").length > 1 && (
                        <span className="text-[10px] text-white/30 truncate hidden sm:inline">
                          {playerName}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && ev.anlatim && (
                    <span className="text-[10px] text-white/40 leading-snug line-clamp-1 hidden sm:block max-w-[200px] shrink-0">
                      {ev.anlatim}
                    </span>
                  )}
                </div>
                {isActive && ev.anlatim && (
                  <p className="text-[10px] text-white/40 leading-snug mt-1 pl-[52px] sm:hidden line-clamp-2">
                    {ev.anlatim}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Maç İstatistikleri ──────────────────────────────────────── */}
        <div className="border-t border-white/8 pt-2 pb-1">
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span
              className="text-[10px] font-bold truncate max-w-[90px]"
              style={{ color: homeColor }}
            >
              {homeTeamName}
            </span>
            <span className="text-[9px] text-white/25 uppercase tracking-widest">İstatistikler</span>
            <span
              className="text-[10px] font-bold truncate max-w-[90px] text-right"
              style={{ color: awayColor }}
            >
              {awayTeamName}
            </span>
          </div>

          <div className="divide-y divide-white/5">
            <StatRow
              label="Topla Oynama"
              home={homePoss}
              away={awayPoss}
              homeColor={homeColor}
              awayColor={awayColor}
              isPercent
            />
            <StatRow
              label="Goller"
              home={homeScore}
              away={awayScore}
              homeColor={homeColor}
              awayColor={awayColor}
            />
            <StatRow
              label="Şutlar"
              home={homeShots}
              away={awayShots}
              homeColor={homeColor}
              awayColor={awayColor}
            />
            <StatRow
              label="Köşe Vuruşu"
              home={homeCorners}
              away={awayCorners}
              homeColor={homeColor}
              awayColor={awayColor}
            />
            <StatRow
              label="Sarı Kart"
              home={homeCards}
              away={awayCards}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          </div>
        </div>
      </div>

      {/* Tam ekran replay */}
      {showFullReplay && (
        <HighlightsReplayModal
          events={events}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          homeScore={homeScore}
          awayScore={awayScore}
          onClose={() => setShowFullReplay(false)}
        />
      )}
    </>
  );
}
