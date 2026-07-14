import { create } from "zustand";
import { RealPlayer, FORMATIONS, TEAMS } from "../lib/teams-data";

// Oyunculara atanacak rastgele renk paleti (8 ayrı renk)
const PLAYER_PALETTE = [
  "#f97316", // turuncu
  "#eab308", // sarı
  "#3b82f6", // mavi
  "#ec4899", // pembe
  "#a855f7", // mor
  "#06b6d4", // cyan
  "#84cc16", // yeşil-sarı
  "#ef4444", // kırmızı
];

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { PLAYER_PALETTE };

// ── Paylaşılan pozisyon yardımcıları ─────────────────────────────────────────

function rowToPos(rowIdx: number, totalRows: number): string {
  if (rowIdx === 0) return "GK";
  if (rowIdx === totalRows - 1) return "FWD";
  if (rowIdx === 1) return "DEF";
  return "MID";
}

function getSubPosPrefs(rowIdx: number, colIdx: number, colCount: number, totalRows: number): string[] {
  if (rowIdx === 0) return ["Kaleci"];
  if (rowIdx === totalRows - 1) {
    if (colCount <= 2) return ["Santrafor", "İkinci Forvet", "Sol Kanat", "Sağ Kanat"];
    if (colCount === 3) {
      if (colIdx === 0)            return ["Sol Kanat", "İkinci Forvet", "Santrafor"];
      if (colIdx === colCount - 1) return ["Sağ Kanat", "İkinci Forvet", "Santrafor"];
      return ["Santrafor", "İkinci Forvet", "Sol Kanat", "Sağ Kanat"];
    }
    if (colIdx === 0)            return ["Sol Kanat", "İkinci Forvet", "Santrafor"];
    if (colIdx === colCount - 1) return ["Sağ Kanat", "İkinci Forvet", "Santrafor"];
    return ["Santrafor", "İkinci Forvet", "Sol Kanat", "Sağ Kanat"];
  }
  if (rowIdx === 1) {
    if (colCount === 1) return ["Stoper", "Kanat Bek", "Sol Bek", "Sağ Bek"];
    if (colCount === 2) {
      if (colIdx === 0) return ["Sol Bek", "Kanat Bek", "Stoper"];
      return ["Sağ Bek", "Kanat Bek", "Stoper"];
    }
    if (colCount === 3) {
      if (colIdx === 0)            return ["Sol Bek", "Kanat Bek", "Stoper"];
      if (colIdx === colCount - 1) return ["Sağ Bek", "Kanat Bek", "Stoper"];
      return ["Stoper", "Kanat Bek", "Sol Bek", "Sağ Bek"];
    }
    if (colIdx === 0)            return ["Sol Bek", "Kanat Bek", "Stoper"];
    if (colIdx === colCount - 1) return ["Sağ Bek", "Kanat Bek", "Stoper"];
    return ["Stoper", "Kanat Bek", "Sol Bek", "Sağ Bek"];
  }
  if (colCount === 1) return ["Ön Libero", "Ofansif OS", "Orta Saha"];
  if (colCount === 2) {
    if (colIdx === 0) return ["Ön Libero", "Orta Saha", "Ofansif OS", "Sol Kanat"];
    return ["Ofansif OS", "Orta Saha", "Ön Libero", "Sağ Kanat"];
  }
  if (colIdx === 0)            return ["Sol Kanat", "Orta Saha", "Ofansif OS", "Ön Libero"];
  if (colIdx === colCount - 1) return ["Sağ Kanat", "Orta Saha", "Ofansif OS", "Ön Libero"];
  const leftInner = Math.floor(colCount / 2) - 1;
  if (colIdx <= leftInner) return ["Ön Libero", "Orta Saha", "Ofansif OS"];
  return ["Ofansif OS", "Orta Saha", "Ön Libero"];
}

// ── Gerçekçi Maç Skoru Hesaplama ────────────────────────────────────────────

const SIM_POZISYON_W: Record<string, number> = { GK: 5, DEF: 6, MID: 7, FWD: 8 };

function simTakimGucu(takim: UserPlayer): number {
  const base = takim.team.reduce((acc, s) => {
    if (!s.player) return acc;
    return acc + (SIM_POZISYON_W[s.player.position] ?? 6);
  }, 0);
  return base + Math.random() * 15;
}

function kazananGol(): number {
  const r = Math.random();
  if (r < 0.35) return 1;
  if (r < 0.70) return 2;
  if (r < 0.90) return 3;
  return 4;
}

function beraberlikGol(): number {
  const r = Math.random();
  if (r < 0.30) return 0;
  if (r < 0.68) return 1;
  if (r < 0.88) return 2;
  return 3;
}

function gercekciSkorHesapla(homeTeam: UserPlayer, awayTeam: UserPlayer): { h: number; a: number } {
  const hGuc = simTakimGucu(homeTeam);
  const aGuc = simTakimGucu(awayTeam);
  const toplam = hGuc + aGuc || 1;
  const hKazanma = (hGuc / toplam) * 0.60 + 0.08;
  const aKazanma = (aGuc / toplam) * 0.60;
  const r = Math.random();
  if (r < hKazanma) {
    const hScore = kazananGol();
    const aScore = Math.min(Math.floor(Math.random() * hScore), hScore - 1);
    return { h: hScore, a: aScore };
  } else if (r < hKazanma + (1 - hKazanma - aKazanma)) {
    const g = beraberlikGol();
    return { h: g, a: g };
  } else {
    const aScore = kazananGol();
    const hScore = Math.min(Math.floor(Math.random() * aScore), aScore - 1);
    return { h: hScore, a: aScore };
  }
}

// ── Puan tablosu güncelleme yardımcısı ──────────────────────────────────────

function standingsGuncelle(
  standings: Record<string, { played: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }>,
  homeId: string,
  awayId: string,
  hScore: number,
  aScore: number,
) {
  standings[homeId].played += 1;
  standings[awayId].played += 1;
  standings[homeId].gf += hScore;
  standings[homeId].ga += aScore;
  standings[awayId].gf += aScore;
  standings[awayId].ga += hScore;
  if (hScore > aScore) {
    standings[homeId].pts += 3; standings[homeId].w += 1; standings[awayId].l += 1;
  } else if (aScore > hScore) {
    standings[awayId].pts += 3; standings[awayId].w += 1; standings[homeId].l += 1;
  } else {
    standings[homeId].pts += 1; standings[homeId].d += 1;
    standings[awayId].pts += 1; standings[awayId].d += 1;
  }
}

export type GamePhase = "setup" | "draft" | "league";

export interface DraftedSlot {
  slotId: string;
  player: RealPlayer | null;
}

export interface UserPlayer {
  id: string;
  name: string;
  formationId: string;
  team: DraftedSlot[];
  isComplete: boolean;
}

export interface Match {
  id: string;
  homeId: string;
  awayId: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}

export type MatchEventType = "GOL" | "SUT" | "KART" | "KOSE_VURUSU" | "OYUN";

export interface MatchEvent {
  dakika: number;
  anlatim: string;
  olay: MatchEventType;
  koordinatlar: { x: number; y: number };
  takim: "ev" | "deplasman";
  oyuncu?: string;
}

interface GameState {
  phase: GamePhase;
  players: UserPlayer[];
  playerColors: Record<string, string>; // playerId → rastgele renk
  currentPlayerIndex: number;
  globalDraftedIds: Set<string>;

  // Wheel team selection
  wheelTeamIds: string[];

  // Transient draft state
  spunTeamId: string | null;
  selectedPlayerToPlace: RealPlayer | null;

  // League state
  matches: Match[];
  standings: Record<string, { pts: number; played: number; w: number; d: number; l: number; gf: number; ga: number }>;
  matchEvents: Record<string, MatchEvent[]>; // matchId → events

  // Actions
  setupGame: (users: { name: string; formationId: string }[]) => void;
  setWheelTeamIds: (teamIds: string[]) => void;
  spinWheelComplete: (teamId: string) => void;
  selectPlayerFromTeam: (player: RealPlayer) => void;
  placePlayerOnPitch: (slotId: string) => void;
  startLeague: () => void;
  simulateRound: () => void;
  simulateSingleMatch: (matchId: string) => void;
  recordMatchResult: (matchId: string, homeScore: number, awayScore: number) => void;
  saveMatchEvents: (matchId: string, events: MatchEvent[]) => void;
  autoFillCurrentPlayer: () => void;
  quickFillFromWheelTeams: () => void;
  resetGame: () => void;
  runTestGame: (playerCountOrUsers?: number | Array<{name: string; formationId: string}>) => void;
}

const generateEmptyPitch = (formationId: string): DraftedSlot[] => {
  const form = FORMATIONS.find((f) => f.id === formationId);
  const layout = form ? form.layout : [1, 4, 4, 2];
  const slots: DraftedSlot[] = [];
  layout.forEach((count, rowIdx) => {
    for (let colIdx = 0; colIdx < count; colIdx++) {
      slots.push({ slotId: `r${rowIdx}-c${colIdx}`, player: null });
    }
  });
  return slots;
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: "setup",
  players: [],
  playerColors: {},
  currentPlayerIndex: 0,
  globalDraftedIds: new Set(),

  wheelTeamIds: TEAMS.map((t) => t.id),

  spunTeamId: null,
  selectedPlayerToPlace: null,

  matches: [],
  standings: {},
  matchEvents: {},

  setupGame: (users) => {
    const players = users.map((u, i) => ({
      id: `u-${i}`,
      name: u.name || `Manager ${i + 1}`,
      formationId: u.formationId,
      team: generateEmptyPitch(u.formationId),
      isComplete: false,
    }));
    // Her oyuncuya karıştırılmış paletten benzersiz renk ata
    const colors = shuffled(PLAYER_PALETTE).slice(0, players.length);
    const playerColors: Record<string, string> = {};
    players.forEach((p, i) => { playerColors[p.id] = colors[i] ?? PLAYER_PALETTE[i % PLAYER_PALETTE.length]; });
    set({
      players,
      playerColors,
      phase: "draft",
      currentPlayerIndex: 0,
      globalDraftedIds: new Set(),
      matches: [],
      standings: {},
      matchEvents: {},
    });
  },

  setWheelTeamIds: (teamIds) => {
    set({ wheelTeamIds: teamIds });
  },

  spinWheelComplete: (teamId) => {
    set({ spunTeamId: teamId });
  },

  selectPlayerFromTeam: (player) => {
    // Oyuncu seçildiğinde her zaman manuel yerleştirme moduna geç
    set({ selectedPlayerToPlace: player, spunTeamId: null });
  },

  placePlayerOnPitch: (slotId) => {
    const { players, currentPlayerIndex, selectedPlayerToPlace, globalDraftedIds } = get();
    if (!selectedPlayerToPlace) return;

    const currentPlayer = players[currentPlayerIndex];
    const newTeam = [...currentPlayer.team];
    const slotIndex = newTeam.findIndex((s) => s.slotId === slotId);

    if (slotIndex !== -1 && !newTeam[slotIndex].player) {
      newTeam[slotIndex] = { ...newTeam[slotIndex], player: selectedPlayerToPlace };
      const newDraftedIds = new Set(globalDraftedIds);
      newDraftedIds.add(selectedPlayerToPlace.id);

      const isComplete = newTeam.every((s) => s.player !== null);
      const newPlayers = [...players];
      newPlayers[currentPlayerIndex] = { ...currentPlayer, team: newTeam, isComplete };

      let nextIndex = (currentPlayerIndex + 1) % players.length;
      let safety = 0;
      while (newPlayers[nextIndex].isComplete && safety < players.length) {
        nextIndex = (nextIndex + 1) % players.length;
        safety++;
      }

      set({
        players: newPlayers,
        globalDraftedIds: newDraftedIds,
        selectedPlayerToPlace: null,
        currentPlayerIndex: nextIndex,
      });
    }
  },

  autoFillCurrentPlayer: () => {
    const { spunTeamId, players, currentPlayerIndex, globalDraftedIds } = get();
    if (!spunTeamId) return;

    const team = TEAMS.find(t => t.id === spunTeamId);
    if (!team) return;

    const currentPlayer = players[currentPlayerIndex];
    const formation = FORMATIONS.find(f => f.id === currentPlayer.formationId)!;
    const layout = formation.layout;

    const newDraftedIds = new Set(globalDraftedIds);
    const usedInFill = new Set<string>();

    const byPos: Record<string, RealPlayer[]> = {
      GK:  shuffled(team.players.filter(p => p.position === "GK"  && !newDraftedIds.has(p.id))),
      DEF: shuffled(team.players.filter(p => p.position === "DEF" && !newDraftedIds.has(p.id))),
      MID: shuffled(team.players.filter(p => p.position === "MID" && !newDraftedIds.has(p.id))),
      FWD: shuffled(team.players.filter(p => p.position === "FWD" && !newDraftedIds.has(p.id))),
    };
    const fallback = shuffled(team.players.filter(p => !newDraftedIds.has(p.id)));

    const pickPlayer = (pos: string, rowIdx: number, colIdx: number, colCount: number): RealPlayer | null => {
      const prefs = getSubPosPrefs(rowIdx, colIdx, colCount, layout.length);
      // Havuzu tercihe göre sırala — tercih bulunamayanlar sona gider
      const pool = [...(byPos[pos] ?? [])].sort((a, b) => {
        const ai = a.subPos ? prefs.indexOf(a.subPos) : -1;
        const bi = b.subPos ? prefs.indexOf(b.subPos) : -1;
        const aScore = ai === -1 ? prefs.length : ai;
        const bScore = bi === -1 ? prefs.length : bi;
        return aScore - bScore;
      });
      for (const p of pool) {
        if (!usedInFill.has(p.id)) {
          usedInFill.add(p.id);
          newDraftedIds.add(p.id);
          // Kullanılan oyuncuyu byPos'tan da kaldır (tekrar çekilmesin)
          const posPool = byPos[pos];
          const idx = posPool.indexOf(p);
          if (idx !== -1) posPool.splice(idx, 1);
          return p;
        }
      }
      for (const p of fallback) {
        if (!usedInFill.has(p.id)) { usedInFill.add(p.id); newDraftedIds.add(p.id); return p; }
      }
      return null;
    };

    const newTeam = currentPlayer.team.map(slot => {
      if (slot.player) return slot;
      const parts   = slot.slotId.split("-");
      const rowIdx  = parseInt(parts[0].replace("r", ""));
      const colIdx  = parseInt(parts[1].replace("c", ""));
      const colCount = layout[rowIdx] ?? 1;
      const pos = rowToPos(rowIdx, layout.length);
      return { ...slot, player: pickPlayer(pos, rowIdx, colIdx, colCount) };
    });

    const isComplete = newTeam.every(s => s.player !== null);
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = { ...currentPlayer, team: newTeam, isComplete };

    let nextIndex = (currentPlayerIndex + 1) % players.length;
    let safety = 0;
    while (newPlayers[nextIndex]?.isComplete && safety < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      safety++;
    }
    const allDone = newPlayers.every(p => p.isComplete);

    set({
      players: newPlayers,
      globalDraftedIds: newDraftedIds,
      currentPlayerIndex: allDone ? currentPlayerIndex : nextIndex,
      spunTeamId: null,
      selectedPlayerToPlace: null,
    });
  },

  quickFillFromWheelTeams: () => {
    const { wheelTeamIds, players, currentPlayerIndex, globalDraftedIds } = get();
    const wheelTeams = TEAMS.filter(t => wheelTeamIds.includes(t.id));
    if (wheelTeams.length === 0 || players.length === 0) return;

    const allWheelPlayers: RealPlayer[] = wheelTeams.flatMap(t => t.players);

    const currentPlayer = players[currentPlayerIndex];
    const formation = FORMATIONS.find(f => f.id === currentPlayer.formationId)!;
    const layout = formation.layout;

    const newDraftedIds = new Set(globalDraftedIds);
    const usedInFill = new Set<string>();

    const byPos: Record<string, RealPlayer[]> = {
      GK:  shuffled(allWheelPlayers.filter(p => p.position === "GK"  && !newDraftedIds.has(p.id))),
      DEF: shuffled(allWheelPlayers.filter(p => p.position === "DEF" && !newDraftedIds.has(p.id))),
      MID: shuffled(allWheelPlayers.filter(p => p.position === "MID" && !newDraftedIds.has(p.id))),
      FWD: shuffled(allWheelPlayers.filter(p => p.position === "FWD" && !newDraftedIds.has(p.id))),
    };
    const fallback = shuffled(allWheelPlayers.filter(p => !newDraftedIds.has(p.id)));

    const pickPlayer = (pos: string, rowIdx: number, colIdx: number, colCount: number): RealPlayer | null => {
      const prefs = getSubPosPrefs(rowIdx, colIdx, colCount, layout.length);
      const pool = [...(byPos[pos] ?? [])].sort((a, b) => {
        const ai = a.subPos ? prefs.indexOf(a.subPos) : -1;
        const bi = b.subPos ? prefs.indexOf(b.subPos) : -1;
        return (ai === -1 ? prefs.length : ai) - (bi === -1 ? prefs.length : bi);
      });
      for (const p of pool) {
        if (!usedInFill.has(p.id)) {
          usedInFill.add(p.id);
          newDraftedIds.add(p.id);
          const idx = byPos[pos].indexOf(p);
          if (idx !== -1) byPos[pos].splice(idx, 1);
          return p;
        }
      }
      for (const p of fallback) {
        if (!usedInFill.has(p.id)) { usedInFill.add(p.id); newDraftedIds.add(p.id); return p; }
      }
      return null;
    };

    const newTeam = currentPlayer.team.map(slot => {
      if (slot.player) return slot;
      const rowIdx  = parseInt(slot.slotId.split("-")[0].replace("r", ""));
      const colIdx  = parseInt(slot.slotId.split("-")[1].replace("c", ""));
      const colCount = layout[rowIdx] ?? 1;
      const pos = rowToPos(rowIdx, layout.length);
      return { ...slot, player: pickPlayer(pos, rowIdx, colIdx, colCount) };
    });

    const isComplete = newTeam.every(s => s.player !== null);
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = { ...currentPlayer, team: newTeam, isComplete };

    // Sonraki oyuncuya geç
    let nextIndex = (currentPlayerIndex + 1) % players.length;
    let safety = 0;
    while (newPlayers[nextIndex]?.isComplete && safety < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      safety++;
    }

    set({
      players: newPlayers,
      globalDraftedIds: newDraftedIds,
      currentPlayerIndex: newPlayers.every(p => p.isComplete) ? currentPlayerIndex : nextIndex,
      spunTeamId: null,
      selectedPlayerToPlace: null,
    });
  },

  startLeague: () => {
    const { players } = get();
    const matches: Match[] = [];
    let matchId = 0;
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        matches.push({ id: `m-${matchId++}`, homeId: players[i].id, awayId: players[j].id, homeScore: null, awayScore: null, played: false });
        matches.push({ id: `m-${matchId++}`, homeId: players[j].id, awayId: players[i].id, homeScore: null, awayScore: null, played: false });
      }
    }
    const standings: Record<string, any> = {};
    players.forEach((p) => {
      standings[p.id] = { pts: 0, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
    });
    set({ phase: "league", matches, standings });
  },

  simulateRound: () => {
    const { matches, players, standings } = get();
    const unplayedMatches = matches.filter((m) => !m.played);
    if (unplayedMatches.length === 0) return;
    const matchesToPlay = unplayedMatches.slice(0, Math.max(1, Math.floor(players.length / 2)));
    const newMatches = [...matches];
    const newStandings = structuredClone(standings);

    matchesToPlay.forEach((match) => {
      const homeTeam = players.find((p) => p.id === match.homeId);
      const awayTeam = players.find((p) => p.id === match.awayId);
      if (homeTeam && awayTeam) {
        const { h: hScore, a: aScore } = gercekciSkorHesapla(homeTeam, awayTeam);
        const mIndex = newMatches.findIndex((m) => m.id === match.id);
        newMatches[mIndex] = { ...match, homeScore: hScore, awayScore: aScore, played: true };
        standingsGuncelle(newStandings, homeTeam.id, awayTeam.id, hScore, aScore);
      }
    });
    set({ matches: newMatches, standings: newStandings });
  },

  simulateSingleMatch: (matchId) => {
    const { matches, players, standings } = get();
    const match = matches.find((m) => m.id === matchId);
    if (!match || match.played) return;
    const homeTeam = players.find((p) => p.id === match.homeId);
    const awayTeam = players.find((p) => p.id === match.awayId);
    if (!homeTeam || !awayTeam) return;
    const { h: hScore, a: aScore } = gercekciSkorHesapla(homeTeam, awayTeam);
    const newMatches = matches.map((m) =>
      m.id === matchId ? { ...m, homeScore: hScore, awayScore: aScore, played: true } : m
    );
    const newStandings = structuredClone(standings);
    standingsGuncelle(newStandings, homeTeam.id, awayTeam.id, hScore, aScore);
    set({ matches: newMatches, standings: newStandings });
  },

  recordMatchResult: (matchId, homeScore, awayScore) => {
    const { matches, players, standings } = get();
    const match = matches.find((m) => m.id === matchId);
    if (!match || match.played) return;

    const newMatches = matches.map((m) =>
      m.id === matchId ? { ...m, homeScore, awayScore, played: true } : m
    );
    const newStandings = { ...standings };

    const home = players.find((p) => p.id === match.homeId);
    const away = players.find((p) => p.id === match.awayId);
    if (!home || !away) { set({ matches: newMatches }); return; }

    newStandings[home.id] = { ...newStandings[home.id] };
    newStandings[away.id] = { ...newStandings[away.id] };

    newStandings[home.id].played += 1;
    newStandings[away.id].played += 1;
    newStandings[home.id].gf += homeScore;
    newStandings[home.id].ga += awayScore;
    newStandings[away.id].gf += awayScore;
    newStandings[away.id].ga += homeScore;

    if (homeScore > awayScore) {
      newStandings[home.id].pts += 3; newStandings[home.id].w += 1; newStandings[away.id].l += 1;
    } else if (awayScore > homeScore) {
      newStandings[away.id].pts += 3; newStandings[away.id].w += 1; newStandings[home.id].l += 1;
    } else {
      newStandings[home.id].pts += 1; newStandings[home.id].d += 1;
      newStandings[away.id].pts += 1; newStandings[away.id].d += 1;
    }
    set({ matches: newMatches, standings: newStandings });
  },

  saveMatchEvents: (matchId, events) => {
    set((state) => ({
      matchEvents: { ...state.matchEvents, [matchId]: events },
    }));
  },

  runTestGame: (playerCountOrUsers: number | Array<{name: string; formationId: string}> = 4) => {
    const allTeams = [...TEAMS];
    const formationIds = FORMATIONS.map(f => f.id);

    // Parametre: sayı (eski) veya kullanıcı dizisi (yeni)
    const userConfigs: Array<{name: string; formationId: string}> = Array.isArray(playerCountOrUsers)
      ? playerCountOrUsers
      : (["Ahmet", "Mehmet", "Ayşe", "Fatma", "Kemal", "Zeynep"] as string[])
          .slice(0, playerCountOrUsers as number)
          .map((name, i) => ({ name, formationId: formationIds[i % formationIds.length] }));

    const users = userConfigs.map((u, i) => ({
      id: `u-${i}`,
      name: u.name,
      formationId: u.formationId,
    }));
    const playerCount = users.length;

    // Renkleri ata
    const colors = shuffled(PLAYER_PALETTE).slice(0, playerCount);
    const playerColors: Record<string, string> = {};
    users.forEach((u, i) => { playerColors[u.id] = colors[i] ?? PLAYER_PALETTE[i % PLAYER_PALETTE.length]; });

    // Her oyuncuya 11 oyunculuk takım oluştur (farklı takımlardan)
    const shuffledTeams = shuffled(allTeams);

    const players: UserPlayer[] = users.map((u, i) => {
      const formation = FORMATIONS.find(f => f.id === u.formationId)!;
      const layout = formation.layout;
      const slots: DraftedSlot[] = [];
      const sourceTeam = shuffledTeams[i % shuffledTeams.length];

      const byPos: Record<string, RealPlayer[]> = {
        GK:  shuffled(sourceTeam.players.filter(p => p.position === "GK")),
        DEF: shuffled(sourceTeam.players.filter(p => p.position === "DEF")),
        MID: shuffled(sourceTeam.players.filter(p => p.position === "MID")),
        FWD: shuffled(sourceTeam.players.filter(p => p.position === "FWD")),
      };

      const fallback = shuffled(sourceTeam.players);
      const usedIds = new Set<string>();

      const pickPlayer = (pos: string, rowIdx: number, colIdx: number, colCount: number): RealPlayer | null => {
        const prefs = getSubPosPrefs(rowIdx, colIdx, colCount, layout.length);
        const pool = [...(byPos[pos] ?? [])].sort((a, b) => {
          const ai = a.subPos ? prefs.indexOf(a.subPos) : -1;
          const bi = b.subPos ? prefs.indexOf(b.subPos) : -1;
          return (ai === -1 ? prefs.length : ai) - (bi === -1 ? prefs.length : bi);
        });
        for (const p of pool) {
          if (!usedIds.has(p.id)) {
            usedIds.add(p.id);
            const posPool = byPos[pos];
            const idx = posPool.indexOf(p);
            if (idx !== -1) posPool.splice(idx, 1);
            return p;
          }
        }
        for (const p of fallback) {
          if (!usedIds.has(p.id)) { usedIds.add(p.id); return p; }
        }
        return null;
      };

      layout.forEach((count, rowIdx) => {
        const pos = rowToPos(rowIdx, layout.length);
        for (let colIdx = 0; colIdx < count; colIdx++) {
          slots.push({ slotId: `r${rowIdx}-c${colIdx}`, player: pickPlayer(pos, rowIdx, colIdx, count) });
        }
      });

      return { id: u.id, name: u.name, formationId: u.formationId, team: slots, isComplete: true };
    });

    // Round-robin maç takvimi oluştur — maçlar oynanmamış olarak başlar
    const matches: Match[] = [];
    const standings: Record<string, { pts: number; played: number; w: number; d: number; l: number; gf: number; ga: number }> = {};
    players.forEach(p => { standings[p.id] = { pts: 0, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 }; });

    let matchId = 0;
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        for (const [homeIdx, awayIdx] of [[i, j], [j, i]]) {
          const home = players[homeIdx];
          const away = players[awayIdx];
          matches.push({ id: `m-${matchId++}`, homeId: home.id, awayId: away.id, homeScore: null, awayScore: null, played: false });
        }
      }
    }

    set({
      phase: "league",
      players,
      playerColors,
      currentPlayerIndex: 0,
      globalDraftedIds: new Set(),
      wheelTeamIds: TEAMS.map(t => t.id),
      spunTeamId: null,
      selectedPlayerToPlace: null,
      matches,
      standings,
    });
  },

  resetGame: () => {
    set({
      phase: "setup",
      players: [],
      playerColors: {},
      currentPlayerIndex: 0,
      globalDraftedIds: new Set(),
      wheelTeamIds: TEAMS.map((t) => t.id),
      spunTeamId: null,
      selectedPlayerToPlace: null,
      matches: [],
      standings: {},
      matchEvents: {},
    });
  },
}));
