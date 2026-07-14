import React from "react";
import { Shuffle } from "lucide-react";
import { useGameStore } from "../hooks/use-game-store";
import { WheelComponent } from "../components/game/WheelComponent";
import { Pitch } from "../components/game/Pitch";
import { PlayerSelectionModal } from "../components/game/PlayerSelectionModal";
import { Button } from "../components/ui/button";
import { TEAMS } from "../lib/teams-data";

export function DraftPhase() {
  const {
    players, currentPlayerIndex, startLeague,
    selectedPlayerToPlace, playerColors,
    wheelTeamIds, quickFillFromWheelTeams,
  } = useGameStore();

  const allComplete = players.every(p => p.isComplete);
  const currentPlayer = players[currentPlayerIndex];

  // Çarktaki aktif takımlar
  const activeWheelTeams = TEAMS.filter(t => wheelTeamIds.includes(t.id));

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 relative z-10">
      <PlayerSelectionModal />

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center glass-panel inline-block mx-auto px-8 py-4 rounded-full">
          {allComplete ? (
            <h2 className="text-3xl md:text-4xl font-display text-primary uppercase">Draft Tamamlandı!</h2>
          ) : (
            <h2 className="text-3xl md:text-4xl font-display text-white uppercase flex items-center gap-3">
              <span className="text-white/50">SIRA:</span>
              <span className="text-primary">{currentPlayer?.name}</span>
            </h2>
          )}
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sol: Çark veya Oyuncu Yerleştir */}
          <div className="lg:col-span-4 flex flex-col items-center gap-4">
            {allComplete ? (
              <div className="glass-panel p-8 rounded-3xl text-center space-y-6 w-full animate-in slide-in-from-bottom-8">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-4xl">
                  ⚽
                </div>
                <div>
                  <h3 className="text-2xl font-display text-white mb-2">Tüm Kadrolar Hazır!</h3>
                  <p className="text-white/60 text-sm">
                    Hangi yöneticinin rüya kadrosu kurduğunu görmek için lig simülasyonuna geç.
                  </p>
                </div>
                <Button size="lg" className="w-full" onClick={startLeague}>
                  LİGİ BAŞLAT
                </Button>
              </div>
            ) : (
              <>
                {/* Rastgele Takım Oluştur — çarktaki takımlardan */}
                {!selectedPlayerToPlace && (
                  <div className="w-full glass-panel rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest text-center mb-2">
                      Hızlı Başlat
                    </p>
                    <button
                      onClick={quickFillFromWheelTeams}
                      className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300"
                    >
                      <Shuffle className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                      Rastgele Takım Oluştur
                    </button>
                    <p className="text-[9px] text-white/20 text-center mt-2 leading-relaxed">
                      Çarktaki {activeWheelTeams.length} takımdan birinden<br />
                      sıradaki yöneticiye pozisyona uygun kadro kurulur
                    </p>
                  </div>
                )}

                <div className="w-full">
                  {selectedPlayerToPlace ? (
                    <div className="glass-panel p-6 rounded-2xl text-center border-primary animate-pulse">
                      <h3 className="text-primary font-display text-2xl uppercase tracking-wider mb-2">
                        Oyuncu Yerleştir
                      </h3>
                      <p className="text-white/80">
                        Sahada boş bir yere tıkla ve{" "}
                        <strong className="text-white">{selectedPlayerToPlace.name}</strong>
                        'i yerleştir
                      </p>
                    </div>
                  ) : (
                    <WheelComponent />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sağ: Sahalar */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-8">
              {players.map((player, idx) => {
                const isActive = idx === currentPlayerIndex && !allComplete;
                const pColor = playerColors[player.id] ?? "#22c55e";
                return (
                  <div key={player.id} className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <h3
                        className="font-display text-2xl uppercase tracking-widest"
                        style={{ color: isActive ? pColor : `${pColor}55` }}
                      >
                        {player.name}
                      </h3>
                      <span className="text-xs font-bold text-white/30 bg-black/40 px-2 py-1 rounded">
                        {player.formationId}
                      </span>
                    </div>
                    <Pitch player={player} isActiveTurn={isActive} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
