import React from "react";
import { X, Users } from "lucide-react";
import type { UserPlayer } from "../../hooks/use-game-store";
import { FORMATIONS, SUB_POS_ABBR, POS_ABBR } from "../../lib/teams-data";

interface MiniPitchProps {
  player: UserPlayer;
  color: string;
}

function MiniPitch({ player, color }: MiniPitchProps) {
  const formation = FORMATIONS.find(f => f.id === player.formationId);
  const layout = formation ? formation.layout : [1, 4, 4, 2];

  const rows = layout.map((_, rowIdx) => {
    const slotsInRow = player.team.filter(s => s.slotId.startsWith(`r${rowIdx}-`));
    return (
      <div key={rowIdx} className="flex justify-around items-center w-full">
        {slotsInRow.map(slot => {
          const p = slot.player;
          const surname = p ? p.name.split(" ").slice(-1)[0] : "";
          const posShort = p
            ? (p.subPos ? (SUB_POS_ABBR[p.subPos] ?? p.subPos.substring(0, 2)) : (POS_ABBR[p.position] ?? p.position[0]))
            : "";
          return (
            <div key={slot.slotId} className="flex flex-col items-center gap-0.5">
              {/* Oyuncu balonu */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center border shadow-md text-[9px] font-bold text-white uppercase shrink-0"
                style={{
                  background: p ? color : "rgba(0,0,0,0.25)",
                  borderColor: p ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.1)",
                  opacity: p ? 1 : 0.3,
                }}
              >
                {p ? posShort : ""}
              </div>
              {/* İsim etiketi */}
              <div
                className="text-[8px] font-medium text-center leading-tight truncate max-w-[36px]"
                style={{
                  color: p ? "rgba(255,255,255,0.92)" : "transparent",
                  textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                }}
              >
                {surname}
              </div>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden relative shadow-lg">
      {/* Yeşil saha arka planı */}
      <div className="absolute inset-0 pitch-pattern" />

      {/* Saha çizgileri */}
      <div className="absolute inset-[6%] border border-white/30 rounded-sm pointer-events-none" />
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-1/3 h-[14%] border border-white/30 border-t-0 pointer-events-none" />
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-1/3 h-[14%] border border-white/30 border-b-0 pointer-events-none" />
      <div className="absolute top-1/2 left-[6%] right-[6%] h-px bg-white/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-square rounded-full border border-white/20 pointer-events-none" />

      {/* Oyuncu satırları */}
      <div className="absolute inset-0 flex flex-col justify-around py-2 px-1 z-10">
        {rows}
      </div>
    </div>
  );
}

interface TeamSquadModalProps {
  players: UserPlayer[];
  playerColors: Record<string, string>;
  onClose: () => void;
}

export function TeamSquadModal({ players, playerColors, onClose }: TeamSquadModalProps) {
  const filledPlayers = players.filter(p => p.team.some(s => s.player));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md overflow-y-auto py-6 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-7xl">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white uppercase tracking-widest m-0">
                Takım Kadroları
              </h2>
              <p className="text-white/40 text-xs mt-0.5 uppercase tracking-widest">
                {filledPlayers.length} yönetici · İlk 11
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kadro grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filledPlayers.map(player => {
            const color = playerColors[player.id] ?? "#22c55e";
            const formation = FORMATIONS.find(f => f.id === player.formationId);
            const formationName = formation?.name ?? player.formationId;
            const filledCount = player.team.filter(s => s.player).length;

            return (
              <div
                key={player.id}
                className="rounded-2xl overflow-hidden border flex flex-col"
                style={{
                  borderColor: `${color}35`,
                  background: "rgba(8,12,18,0.85)",
                }}
              >
                {/* Renkli üst şerit */}
                <div className="h-1" style={{ background: color }} />

                {/* Kart başlığı */}
                <div className="px-3 pt-2.5 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: color }}
                    />
                    <span
                      className="font-display text-sm uppercase tracking-wide truncate"
                      style={{ color }}
                    >
                      {player.name}
                    </span>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ml-1"
                    style={{
                      background: `${color}18`,
                      color: `${color}cc`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {formationName.split(" ")[0]}
                  </span>
                </div>

                {/* Mini saha */}
                <div className="px-2 pb-3 flex-1">
                  <MiniPitch player={player} color={color} />
                </div>

                {/* Alt bilgi */}
                <div
                  className="px-3 py-1.5 flex items-center justify-between border-t"
                  style={{ borderColor: `${color}15` }}
                >
                  <span className="text-white/30 text-[9px] uppercase tracking-widest">
                    {formationName}
                  </span>
                  <span className="text-white/25 text-[9px] tabular-nums">
                    {filledCount}/11
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filledPlayers.length === 0 && (
          <div className="text-center py-20 text-white/25">
            <Users className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-display text-xl uppercase tracking-widest">
              Henüz takım oluşturulmadı
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
