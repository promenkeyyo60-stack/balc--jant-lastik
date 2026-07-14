import React, { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { TEAMS } from "../../lib/teams-data";
import { useGameStore } from "../../hooks/use-game-store";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

export function WheelComponent() {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [openLeagues, setOpenLeagues] = useState<Record<string, boolean>>({});
  const spinWheelComplete = useGameStore((s) => s.spinWheelComplete);
  const wheelTeamIds = useGameStore((s) => s.wheelTeamIds);
  const setWheelTeamIds = useGameStore((s) => s.setWheelTeamIds);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const playerColors = useGameStore((s) => s.playerColors);
  const currentPlayer = players[currentPlayerIndex];
  const currentRotation = useRef(0);

  const activeTeams = TEAMS.filter((t) => wheelTeamIds.includes(t.id));
  const numSegments = activeTeams.length || 1;
  const degreesPerSegment = 360 / numSegments;

  // Group all teams by league
  const leagueGroups = TEAMS.reduce<Record<string, typeof TEAMS>>((acc, team) => {
    if (!acc[team.league]) acc[team.league] = [];
    acc[team.league].push(team);
    return acc;
  }, {});

  const toggleTeam = (teamId: string) => {
    if (wheelTeamIds.includes(teamId)) {
      if (wheelTeamIds.length <= 2) return;
      setWheelTeamIds(wheelTeamIds.filter((id) => id !== teamId));
    } else {
      setWheelTeamIds([...wheelTeamIds, teamId]);
    }
  };

  const toggleLeague = (league: string, teams: typeof TEAMS) => {
    const leagueIds = teams.map((t) => t.id);
    const allActive = leagueIds.every((id) => wheelTeamIds.includes(id));
    if (allActive) {
      const remaining = wheelTeamIds.filter((id) => !leagueIds.includes(id));
      if (remaining.length < 2) return;
      setWheelTeamIds(remaining);
    } else {
      const merged = Array.from(new Set([...wheelTeamIds, ...leagueIds]));
      setWheelTeamIds(merged);
    }
  };

  const selectAll = () => setWheelTeamIds(TEAMS.map((t) => t.id));
  const deselectAll = () => {
    const first2 = TEAMS.slice(0, 2).map((t) => t.id);
    setWheelTeamIds(first2);
  };

  const toggleLeagueOpen = (league: string) =>
    setOpenLeagues((prev) => ({ ...prev, [league]: !prev[league] }));

  const handleSpin = async () => {
    if (isSpinning || activeTeams.length < 2) return;
    setIsSpinning(true);
    setShowTeamPicker(false);
    const extraSpins = Math.floor(Math.random() * 5) + 5;
    const randomStop = Math.floor(Math.random() * 360);
    const targetRotation = currentRotation.current + extraSpins * 360 + randomStop;
    await controls.start({
      rotate: targetRotation,
      transition: { duration: 3.5, ease: [0.2, 0.8, 0.2, 1] },
    });
    currentRotation.current = targetRotation;
    const normalizedRotation = ((targetRotation % 360) + 360) % 360;
    // Üst noktayı (12 o'clock) referans alan hesaplama
    // Gradient -degreesPerSegment/2 offset'ten başlıyor, bunu telafi et
    const pointerAngle = (360 - normalizedRotation + degreesPerSegment / 2 + 360) % 360;
    let winningIndex = Math.floor(pointerAngle / degreesPerSegment) % numSegments;
    if (winningIndex < 0) winningIndex = 0;
    if (winningIndex >= numSegments) winningIndex = numSegments - 1;
    const winningTeam = activeTeams[winningIndex];
    setTimeout(() => {
      setIsSpinning(false);
      spinWheelComplete(winningTeam.id);
    }, 500);
  };

  const gradientStops = activeTeams
    .map((team, i) => {
      const start = i * degreesPerSegment;
      const end = (i + 1) * degreesPerSegment;
      return `${team.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Team Picker Toggle */}
      <div className="w-full">
        <button
          onClick={() => setShowTeamPicker((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/20 bg-black/30 text-white/80 hover:bg-black/50 transition-all text-sm font-semibold tracking-wide"
        >
          <span>
            ⚙️ Çarkdaki Takımlar{" "}
            <span className="text-primary font-bold">({activeTeams.length}/{TEAMS.length})</span>
          </span>
          {showTeamPicker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showTeamPicker && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden"
          >
            {/* Header actions */}
            <div className="flex gap-2 p-3 border-b border-white/10 flex-wrap">
              <button onClick={selectAll} className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all font-semibold">
                ⭐ Tümünü Ekle
              </button>
              <button onClick={deselectAll} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-semibold">
                ✕ Temizle
              </button>
              <span className="ml-auto text-xs text-white/30 self-center">
                En az 2 takım seç
              </span>
            </div>

            {/* League groups - scrollable */}
            <div className="max-h-72 overflow-y-auto">
              {Object.entries(leagueGroups).map(([league, teams]) => {
                const isOpen = openLeagues[league];
                const leagueIds = teams.map((t) => t.id);
                const activeCount = leagueIds.filter((id) => wheelTeamIds.includes(id)).length;
                const allActive = activeCount === teams.length;

                return (
                  <div key={league} className="border-b border-white/5 last:border-0">
                    <div className="flex items-center px-3 py-2 hover:bg-white/5 transition-all">
                      {/* League toggle checkbox */}
                      <button
                        onClick={() => toggleLeague(league, teams)}
                        className={`w-4 h-4 rounded border flex-shrink-0 mr-2 flex items-center justify-center text-[10px] transition-all ${
                          allActive
                            ? "bg-primary border-primary text-black"
                            : activeCount > 0
                            ? "bg-primary/30 border-primary/50 text-primary"
                            : "bg-transparent border-white/30"
                        }`}
                      >
                        {allActive ? "✓" : activeCount > 0 ? "–" : ""}
                      </button>

                      {/* League name */}
                      <button
                        onClick={() => toggleLeagueOpen(league)}
                        className="flex-1 flex items-center justify-between text-left"
                      >
                        <span className="text-xs font-bold text-white/70 uppercase tracking-wide">
                          {league}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30">
                            {activeCount}/{teams.length}
                          </span>
                          {isOpen ? (
                            <ChevronDown size={12} className="text-white/40" />
                          ) : (
                            <ChevronRight size={12} className="text-white/40" />
                          )}
                        </div>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="grid grid-cols-2 gap-1 px-3 pb-2">
                        {teams.map((team) => {
                          const isActive = wheelTeamIds.includes(team.id);
                          return (
                            <button
                              key={team.id}
                              onClick={() => toggleTeam(team.id)}
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                isActive
                                  ? "border-primary/50 bg-primary/10 text-white"
                                  : "border-white/5 bg-black/20 text-white/30"
                              }`}
                            >
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/20"
                                style={{ backgroundColor: team.color }}
                              />
                              <span className="truncate">{team.name}</span>
                              {isActive && <span className="ml-auto text-primary text-[10px]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Sıradaki Oyuncu Kartı */}
      {currentPlayer && (
        <div
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border"
          style={{
            borderColor: `${playerColors[currentPlayer.id] ?? "#22c55e"}60`,
            background: `${playerColors[currentPlayer.id] ?? "#22c55e"}12`,
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-black font-display text-base font-bold shrink-0"
            style={{ background: playerColors[currentPlayer.id] ?? "#22c55e" }}
          >
            {currentPlayer.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-none mb-0.5">Sıradaki</p>
            <p
              className="font-display text-lg uppercase tracking-wide leading-tight truncate"
              style={{ color: playerColors[currentPlayer.id] ?? "#22c55e" }}
            >
              {currentPlayer.name}
            </p>
          </div>
          {!isSpinning && (
            <div className="ml-auto text-white/20 text-xs shrink-0">▼ Çevir</div>
          )}
        </div>
      )}

      {/* Wheel */}
      <div className="relative w-60 h-60 md:w-72 md:h-72 mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 drop-shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))">
            <path d="M12 22L2 2h20L12 22z" />
          </svg>
        </div>

        <motion.div
          className="w-full h-full rounded-full border-4 border-white/20 shadow-2xl relative overflow-hidden"
          style={{
            background:
              activeTeams.length > 0
                ? `conic-gradient(from -${degreesPerSegment / 2}deg, ${gradientStops})`
                : "#1a1a2e",
          }}
          animate={controls}
          initial={{ rotate: 0 }}
        >
          {activeTeams.map((team, i) => {
            const rotation = i * degreesPerSegment;
            const fontSize = numSegments > 16 ? "7px" : numSegments > 10 ? "9px" : "10px";
            return (
              <div
                key={team.id}
                className="absolute inset-0 flex items-start justify-center pt-4 pointer-events-none"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <span
                  className="max-w-[60px] text-center leading-tight font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
                  style={{ fontSize }}
                >
                  {team.name}
                </span>
              </div>
            );
          })}
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-700 shadow-inner flex items-center justify-center z-10">
          <div className="w-5 h-5 rounded-full bg-primary animate-pulse blur-[2px]" />
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || activeTeams.length < 2}
        className="px-8 py-3 bg-gradient-to-r from-primary to-green-500 rounded-full font-display text-xl text-black shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all disabled:opacity-50 disabled:grayscale active:scale-95 uppercase tracking-widest"
      >
        {isSpinning ? "Dönüyor..." : "ÇEVİR"}
      </button>
    </div>
  );
}
