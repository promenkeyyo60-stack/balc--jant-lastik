import React from "react";
import { useGameStore } from "../hooks/use-game-store";
import type { MatchEvent } from "../hooks/use-game-store";
import { Button } from "../components/ui/button";
import { Trophy, RefreshCcw, TrendingUp, Home, Star, Brain, Tv2, X, Play, Clock, Users } from "lucide-react";
import confetti from "canvas-confetti";
import { TEAMS, FORMATIONS } from "../lib/teams-data";
import { TacticalAnalysis } from "../components/game/TacticalAnalysis";
import { MatchSimulator } from "../components/game/MatchSimulator";
import { MatchSummaryPanel } from "../components/game/MatchSummaryPanel";
import { TeamSquadModal } from "../components/game/TeamSquadModal";

// ── Hızlı skor hesaplama (modal açmadan) ──────────────────────────────────
function wGoal() {
  const r = Math.random() * 100;
  if (r < 15) return 0; if (r < 55) return 1; if (r < 85) return 2; if (r < 95) return 3; return 4;
}
function bGoal() {
  const r = Math.random() * 100;
  if (r < 10) return 0; if (r < 50) return 1; if (r < 85) return 2; return 3;
}
function calcQuickScore(): { h: number; a: number } {
  const r = Math.random() * 100;
  if (r < 45) { const h = Math.max(1, wGoal()); return { h, a: Math.floor(Math.random() * h) }; }
  if (r < 70) { const g = bGoal(); return { h: g, a: g }; }
  const a = Math.max(1, wGoal()); return { h: Math.floor(Math.random() * a), a };
}
function randMin(lo = 1, hi = 90) { return Math.floor(Math.random() * (hi - lo + 1)) + lo; }

interface InlineExtraEvent {
  min: number;
  team: "ev" | "dep";
  olay: "SUT" | "KART" | "KOSE_VURUSU";
}

interface InlineMatchState {
  minute: number;
  homeScore: number;
  awayScore: number;
  finalHome: number;
  finalAway: number;
  goalEvents: Array<{ min: number; team: "ev" | "dep" }>;
  extraEvents: InlineExtraEvent[];
  done: boolean;
}

function WinnerScreen({ winner, onNewGame, onClose }: {
  winner: { id: string; name: string; pts: number; w: number; d: number; l: number; gf: number; ga: number; played: number };
  onNewGame: () => void;
  onClose: () => void;
}) {
  const { playerColors } = useGameStore();
  const color = playerColors[winner.id] ?? "#22c55e";
  const gd = winner.gf - winner.ga;

  React.useEffect(() => {
    const duration = 5000;
    const end = Date.now() + duration;
    const colors = [color, "#ffffff", "#ffd700"];
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        className="relative max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: `linear-gradient(135deg, ${color}18 0%, #0a0a0f 60%, ${color}10 100%)` }}
      >
        {/* Üst şerit */}
        <div className="h-2 w-full" style={{ background: color }} />

        {/* Kapat butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/40 hover:text-white transition-all"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center gap-6 text-center">

          {/* Kupa animasyonu */}
          <div className="relative">
            <div className="text-9xl animate-bounce" style={{ filter: "drop-shadow(0 0 30px gold)" }}>🏆</div>
            <div className="absolute -top-2 -right-2 text-4xl animate-spin" style={{ animationDuration: "3s" }}>⭐</div>
            <div className="absolute -top-2 -left-2 text-3xl animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }}>⭐</div>
          </div>

          {/* Şampiyon başlığı */}
          <div>
            <p className="text-white/50 uppercase tracking-[0.3em] text-sm font-medium mb-1">🎉 Şampiyon 🎉</p>
            {/* Sadece yöneticinin kendi belirlediği isim */}
            <h1
              className="text-5xl font-display uppercase tracking-wider"
              style={{ color, textShadow: `0 0 40px ${color}88` }}
            >
              {winner.name}
            </h1>
          </div>

          {/* Renk rozeti */}
          <div
            className="flex items-center gap-2 px-5 py-2 rounded-full border"
            style={{ borderColor: `${color}50`, background: `${color}18` }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-white/60 text-sm uppercase tracking-widest">Şampiyon Yönetici</span>
          </div>

          {/* Sezon istatistikleri */}
          <div className="grid grid-cols-4 gap-3 w-full">
            {[
              { label: "Puan", value: winner.pts, icon: "🏅", highlight: true },
              { label: "Galibiyet", value: winner.w, icon: "✅" },
              { label: "Beraberlik", value: winner.d, icon: "🤝" },
              { label: "Av. Fark", value: gd > 0 ? `+${gd}` : gd, icon: "⚽" },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-white/10 bg-black/30">
                <span className="text-xl">{stat.icon}</span>
                <span
                  className="font-display text-2xl"
                  style={stat.highlight ? { color } : { color: "white" }}
                >
                  {stat.value}
                </span>
                <span className="text-white/40 text-xs">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Butonlar */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={onNewGame}
              className="flex-1 h-14 text-base font-display tracking-widest uppercase border-2 text-black"
              style={{ background: color, borderColor: color }}
            >
              <Home className="mr-2 w-5 h-5" /> Ana Menü
            </Button>
            <Button
              onClick={onNewGame}
              variant="outline"
              className="flex-1 h-14 text-base font-display tracking-widest uppercase border-white/20 text-white"
            >
              <RefreshCcw className="mr-2 w-5 h-5" /> Yeni Draft
            </Button>
          </div>
        </div>

        <div className="h-1 w-full" style={{ background: color }} />
      </div>
    </div>
  );
}

interface SimulatorTarget {
  matchId: string;
  homeId: string;
  awayId: string;
}

export function LeaguePhase() {
  const { players, matches, standings, matchEvents, saveMatchEvents, recordMatchResult, resetGame, playerColors } = useGameStore();
  const [showWinner, setShowWinner] = React.useState(false);
  const [showTeamSquad, setShowTeamSquad] = React.useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = React.useState<string>("");
  const [simTarget, setSimTarget] = React.useState<SimulatorTarget | null>(null);
  const [openSummaryIds, setOpenSummaryIds] = React.useState<Set<string>>(new Set());
  const [inlineMatches, setInlineMatches] = React.useState<Record<string, InlineMatchState>>({});
  const processedDone = React.useRef<Set<string>>(new Set());

  // ── Inline maç başlat ─────────────────────────────────────────────────
  const startInlineMatch = React.useCallback((matchId: string) => {
    const { h, a } = calcQuickScore();
    const goalEvents: Array<{ min: number; team: "ev" | "dep" }> = [];
    for (let i = 0; i < h; i++) goalEvents.push({ min: randMin(), team: "ev" });
    for (let i = 0; i < a; i++) goalEvents.push({ min: randMin(), team: "dep" });
    goalEvents.sort((x, y) => x.min - y.min);

    // Ek eventler: şut, köşe vuruşu, sarı kart
    const extraEvents: InlineExtraEvent[] = [];
    const rnd = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
    for (const team of ["ev", "dep"] as const) {
      const shots   = rnd(3, 9);
      const corners = rnd(2, 7);
      const cards   = rnd(0, 2);
      for (let i = 0; i < shots;   i++) extraEvents.push({ min: randMin(),       team, olay: "SUT" });
      for (let i = 0; i < corners; i++) extraEvents.push({ min: randMin(),       team, olay: "KOSE_VURUSU" });
      for (let i = 0; i < cards;   i++) extraEvents.push({ min: randMin(10, 85), team, olay: "KART" });
    }

    setInlineMatches(prev => ({
      ...prev,
      [matchId]: { minute: 0, homeScore: 0, awayScore: 0, finalHome: h, finalAway: a, goalEvents, extraEvents, done: false },
    }));
    processedDone.current.delete(matchId);
  }, []);

  // ── Sayaç: her 500ms'de 2 dakika ilerle ──────────────────────────────
  const activeKeys = Object.entries(inlineMatches).filter(([, s]) => !s.done).map(([id]) => id).join(",");
  React.useEffect(() => {
    if (!activeKeys) return;
    const id = setInterval(() => {
      setInlineMatches(prev => {
        const next = { ...prev };
        for (const [mid, state] of Object.entries(next)) {
          if (state.done) continue;
          const newMin = Math.min(state.minute + 2, 90);
          let hs = state.homeScore, as_ = state.awayScore;
          for (const g of state.goalEvents) {
            if (g.min > state.minute && g.min <= newMin) {
              if (g.team === "ev") hs++; else as_++;
            }
          }
          next[mid] = { ...state, minute: newMin, homeScore: hs, awayScore: as_, done: newMin >= 90 };
        }
        return next;
      });
    }, 500);
    return () => clearInterval(id);
  }, [activeKeys]);

  // ── Biten inline maçları kaydet ───────────────────────────────────────
  React.useEffect(() => {
    for (const [mid, state] of Object.entries(inlineMatches)) {
      if (!state.done || processedDone.current.has(mid)) continue;
      processedDone.current.add(mid);
      recordMatchResult(mid, state.finalHome, state.finalAway);

      const match = matches.find(m => m.id === mid);

      // Pozisyona göre rastgele oyuncu seç
      const getPlayer = (teamId: string, positions: string[]): string | undefined => {
        const p = players.find(pl => pl.id === teamId);
        if (!p) return undefined;
        const pool = p.team.filter(s => s.player && positions.includes(s.player.position));
        if (pool.length === 0) {
          const any = p.team.filter(s => s.player);
          if (any.length === 0) return undefined;
          return any[Math.floor(Math.random() * any.length)].player?.name;
        }
        return pool[Math.floor(Math.random() * pool.length)].player?.name;
      };

      const toTakim = (t: "ev" | "dep"): "ev" | "deplasman" => t === "ev" ? "ev" : "deplasman";

      // Gol eventleri
      const goalEvs: MatchEvent[] = state.goalEvents.map(g => {
        const scorer = match ? getPlayer(g.team === "ev" ? match.homeId : match.awayId, ["FWD", "MID"]) : undefined;
        return {
          dakika: g.min,
          olay: "GOL" as const,
          takim: toTakim(g.team),
          oyuncu: scorer,
          anlatim: scorer ? `${scorer.split(" ").slice(-1)[0]} golü patlattı! Müthiş bir an!` : "Goool! Müthiş bir an!",
          koordinatlar: {
            x: g.team === "ev" ? 62 + Math.random() * 28 : 10 + Math.random() * 28,
            y: 25 + Math.random() * 50,
          },
        };
      });

      // Ek eventler (şut, köşe, sarı kart)
      const extraEvs: MatchEvent[] = state.extraEvents.map(e => {
        const teamId = match ? (e.team === "ev" ? match.homeId : match.awayId) : "";
        const posByType: Record<string, string[]> = {
          SUT: ["FWD", "MID"],
          KART: ["DEF", "MID"],
          KOSE_VURUSU: ["MID", "DEF"],
        };
        const pl = match ? getPlayer(teamId, posByType[e.olay] ?? []) : undefined;
        const plSoy = pl ? pl.split(" ").slice(-1)[0] : undefined;
        const anlatimMap: Record<string, string> = {
          SUT: plSoy ? `${plSoy} güçlü bir şut çekti!` : "Şut! Kaleci kurtardı!",
          KART: plSoy ? `${plSoy}'a sarı kart gösterildi.` : "Sarı kart!",
          KOSE_VURUSU: plSoy ? `${plSoy} köşe vuruşunu kullandı.` : "Köşe vuruşu.",
        };
        return {
          dakika: e.min,
          olay: e.olay,
          takim: toTakim(e.team),
          oyuncu: pl,
          anlatim: anlatimMap[e.olay] ?? "",
          koordinatlar: {
            x: e.olay === "KOSE_VURUSU"
              ? (e.team === "ev" ? 90 + Math.random() * 5 : Math.random() * 5)
              : e.team === "ev"
              ? 55 + Math.random() * 35
              : 10 + Math.random() * 35,
            y: e.olay === "KOSE_VURUSU"
              ? (Math.random() > 0.5 ? 2 : 98)
              : 20 + Math.random() * 60,
          },
        };
      });

      const allEvs = [...goalEvs, ...extraEvs].sort((a, b) => a.dakika - b.dakika);

      if (allEvs.length > 0) {
        saveMatchEvents(mid, allEvs);
      }
    }
  }, [inlineMatches, recordMatchResult, saveMatchEvents, matches, players]);

  const isComplete = matches.length > 0 && matches.every(m => m.played);

  React.useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => setShowWinner(true), 800);
    return () => clearTimeout(t);
  }, [isComplete]);

  const sortedStandings = Object.entries(standings)
    .map(([id, stats]) => {
      const p = players.find(p => p.id === id);
      return { id, name: p?.name || "Bilinmeyen", ...stats, gd: stats.gf - stats.ga };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

  const winner = sortedStandings[0];

  // Yöneticiden TeamInfo yarat
  const buildTeamInfo = React.useCallback((playerId: string) => {
    const p = players.find(pp => pp.id === playerId);
    if (!p) return null;
    const form = FORMATIONS.find(f => f.id === p.formationId);
    const totalRows = form ? form.layout.length : 4;
    const slotRowToPos = (rowIdx: number): string => {
      if (rowIdx === 0) return "GK";
      if (rowIdx === 1) return "DEF";
      if (rowIdx === totalRows - 1) return "FWD";
      return "MID";
    };
    return {
      isim: p.name,
      formasyon: form?.name ?? p.formationId,
      oyuncular: p.team.filter(s => s.player).map(s => {
        const rowIdx = parseInt(s.slotId.split("-")[0].replace("r", ""), 10);
        return {
          isim: s.player!.name,
          pozisyon: s.player!.position,
          slotPozisyon: slotRowToPos(rowIdx),
        };
      }),
    };
  }, [players]);

  const handleMatchComplete = React.useCallback((matchId: string, hs: number, as_: number) => {
    recordMatchResult(matchId, hs, as_);
    // Simülatörü kapat — biraz bekle ki skor güncellendi görsün
    setTimeout(() => setSimTarget(null), 2500);
  }, [recordMatchResult]);

  return (
    <>
      {/* Maç Simülatörü Modal */}
      {simTarget && (() => {
        const homeInfo = buildTeamInfo(simTarget.homeId);
        const awayInfo = buildTeamInfo(simTarget.awayId);
        if (!homeInfo || !awayInfo) return null;
        return (
          <MatchSimulator
            matchId={simTarget.matchId}
            homeTeam={homeInfo}
            awayTeam={awayInfo}
            onClose={() => setSimTarget(null)}
            onMatchComplete={handleMatchComplete}
          />
        );
      })()}

      {showWinner && winner && (
        <WinnerScreen
          winner={winner}
          onClose={() => setShowWinner(false)}
          onNewGame={() => { setShowWinner(false); resetGame(); }}
        />
      )}

      {showTeamSquad && (
        <TeamSquadModal
          players={players}
          playerColors={playerColors}
          onClose={() => setShowTeamSquad(false)}
        />
      )}

      <div className="min-h-screen py-12 px-4 relative z-10 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">

          <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-display text-white uppercase tracking-wider m-0">Süper Lig</h1>
                <p className="text-white/60">1. Sezon Sonuçları</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetGame} variant="outline" className="border-white/20 text-white/70 hover:text-white">
                <Home className="mr-2 w-4 h-4" /> Ana Menü
              </Button>
              {isComplete && (
                <Button onClick={() => setShowWinner(true)} className="bg-yellow-400 text-black hover:bg-yellow-300">
                  <Trophy className="mr-2 w-5 h-5" /> ŞAMPIYON
                </Button>
              )}
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 flex-1">
            {/* Puan Durumu */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="glass-panel rounded-2xl overflow-hidden flex-1 border-white/5">
                <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-display text-xl text-white uppercase m-0 tracking-widest flex-1">Puan Durumu</h3>
                  <button
                    onClick={() => setShowTeamSquad(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all border"
                    style={{
                      background: "rgba(34,197,94,0.08)",
                      borderColor: "rgba(34,197,94,0.25)",
                      color: "#22c55e",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.18)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,197,94,0.5)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,197,94,0.25)";
                    }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Takımları Göster
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                        <th className="p-4 font-medium">Sıra</th>
                        <th className="p-4 font-medium">Takım</th>
                        <th className="p-4 font-medium text-center">O</th>
                        <th className="p-4 font-medium text-center">G</th>
                        <th className="p-4 font-medium text-center">B</th>
                        <th className="p-4 font-medium text-center">M</th>
                        <th className="p-4 font-medium text-center">AG</th>
                        <th className="p-4 font-bold text-primary text-center text-sm">P</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStandings.map((team, idx) => {
                        return (
                          <tr
                            key={team.id}
                            className={`border-b border-white/5 transition-colors hover:bg-white/5 ${idx === 0 ? 'bg-primary/5' : ''}`}
                          >
                            <td className="p-4">
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full font-display text-lg ${
                                idx === 0 ? 'bg-yellow-400 text-black' :
                                idx === 1 ? 'bg-gray-300 text-black' :
                                idx === 2 ? 'bg-amber-600 text-white' :
                                'bg-black/40 text-white/60'
                              }`}>
                                {idx === 0 ? '🏆' : idx + 1}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ background: playerColors[team.id] ?? "#22c55e" }}
                                />
                                <span className="font-semibold" style={{ color: playerColors[team.id] ?? "white" }}>
                                  {team.name}
                                </span>
                              </span>
                            </td>
                            <td className="p-4 text-center text-white/60">{team.played}</td>
                            <td className="p-4 text-center text-white/60">{team.w}</td>
                            <td className="p-4 text-center text-white/60">{team.d}</td>
                            <td className="p-4 text-center text-white/60">{team.l}</td>
                            <td className="p-4 text-center text-white/60">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                            <td className="p-4 text-center font-display text-2xl text-primary">{team.pts}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Maç Sonuçları */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="glass-panel rounded-2xl overflow-hidden flex-1 border-white/5 flex flex-col h-full max-h-[600px]">
                <div className="bg-black/40 p-4 border-b border-white/5">
                  <h3 className="font-display text-xl text-white uppercase m-0 tracking-widest">Maç Sonuçları</h3>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto flex-1">
                  {matches.map((m, idx) => {
                    const home = players.find(p => p.id === m.homeId);
                    const away = players.find(p => p.id === m.awayId);
                    if (!home || !away) return null;

                    const hasEvents = m.played && !!matchEvents[m.id]?.length;
                    const isOpen = openSummaryIds.has(m.id);
                    const matchNum = idx + 1;
                    const toggleSummary = () => setOpenSummaryIds(prev => {
                      const next = new Set(prev);
                      if (next.has(m.id)) next.delete(m.id); else next.add(m.id);
                      return next;
                    });
                    return (
                      <div key={m.id} className="space-y-1">
                        {/* Maç skoru satırı */}
                        <div className={`rounded-xl border flex items-center ${m.played ? 'bg-black/40 border-white/10' : 'bg-black/20 border-white/5'}`}>
                          <div className="text-right flex-1 font-medium text-white/80 truncate px-2 py-3">{home.name}</div>
                          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 min-w-[70px] justify-center my-1.5">
                            {m.played ? (
                              <>
                                <span className={`font-display text-xl ${m.homeScore! > m.awayScore! ? 'text-primary' : 'text-white'}`}>{m.homeScore}</span>
                                <span className="text-white/30">-</span>
                                <span className={`font-display text-xl ${m.awayScore! > m.homeScore! ? 'text-primary' : 'text-white'}`}>{m.awayScore}</span>
                              </>
                            ) : (
                              <span className="text-xs text-white/30 tracking-widest">VS</span>
                            )}
                          </div>
                          <div className="text-left flex-1 font-medium text-white/80 truncate px-2 py-3">{away.name}</div>
                          {/* Özet toggle butonu */}
                          {hasEvents && (
                            <button
                              onClick={toggleSummary}
                              className="shrink-0 mr-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all"
                              style={isOpen ? {
                                background: "rgba(234,179,8,0.15)",
                                borderColor: "rgba(234,179,8,0.4)",
                                color: "#eab308",
                              } : {
                                background: "rgba(255,255,255,0.04)",
                                borderColor: "rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.35)",
                              }}
                            >
                              <Star className="w-2.5 h-2.5" />
                              {isOpen ? "Gizle" : "Özet"}
                            </button>
                          )}
                        </div>

                        {/* Oynama butonları / Inline scoreboard */}
                        {(() => {
                          const inl = inlineMatches[m.id];
                          if (m.played) return null;

                          // Maç şu an inline çalışıyor → scoreboard göster
                          if (inl) {
                            const pct = Math.round((inl.minute / 90) * 100);
                            return (
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 space-y-1.5">
                                {/* Skor + dakika */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-display text-2xl tabular-nums leading-none ${inl.homeScore > inl.awayScore ? "text-emerald-400" : "text-white"}`}>
                                      {inl.homeScore}
                                    </span>
                                    <span className="text-white/30 text-sm">–</span>
                                    <span className={`font-display text-2xl tabular-nums leading-none ${inl.awayScore > inl.homeScore ? "text-emerald-400" : "text-white"}`}>
                                      {inl.awayScore}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                                    <Clock className="w-3 h-3 animate-pulse" />
                                    <span className="tabular-nums">{inl.minute}'</span>
                                  </div>
                                </div>
                                {/* İlerleme çubuğu */}
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          }

                          // Normal butonlar
                          return (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setSimTarget({ matchId: m.id, homeId: m.homeId, awayId: m.awayId })}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs hover:bg-purple-600/20 transition-colors"
                              >
                                <Tv2 className="w-3 h-3" /> Canlı İzle
                              </button>
                              <button
                                onClick={() => startInlineMatch(m.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-600/20 transition-colors"
                              >
                                <Play className="w-3 h-3" /> Maçı Başlat
                              </button>
                            </div>
                          );
                        })()}

                        {/* Inline özet paneli */}
                        {isOpen && hasEvents && (
                          <MatchSummaryPanel
                            events={matchEvents[m.id]}
                            homeTeamName={home.name}
                            awayTeamName={away.name}
                            homeScore={m.homeScore!}
                            awayScore={m.awayScore!}
                            homeColor={playerColors[home.id] ?? "#22c55e"}
                            awayColor={playerColors[away.id] ?? "#3b82f6"}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Teknik Direktör Analiz Paneli ─────────────────────────────── */}
          <div className="mt-8">
            {/* Yönetici seçici */}
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-white/60 text-sm uppercase tracking-wider">Analiz edilecek kadro:</span>
              <div className="flex flex-wrap gap-2">
                {players.map(p => {
                  const pColor = playerColors[p.id] ?? "#22c55e";
                  const isSelected = selectedAnalysisId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedAnalysisId(p.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all"
                      style={isSelected ? {
                        background: `${pColor}22`,
                        borderColor: `${pColor}80`,
                        color: pColor,
                      } : {
                        background: "rgba(0,0,0,0.3)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pColor }} />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analiz kartı */}
            {(() => {
              const sel = players.find(p => p.id === selectedAnalysisId);
              if (!sel) return (
                <div className="glass-panel rounded-2xl p-6 text-center text-white/20 text-sm border border-white/5">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  Analiz için yukarıdan bir yönetici seçin
                </div>
              );
              const firstSlot = sel.team.find(s => s.player !== null)?.player;
              const club = TEAMS.find(t => t.id === firstSlot?.teamId);
              const formation = FORMATIONS.find(f => f.id === sel.formationId);
              const playerList = sel.team
                .filter(s => s.player !== null)
                .map(s => ({
                  name: s.player!.name,
                  position: s.player!.position,
                  ovr: s.player!.ovr,
                  subPos: s.player!.subPos,
                }));
              return (
                <TacticalAnalysis
                  key={sel.id}
                  managerName={sel.name}
                  teamName={club?.name ?? "Bilinmeyen Takım"}
                  formation={formation?.name ?? sel.formationId}
                  players={playerList}
                />
              );
            })()}
          </div>

        </div>
      </div>
    </>
  );
}
