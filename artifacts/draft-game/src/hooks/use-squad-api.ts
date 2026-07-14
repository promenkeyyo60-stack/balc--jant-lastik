import { useState, useCallback, useRef } from "react";
import { fetchSquad, ApiPlayer } from "../lib/api-client";
import type { RealPlayer } from "../lib/teams-data";

interface SquadState {
  players: RealPlayer[] | null;
  loading: boolean;
  error: string | null;
  teamId: number | null;
}

// Tarayıcı taraflı in-memory önbellek (sekme ömrü boyunca geçerli)
const clientCache = new Map<number, RealPlayer[]>();

/** İsmi normalleştir: küçük harf, Türkçe/Latince diacritic kaldır, non-alfa sil */
function normName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * API oyuncusunu oyun formatına çevir.
 * staticMap: normalleştirilmiş_isim → subPos  (statik veriden üretilir)
 */
function mapApiToRealPlayer(
  teamId: string,
  p: ApiPlayer,
  staticMap: Map<string, string>
): RealPlayer {
  const key = normName(p.name);

  // 1) Tam isim eşleşmesi
  let subPos = staticMap.get(key);

  // 2) Soyadı eşleşmesi (son kelime)
  if (!subPos) {
    const surname = normName(p.name.split(" ").pop() ?? "");
    for (const [k, v] of staticMap) {
      if (k.endsWith(surname) && surname.length >= 3) {
        subPos = v;
        break;
      }
    }
  }

  return {
    id: `api-${p.id}`,
    name: p.name,
    position: p.position,
    subPos,
    teamId,
  };
}

export function useSquadApi() {
  const [state, setState] = useState<SquadState>({
    players: null,
    loading: false,
    error: null,
    teamId: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  /**
   * staticPlayers: takımın teams-data.ts'deki statik oyuncu listesi.
   * Bu liste API oyuncularıyla eşleştirilip subPos aktarılır.
   */
  const loadSquad = useCallback(
    async (apiTeamId: number, gameTeamId: string, staticPlayers: RealPlayer[] = []) => {
      // Önbellekte varsa direkt dön
      if (clientCache.has(apiTeamId)) {
        setState({ players: clientCache.get(apiTeamId)!, loading: false, error: null, teamId: apiTeamId });
        return;
      }

      // Önceki isteği iptal et
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setState((s) => ({ ...s, loading: true, error: null, teamId: apiTeamId }));

      // Statik oyunculardan isim → subPos haritası kur
      const staticMap = new Map<string, string>();
      for (const sp of staticPlayers) {
        if (sp.subPos) staticMap.set(normName(sp.name), sp.subPos);
      }

      try {
        const apiPlayers = await fetchSquad(apiTeamId);
        const players = apiPlayers.map((p) => mapApiToRealPlayer(gameTeamId, p, staticMap));
        clientCache.set(apiTeamId, players);
        setState({ players, loading: false, error: null, teamId: apiTeamId });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState((s) => ({
          ...s,
          loading: false,
          error: "Kadro yüklenemedi. Statik liste kullanılıyor.",
        }));
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ players: null, loading: false, error: null, teamId: null });
  }, []);

  return { ...state, loadSquad, reset };
}
