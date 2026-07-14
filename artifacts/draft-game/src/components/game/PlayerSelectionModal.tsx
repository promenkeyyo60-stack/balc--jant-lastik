import React, { useState, useEffect } from "react";
import { Shuffle } from "lucide-react";
import { useGameStore } from "../../hooks/use-game-store";
import { useSquadApi } from "../../hooks/use-squad-api";
import { TEAMS, FORMATIONS, SUB_POS_ABBR, POS_ABBR } from "../../lib/teams-data";
import type { RealPlayer } from "../../lib/teams-data";

const POSITION_COLORS: Record<string, string> = {
  GK: "bg-yellow-500/30 text-yellow-300 border-yellow-500/40",
  DEF: "bg-blue-500/30 text-blue-300 border-blue-500/40",
  MID: "bg-green-500/30 text-green-300 border-green-500/40",
  FWD: "bg-red-500/30 text-red-300 border-red-500/40",
};

const POS_FILTER_LABEL: Record<string, string> = {
  TÜMÜ: "Tümü",
  GK: "Kaleci",
  DEF: "Defans",
  MID: "Orta Saha",
  FWD: "Forvet",
};

const POS_FULL_TR: Record<string, string> = {
  GK: "Kaleci", DEF: "Defans", MID: "Orta Saha", FWD: "Forvet",
};

// ── Mini Saha: aktif oyuncunun kadrosunu gösterir ────────────────────────────

function MiniPitch() {
  const { players, currentPlayerIndex, playerColors } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  if (!currentPlayer) return null;

  const color = playerColors[currentPlayer.id] ?? "#22c55e";
  const formation = FORMATIONS.find(f => f.id === currentPlayer.formationId);
  const layout = formation?.layout ?? [1, 4, 4, 2];

  const filled = currentPlayer.team.filter(s => s.player !== null).length;
  const total = currentPlayer.team.length;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Oyuncu bilgisi */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shrink-0"
          style={{ background: color }}
        >
          {currentPlayer.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm uppercase tracking-wider leading-none truncate" style={{ color }}>
            {currentPlayer.name}
          </p>
          <p className="text-white/30 text-[10px] mt-0.5">{currentPlayer.formationId}</p>
        </div>
      </div>

      {/* İlerleme */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(filled / total) * 100}%`, background: color }}
          />
        </div>
        <span className="text-white/40 text-[10px] shrink-0">{filled}/{total}</span>
      </div>

      {/* Mini saha — satır satır slot gösterimi */}
      <div
        className="flex-1 rounded-xl overflow-hidden relative flex flex-col justify-between py-2 px-1"
        style={{ background: "linear-gradient(180deg,#1a5c2a 0%,#1a7535 100%)" }}
      >
        {/* Orta çizgi */}
        <div className="absolute top-1/2 left-2 right-2 h-px bg-white/15 pointer-events-none" />
        {/* Orta daire */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 pointer-events-none" />

        {layout.map((count, rowIdx) => {
          const slotsInRow = currentPlayer.team.filter(s => s.slotId.startsWith(`r${rowIdx}-`));
          return (
            <div key={rowIdx} className="flex justify-around items-center w-full">
              {slotsInRow.map(slot => {
                const isFilled = !!slot.player;
                return (
                  <div key={slot.slotId} className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all"
                      style={isFilled ? {
                        background: `${color}33`,
                        borderColor: color,
                        color: color,
                      } : {
                        background: "rgba(0,0,0,0.3)",
                        borderColor: "rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {isFilled
                        ? (slot.player!.subPos
                            ? (SUB_POS_ABBR[slot.player!.subPos] ?? slot.player!.subPos.slice(0, 3))
                            : (POS_ABBR[slot.player!.position] ?? slot.player!.position.slice(0, 2)))
                        : "—"}
                    </div>
                    {isFilled && (
                      <span className="text-[7px] text-white/30 leading-none truncate max-w-[32px] text-center">
                        {slot.player!.name.split(" ").pop()?.substring(0, 6)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Boş slot sayısı */}
      <div className="space-y-1">
        {(() => {
          const emptySlots = currentPlayer.team.filter(s => !s.player);
          if (emptySlots.length === 0) return (
            <p className="text-center text-[10px] text-green-400 font-medium">✓ Kadro tamamlandı!</p>
          );
          return (
            <p className="text-[10px] text-white/30 text-center">
              {emptySlots.length} boş slot kaldı
            </p>
          );
        })()}
      </div>
    </div>
  );
}

// ── Ana Modal ────────────────────────────────────────────────────────────────

export function PlayerSelectionModal() {
  const { spunTeamId, globalDraftedIds, selectPlayerFromTeam, autoFillCurrentPlayer } = useGameStore();
  const { players: apiPlayers, loading, error, loadSquad, reset } = useSquadApi();
  const [filter, setFilter] = useState<string>("TÜMÜ");

  const team = spunTeamId ? TEAMS.find((t) => t.id === spunTeamId) : null;

  useEffect(() => {
    if (!team) { reset(); return; }
    setFilter("TÜMÜ");
    if (team.apiId) {
      loadSquad(team.apiId, team.id, team.players);
    }
  }, [team?.id]);

  if (!spunTeamId || !team) return null;

  const sourcePlayers: RealPlayer[] = apiPlayers && apiPlayers.length > 0
    ? apiPlayers
    : team.players;

  const availablePlayers = sourcePlayers.filter((p) => !globalDraftedIds.has(p.id));

  const positions = ["TÜMÜ", "GK", "DEF", "MID", "FWD"];

  const filtered =
    filter === "TÜMÜ"
      ? availablePlayers
      : availablePlayers.filter((p) => p.position === filter);

  const countFor = (pos: string) =>
    pos === "TÜMÜ"
      ? availablePlayers.length
      : availablePlayers.filter((p) => p.position === pos).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl flex gap-4 animate-in zoom-in-95 duration-200 items-stretch">

        {/* ── Sol: Aktif oyuncunun mini sahası ─────────────────────────────── */}
        <div className="hidden md:flex w-44 shrink-0">
          <div className="glass-panel rounded-2xl p-3 w-full flex flex-col gap-2 border border-white/10">
            <p className="text-white/30 text-[9px] uppercase tracking-widest text-center">Kadromuz</p>
            <MiniPitch />
          </div>
        </div>

        {/* ── Sağ: Oyuncu seçim paneli ─────────────────────────────────────── */}
        <div className="flex-1 glass-panel rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Başlık */}
          <div className="p-5 relative overflow-hidden" style={{ backgroundColor: team.color }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl text-white font-display uppercase tracking-wider mb-0.5 drop-shadow-md">
                  {team.flag} {team.name}
                </h2>
                <p className="text-white/80 font-medium text-xs">
                  {loading
                    ? "Güncel kadro yükleniyor..."
                    : `${availablePlayers.length} oyuncu mevcut · Birini seç`}
                </p>
                {error && (
                  <p className="text-yellow-300 text-xs mt-1">⚠ {error}</p>
                )}
                {/* Rastgele Diz butonu */}
                <button
                  onClick={autoFillCurrentPlayer}
                  className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/50 text-white text-xs font-bold uppercase tracking-wide transition-all group"
                  title="Bu takımdan pozisyona uygun oyuncuları otomatik diz"
                >
                  <Shuffle className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-300" />
                  Rastgele Diz
                </button>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border font-medium mt-0.5 shrink-0 ${
                apiPlayers && apiPlayers.length > 0
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-white/10 text-white/50 border-white/20"
              }`}>
                {apiPlayers && apiPlayers.length > 0 ? "🟢 Canlı" : "⚪ Statik"}
              </span>
            </div>
          </div>

          {/* Pozisyon Filtreleri */}
          <div className="flex gap-2 px-5 pt-3 pb-2 bg-card flex-wrap">
            {positions.map((pos) => {
              const count = countFor(pos);
              const label = POS_FILTER_LABEL[pos] ?? pos;
              return (
                <button
                  key={pos}
                  onClick={() => setFilter(pos)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    filter === pos
                      ? "bg-primary text-black border-primary"
                      : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {label}{" "}
                  {count > 0 && <span className="opacity-70">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Oyuncu Listesi */}
          <div className="p-5 bg-card max-h-[52vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-white/50 text-sm">API'den güncel kadro çekiliyor...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/50 text-base mb-3">
                  Bu pozisyonda uygun oyuncu kalmadı!
                </p>
                <button
                  onClick={() => setFilter("TÜMÜ")}
                  className="px-5 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm"
                >
                  Tümünü Göster
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.map((player) => {
                  const subPosLabel = player.subPos ?? POS_FULL_TR[player.position] ?? player.position;
                  const posAbbr     = player.subPos
                    ? (SUB_POS_ABBR[player.subPos] ?? player.subPos.slice(0, 3))
                    : (POS_ABBR[player.position] ?? player.position.slice(0, 2));
                  const colorCls    = POSITION_COLORS[player.position] ?? "bg-white/10 text-white/60 border-white/20";
                  const surname     = player.name.split(" ").slice(-1)[0];
                  const firstName   = player.name.split(" ").slice(0, -1).map((w: string) => w[0] + ".").join(" ");
                  return (
                    <button
                      key={player.id}
                      onClick={() => {
                        setFilter("TÜMÜ");
                        selectPlayerFromTeam(player);
                      }}
                      className="bg-black/30 border border-white/10 hover:border-primary hover:bg-primary/10 rounded-xl p-3 text-left transition-all group flex flex-col gap-1"
                    >
                      {/* Mevki satırı: kısaltma + tam mevki adı */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded border leading-none ${colorCls}`}>
                          {posAbbr}
                        </span>
                        <span className={`text-[10px] font-semibold leading-none ${
                          player.position === "GK"  ? "text-yellow-300/80" :
                          player.position === "DEF" ? "text-blue-300/80"   :
                          player.position === "MID" ? "text-green-300/80"  :
                                                      "text-red-300/80"
                        }`}>
                          {subPosLabel}
                        </span>
                      </div>
                      {/* Oyuncu adı */}
                      <div className="font-bold text-white group-hover:text-primary transition-colors text-sm leading-tight">
                        {firstName && <span className="text-white/50 font-normal text-xs mr-1">{firstName}</span>}
                        {surname}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
