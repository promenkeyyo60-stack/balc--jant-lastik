import React, { useRef, useEffect, useState, useCallback } from "react";
import { X, Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import type { MatchEvent, MatchEventType } from "../../hooks/use-game-store";

// ── Canvas boyutları ──────────────────────────────────────────────────────────
const CW = 600;
const CH = 380;
const PAD = { l: 20, r: 20, t: 20, b: 20 };
const PW = CW - PAD.l - PAD.r;
const PH = CH - PAD.t - PAD.b;
const toCanvasX = (x: number) => PAD.l + (x / 100) * PW;
const toCanvasY = (y: number) => PAD.t + (y / 100) * PH;

const EVENT_LABEL: Record<MatchEventType, string> = {
  GOL: "⚽ GOL!",
  SUT: "🎯 Şut",
  KART: "🟨 Kart",
  KOSE_VURUSU: "🚩 Köşe Vuruşu",
  OYUN: "Oyun",
};

const EVENT_COLOR: Record<MatchEventType, string> = {
  GOL: "#22c55e",
  SUT: "#f97316",
  KART: "#eab308",
  KOSE_VURUSU: "#3b82f6",
  OYUN: "#ffffff44",
};

// ── Saha çizimi ───────────────────────────────────────────────────────────────
function drawPitch(ctx: CanvasRenderingContext2D) {
  const L = PAD.l, T = PAD.t;
  const CX = L + PW / 2, CY = T + PH / 2;
  const R = L + PW, B = T + PH;

  ctx.fillStyle = "#1a6b2f";
  ctx.fillRect(0, 0, CW, CH);

  const stripeW = PW / 10;
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#1a6b2f" : "#1d7535";
    ctx.fillRect(L + i * stripeW, T, stripeW, PH);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  ctx.strokeRect(L, T, PW, PH);
  ctx.beginPath(); ctx.moveTo(CX, T); ctx.lineTo(CX, B); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, 44, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fill();

  const penW = PW * 0.157;
  const penH = PH * 0.593;
  const penY = CY - penH / 2;
  ctx.strokeRect(L, penY, penW, penH);
  ctx.strokeRect(R - penW, penY, penW, penH);

  const gkW = PW * 0.057;
  const gkH = PH * 0.286;
  const gkY = CY - gkH / 2;
  ctx.strokeRect(L, gkY, gkW, gkH);
  ctx.strokeRect(R - gkW, gkY, gkW, gkH);

  const gW = 8, gH = PH * 0.12;
  ctx.strokeRect(L - gW, CY - gH / 2, gW, gH);
  ctx.strokeRect(R, CY - gH / 2, gW, gH);
}

// ── Top çizimi ────────────────────────────────────────────────────────────────
function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, glow: string) {
  const r = 9;
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

// ── Ripple efekti ─────────────────────────────────────────────────────────────
function drawRipple(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, color: string) {
  const maxR = 38;
  const r = maxR * progress;
  ctx.save();
  ctx.globalAlpha = (1 - progress) * 0.6;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

interface HighlightsReplayModalProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  onClose: () => void;
}

const AUTO_ADVANCE_MS = 4000;

export function HighlightsReplayModal({
  events,
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  onClose,
}: HighlightsReplayModalProps) {
  const keyEvents = events.filter(
    e => e.olay === "GOL" || e.olay === "SUT" || e.olay === "KART" || e.olay === "KOSE_VURUSU"
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const ballPosRef = useRef({ x: CW / 2, y: CH / 2 });
  const prevBallRef = useRef({ x: CW / 2, y: CH / 2 });
  const rippleRef = useRef(0);

  const [idx, setIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [animProgress, setAnimProgress] = useState(0); // 0→1 progress bar için

  const currentEvent = keyEvents[idx] ?? null;

  // Top'un hedef koordinatı
  const targetX = currentEvent ? toCanvasX(currentEvent.koordinatlar.x) : CW / 2;
  const targetY = currentEvent ? toCanvasY(currentEvent.koordinatlar.y) : CH / 2;
  const eventColor = currentEvent ? EVENT_COLOR[currentEvent.olay] : "#22c55e";

  // Yeni olaya geçişte animasyonu sıfırla
  useEffect(() => {
    prevBallRef.current = { ...ballPosRef.current };
    startTimeRef.current = performance.now();
    rippleRef.current = 0;
  }, [idx]);

  // Canvas render loop
  const render = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = now - startTimeRef.current;
    const MOVE_DURATION = 1200;
    const t = Math.min(elapsed / MOVE_DURATION, 1);
    // ease in-out cubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const bx = prevBallRef.current.x + (targetX - prevBallRef.current.x) * ease;
    const by = prevBallRef.current.y + (targetY - prevBallRef.current.y) * ease;
    ballPosRef.current = { x: bx, y: by };

    // Ripple (sadece t >= 1 sonrası)
    if (t >= 1) {
      rippleRef.current = Math.min(rippleRef.current + 0.018, 1);
    }

    const progress = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
    setAnimProgress(progress);

    // Çiz
    ctx.clearRect(0, 0, CW, CH);
    drawPitch(ctx);

    // Hedef noktası aydınlatması
    if (t >= 0.9) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      const grad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 50);
      grad.addColorStop(0, eventColor);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Ripple efekti
    if (rippleRef.current > 0) {
      drawRipple(ctx, targetX, targetY, rippleRef.current, eventColor);
      if (rippleRef.current >= 1) rippleRef.current = 0; // tekrar başlat
    }

    // Top
    drawBall(ctx, bx, by, eventColor);

    // Yol izi (hareket sırasında)
    if (t < 1) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = eventColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(prevBallRef.current.x, prevBallRef.current.y);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(render);
  }, [targetX, targetY, eventColor]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  // Otomatik ilerleme
  useEffect(() => {
    if (!autoPlay || keyEvents.length === 0) return;
    const timer = setTimeout(() => {
      setIdx(prev => (prev + 1) % keyEvents.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [autoPlay, idx, keyEvents.length]);

  const goTo = (newIdx: number) => {
    setIdx(((newIdx % keyEvents.length) + keyEvents.length) % keyEvents.length);
  };

  if (keyEvents.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-8 text-center text-white/30 max-w-sm">
          <p className="text-4xl mb-4">🎬</p>
          <p>Bu maçta oynatılabilecek animasyon yok.</p>
          <p className="text-xs mt-2 text-white/20">Animasyonlar yalnızca "Canlı İzle" ile simüle edilen maçlar için geçerlidir.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0d12] shadow-2xl overflow-hidden flex flex-col">

        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Başlık */}
        <div className="px-5 py-3 bg-black/50 border-b border-white/5 flex items-center gap-3">
          <span className="text-white/40 text-xs uppercase tracking-widest">Highlights Replay</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="font-medium text-white/70 text-sm">{homeTeamName}</span>
          <span className="font-display text-sm text-white/40">{homeScore} – {awayScore}</span>
          <span className="font-medium text-white/70 text-sm">{awayTeamName}</span>
          <span className="ml-auto text-white/20 text-xs">{idx + 1} / {keyEvents.length}</span>
        </div>

        {/* Canvas */}
        <div className="relative bg-[#111827] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="w-full block"
            style={{ maxHeight: 340 }}
          />

          {/* Olay bilgi kartı — canvas üzerinde */}
          {currentEvent && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl border text-center min-w-[220px] pointer-events-none"
              style={{
                background: `${EVENT_COLOR[currentEvent.olay]}18`,
                borderColor: `${EVENT_COLOR[currentEvent.olay]}40`,
                backdropFilter: "blur(4px)",
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                <span
                  className="font-display text-base font-bold tracking-wider"
                  style={{ color: EVENT_COLOR[currentEvent.olay] }}
                >
                  {EVENT_LABEL[currentEvent.olay]}
                </span>
                <span className="text-white/30 text-xs font-display">{currentEvent.dakika}'</span>
                {currentEvent.oyuncu && (
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-semibold ml-1"
                    style={{
                      background: `${EVENT_COLOR[currentEvent.olay]}25`,
                      color: EVENT_COLOR[currentEvent.olay],
                      border: `1px solid ${EVENT_COLOR[currentEvent.olay]}40`,
                    }}
                  >
                    {currentEvent.oyuncu.split(" ").slice(-1)[0]}
                  </span>
                )}
              </div>
              <p className="text-white/65 text-[11px] leading-snug max-w-[280px]">
                {currentEvent.anlatim}
              </p>
            </div>
          )}
        </div>

        {/* İlerleme çubuğu */}
        <div className="h-0.5 bg-white/5 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-none"
            style={{
              width: `${animProgress * 100}%`,
              background: currentEvent ? EVENT_COLOR[currentEvent.olay] : "#22c55e",
            }}
          />
        </div>

        {/* Kontroller */}
        <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex items-center gap-3">
          {/* Nokta navigasyon */}
          <div className="flex items-center gap-1.5 flex-1 flex-wrap">
            {keyEvents.map((ev, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="w-5 h-5 rounded-full border transition-all flex items-center justify-center text-[9px]"
                style={{
                  background: i === idx ? EVENT_COLOR[ev.olay] : "rgba(255,255,255,0.05)",
                  borderColor: i === idx ? EVENT_COLOR[ev.olay] : "rgba(255,255,255,0.1)",
                  transform: i === idx ? "scale(1.2)" : "scale(1)",
                }}
                title={`${ev.dakika}' – ${EVENT_LABEL[ev.olay]}`}
              >
                {ev.olay === "GOL" ? "⚽" : ev.olay === "KART" ? "🟨" : ev.olay === "KOSE_VURUSU" ? "🚩" : "🎯"}
              </button>
            ))}
          </div>

          {/* Prev / Play-Pause / Next */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => goTo(idx - 1)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAutoPlay(v => !v)}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all"
              style={{
                background: autoPlay ? `${eventColor}20` : "rgba(255,255,255,0.05)",
                borderColor: autoPlay ? `${eventColor}60` : "rgba(255,255,255,0.1)",
                color: autoPlay ? eventColor : "rgba(255,255,255,0.4)",
              }}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => goTo(idx + 1)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
