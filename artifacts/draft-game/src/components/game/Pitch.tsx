import React from "react";
import { useGameStore, UserPlayer } from "../../hooks/use-game-store";
import { FORMATIONS, SUB_POS_ABBR, POS_ABBR } from "../../lib/teams-data";
import { cn } from "../../lib/utils";

interface PitchProps {
  player: UserPlayer;
  isActiveTurn: boolean;
}

const POS_CIRCLE: Record<string, string> = {
  GK:  "bg-yellow-900/70 border-yellow-400/70 text-yellow-300",
  DEF: "bg-blue-900/70   border-blue-400/70   text-blue-300",
  MID: "bg-green-900/70  border-green-400/70  text-green-300",
  FWD: "bg-red-900/70    border-red-400/70    text-red-300",
};

const POS_BADGE: Record<string, string> = {
  GK:  "bg-yellow-500/20 text-yellow-300",
  DEF: "bg-blue-500/20   text-blue-300",
  MID: "bg-green-500/20  text-green-300",
  FWD: "bg-red-500/20    text-red-300",
};

export function Pitch({ player, isActiveTurn }: PitchProps) {
  const { selectedPlayerToPlace, placePlayerOnPitch } = useGameStore();
  const formation = FORMATIONS.find(f => f.id === player.formationId);
  const layout = formation ? formation.layout : [1, 4, 4, 2];

  const handleSlotClick = (slotId: string) => {
    if (isActiveTurn && selectedPlayerToPlace) {
      placePlayerOnPitch(slotId);
    }
  };

  const rows = layout.map((_, rowIdx) => {
    const slotsInRow = player.team.filter(s => s.slotId.startsWith(`r${rowIdx}-`));
    return (
      <div key={rowIdx} className="flex justify-around items-center w-full my-3 relative z-10">
        {slotsInRow.map((slot) => {
          const isFilled    = !!slot.player;
          const isSelectable = isActiveTurn && !!selectedPlayerToPlace && !isFilled;
          const p           = slot.player;
          const posAbbr     = p
            ? (p.subPos ? (SUB_POS_ABBR[p.subPos] ?? p.subPos.slice(0, 3)) : (POS_ABBR[p.position] ?? p.position.slice(0, 2)))
            : null;
          const surname     = p ? p.name.split(" ").slice(-1)[0] : "";
          const subPosLabel = p ? (p.subPos ?? null) : null;
          const posCat      = p?.position ?? "DEF";

          return (
            <div
              key={slot.slotId}
              onClick={() => handleSlotClick(slot.slotId)}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all duration-300",
                isSelectable ? "cursor-pointer scale-110" : "cursor-default"
              )}
            >
              {/* Ana daire */}
              <div className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 shadow-lg mb-0.5",
                isFilled
                  ? POS_CIRCLE[posCat] ?? "bg-secondary/70 border-white/30 text-white"
                  : isSelectable
                    ? "bg-primary/20 border-primary animate-pulse text-primary"
                    : "bg-black/20 border-white/10 text-white/30"
              )}>
                {isFilled ? (
                  <span className="font-display text-xs sm:text-sm font-bold uppercase leading-none tracking-tight">
                    {posAbbr}
                  </span>
                ) : isSelectable ? (
                  <span className="text-xl font-bold">+</span>
                ) : null}
              </div>

              {/* Oyuncu soyadı */}
              <div className={cn(
                "text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-center w-20 sm:w-24 truncate leading-tight",
                isFilled ? "text-white/90" : "text-transparent"
              )}>
                {isFilled ? surname : "-"}
              </div>

              {/* Mevki etiketi (subPos tam adı) */}
              {isFilled && subPosLabel && (
                <div className={cn(
                  "mt-0.5 text-[8px] sm:text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-wider leading-none",
                  POS_BADGE[posCat] ?? "bg-white/10 text-white/50"
                )}>
                  {subPosLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="w-full max-w-[400px] sm:max-w-[500px] aspect-[2/3] mx-auto rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-500">
      <div className={cn(
        "absolute inset-0 pitch-pattern transition-opacity duration-500",
        isActiveTurn ? "opacity-100" : "opacity-50 grayscale-[50%]"
      )} />

      {/* Saha çizgileri */}
      <div className="absolute inset-4 border-2 border-white/40 rounded-sm pointer-events-none" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/3 h-[15%] border-2 border-white/40 border-t-0 pointer-events-none" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-[15%] border-2 border-white/40 border-b-0 pointer-events-none" />

      {/* Aktif olmayan tur karartması */}
      {!isActiveTurn && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-20 flex items-center justify-center">
          <span className="bg-black/80 px-4 py-2 rounded-lg font-display text-xl text-white/80 border border-white/10 uppercase tracking-widest rotate-[-5deg]">
            Bekleniyor
          </span>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-between py-5 px-4 z-10">
        {rows}
      </div>
    </div>
  );
}
