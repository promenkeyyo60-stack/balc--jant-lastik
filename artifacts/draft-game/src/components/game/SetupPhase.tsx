import React, { useState } from "react";
import { useGameStore } from "../../hooks/use-game-store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SimpleSelect } from "../ui/select";
import { FORMATIONS } from "../../lib/teams-data";
import { Trophy, Play } from "lucide-react";

export function SetupPhase() {
  const setupGame = useGameStore((s) => s.setupGame);

  const [playerCount, setPlayerCount] = useState<number>(2);
  const [users, setUsers] = useState<{name: string, formationId: string}[]>([
    { name: "Yönetici 1", formationId: "4-4-2" },
    { name: "Yönetici 2", formationId: "4-3-3" },
  ]);

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    setUsers(prev => {
      const newUsers = [...prev];
      while (newUsers.length < count) {
        newUsers.push({ name: `Yönetici ${newUsers.length + 1}`, formationId: "4-4-2" });
      }
      return newUsers.slice(0, count);
    });
  };

  const handleUserChange = (index: number, field: 'name' | 'formationId', value: string) => {
    setUsers(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const formationOptions = FORMATIONS.map(f => ({
    label: "label" in f && f.label ? `${f.name}  ·  ${f.label}` : f.name,
    value: f.id,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 border border-primary/50 text-primary">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-glow mb-4">ÇARK DRAFT</h1>
          <p className="text-lg text-white/70 max-w-lg mx-auto">
            Rüya kadronuzu oluşturun. Çarkı çevirin, yıldızlarınızı seçin ve ligi fethedın.
          </p>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <label className="text-white/70 font-medium uppercase tracking-widest text-sm">Yönetici Sayısı</label>
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => handleCountChange(num)}
                  className={`px-6 py-2 rounded-lg font-display text-2xl transition-all ${
                    playerCount === num
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {users.map((user, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-display text-white m-0">Yönetici Profili</h3>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">İsim</label>
                  <Input
                    value={user.name}
                    onChange={(e) => handleUserChange(idx, 'name', e.target.value)}
                    placeholder={`Yönetici ${idx + 1}`}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="text-base leading-none">📌</span>
                    <span>Taktik Diziliş</span>
                  </label>
                  <SimpleSelect
                    value={user.formationId}
                    onChange={(e) => handleUserChange(idx, 'formationId', e.target.value)}
                    options={formationOptions}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            <Button
              size="lg"
              className="w-full md:w-auto md:min-w-[300px] flex items-center gap-2"
              onClick={() => setupGame(users)}
            >
              <Play className="w-4 h-4" />
              DRAFT'I BAŞLAT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
