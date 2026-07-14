import React from "react";
import { Brain, Star, TrendingUp, TrendingDown, Zap, User, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

// ── TypeScript Arayüzleri ──────────────────────────────────────────────────

interface AnalysisPlayer {
  name: string;
  position: string;
  ovr?: number;
  subPos?: string;
}

interface TacticalAnalysisData {
  managerName: string;
  teamName: string;
  overallRating: number;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  strengths: string[];
  weaknesses: string[];
  tacticalComment: string;
  predictedStyle: string;
  keyPlayer: string;
}

interface TacticalAnalysisProps {
  managerName: string;
  teamName: string;
  formation: string;
  players: AnalysisPlayer[];
}

// ── Yardımcı Bileşenler ───────────────────────────────────────────────────

function RatingBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-white/50 text-xs w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${(value / 10) * 100}%`, background: color }}
        />
      </div>
      <span className="text-white font-display text-sm w-6 text-right">{value}</span>
    </div>
  );
}

function OverallCircle({ rating }: { rating: number }) {
  const color =
    rating >= 8 ? "#22c55e" :
    rating >= 6 ? "#eab308" :
    "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center border-2 font-display text-2xl"
        style={{ borderColor: color, color, boxShadow: `0 0 20px ${color}44` }}
      >
        {rating}
      </div>
      <span className="text-white/40 text-xs">Genel</span>
    </div>
  );
}

// ── Ana Bileşen ────────────────────────────────────────────────────────────

export function TacticalAnalysis({ managerName, teamName, formation, players }: TacticalAnalysisProps) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<TacticalAnalysisData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);


  const analyze = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const resp = await fetch(`/api/analysis/tactical`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerName, teamName, formation, players }),
      });

      // Önce yanıt metnini al, sonra JSON olarak ayrıştır
      const text = await resp.text();
      let json: { success: boolean; analysis?: TacticalAnalysisData; error?: string };
      try {
        json = JSON.parse(text);
      } catch {
        if (!resp.ok) {
          throw new Error(`Yapay zeka sunucusuna bağlanılamadı (${resp.status}). Lütfen tekrar deneyin.`);
        }
        throw new Error("Sunucudan geçersiz yanıt alındı. Lütfen tekrar deneyin.");
      }

      if (!resp.ok || !json.success || !json.analysis) {
        throw new Error(json.error ?? "Analiz başarısız oldu.");
      }

      setData(json.analysis);
      setCollapsed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen hata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
      {/* Başlık */}
      <div className="bg-black/40 p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-display text-lg text-white uppercase tracking-widest m-0">
            Teknik Direktör Yorumu
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <button
              onClick={() => setCollapsed(c => !c)}
              className="text-white/40 hover:text-white transition-colors"
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
          <Button
            onClick={analyze}
            disabled={loading || players.length === 0}
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 h-auto"
          >
            {loading ? (
              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analiz Ediliyor...</>
            ) : (
              <><Brain className="w-3 h-3 mr-1" /> {data ? "Yenile" : "Analiz Et"}</>
            )}
          </Button>
        </div>
      </div>

      {/* Boş durum */}
      {!data && !loading && !error && (
        <div className="p-6 text-center text-white/30 text-sm">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
          Kadronuzu analiz ettirmek için butona tıklayın.
        </div>
      )}

      {/* Hata */}
      {error && (
        <div className="p-4 m-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Yükleniyor */}
      {loading && (
        <div className="p-8 flex flex-col items-center gap-3 text-white/40">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm">Yapay zeka kadronuzu değerlendiriyor...</p>
        </div>
      )}

      {/* Analiz Sonucu */}
      {data && !collapsed && (
        <div className="p-5 space-y-5">

          {/* Puan Özeti */}
          <div className="flex items-center gap-4">
            <OverallCircle rating={data.overallRating} />
            <div className="flex-1 space-y-2.5">
              <RatingBar label="Hücum" value={data.attackRating} color="#f97316" />
              <RatingBar label="Orta Saha" value={data.midfieldRating} color="#3b82f6" />
              <RatingBar label="Savunma" value={data.defenseRating} color="#22c55e" />
            </div>
          </div>

          {/* Oyun Stili */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Zap className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-purple-300 text-sm font-medium">{data.predictedStyle}</span>
          </div>

          {/* Kilit Oyuncu */}
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Star className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 text-xs uppercase tracking-wider mb-0.5">Kilit Oyuncu</p>
              <p className="text-white/80 text-sm">{data.keyPlayer}</p>
            </div>
          </div>

          {/* Güçlü / Zayıf Yönler */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-green-400 text-xs uppercase tracking-wider mb-2">
                <TrendingUp className="w-3 h-3" /> Güçlü Yönler
              </div>
              {data.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 text-white/70 text-xs">
                  <span className="text-green-400 mt-0.5">✓</span> {s}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-red-400 text-xs uppercase tracking-wider mb-2">
                <TrendingDown className="w-3 h-3" /> Zayıf Yönler
              </div>
              {data.weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5 text-white/70 text-xs">
                  <span className="text-red-400 mt-0.5">✗</span> {w}
                </div>
              ))}
            </div>
          </div>

          {/* Ana Yorum */}
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 relative">
            <span className="absolute top-2 left-3 text-3xl text-purple-400/30 font-serif leading-none">"</span>
            <p className="text-white/75 text-sm leading-relaxed pt-3 italic">
              {data.tacticalComment}
            </p>
            <span className="absolute bottom-1 right-3 text-3xl text-purple-400/30 font-serif leading-none">"</span>
          </div>

        </div>
      )}
    </div>
  );
}
