let audioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
    masterGainNode = null;
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMaster(): GainNode {
  const ac = getCtx();
  if (!masterGainNode) {
    masterGainNode = ac.createGain();
    masterGainNode.gain.value = 1.0;
    masterGainNode.connect(ac.destination);
  }
  return masterGainNode;
}

// ── Ses seviyesi kontrolü ────────────────────────────────────────────────────
export function setCrowdVolume(vol: number) {
  try {
    const master = getMaster();
    master.gain.setValueAtTime(vol, getCtx().currentTime);
  } catch (_) {}
}

// ── Seamless loop buffer oluştur ─────────────────────────────────────────────
// Loop noktasında "tık" sesi olmaması için:
// 1. Uzun tampon kullan (8 s → döngü her 8 saniyede bir, 3'te bir değil)
// 2. Son %5'i baştaki örneklerle crossfade yap → süreksizlik sıfıra iner
function makeNoiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const sr = ac.sampleRate;
  const bufLen = Math.floor(sr * seconds);
  const crossLen = Math.min(Math.floor(sr * 0.12), Math.floor(bufLen * 0.05));
  const buf = ac.createBuffer(2, bufLen, sr);

  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    // Crossfade son crossLen örneği → ilk crossLen örnekle karıştır
    for (let i = 0; i < crossLen; i++) {
      const t = i / crossLen;                 // 0 → 1
      const endIdx = bufLen - crossLen + i;
      d[endIdx] = d[endIdx] * (1 - t) + d[i] * t;
    }
  }
  return buf;
}

// ── Sürekli kalabalık sesi ───────────────────────────────────────────────────
let crowdGainNode: GainNode | null = null;
let crowdIsSurging = false;        // surge aktifken wobble tetiklenmesin
let crowdCurrentGain = 0;          // manuel gain takibi (.gain.value güvenilmez)

const CROWD_BASE   = 0.18;
const CROWD_SURGE  = 0.65;

export function startCrowdAmbience(): () => void {
  try {
    const ac = getCtx();
    const master = getMaster();

    // ── Ses katmanı 1: orta frekans kalabalık (500-1800 Hz) ─────────────────
    const buf1 = makeNoiseBuffer(ac, 8);
    const src1 = ac.createBufferSource();
    src1.buffer = buf1;
    src1.loop = true;

    const bp1 = ac.createBiquadFilter();
    bp1.type = "bandpass"; bp1.frequency.value = 500; bp1.Q.value = 0.5;

    const bp2 = ac.createBiquadFilter();
    bp2.type = "bandpass"; bp2.frequency.value = 900; bp2.Q.value = 1.2;

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1800;

    // ── Ses katmanı 2: düşük frekans uğultu (320 Hz) ────────────────────────
    const buf2 = makeNoiseBuffer(ac, 7); // farklı uzunluk → phase desync
    const src2 = ac.createBufferSource();
    src2.buffer = buf2;
    src2.loop = true;

    const bp3 = ac.createBiquadFilter();
    bp3.type = "bandpass"; bp3.frequency.value = 320; bp3.Q.value = 0.7;

    // ── Ortak gain ───────────────────────────────────────────────────────────
    const gainNode = ac.createGain();
    gainNode.gain.setValueAtTime(0, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(CROWD_BASE, ac.currentTime + 2.5);
    crowdGainNode   = gainNode;
    crowdIsSurging  = false;
    crowdCurrentGain = CROWD_BASE;

    src1.connect(bp1); bp1.connect(lp); lp.connect(gainNode);
    src1.connect(bp2); bp2.connect(gainNode);
    src2.connect(bp3); bp3.connect(gainNode);
    gainNode.connect(master);

    // Phase korelasyon bastırmak için farklı ofsetlerden başlat
    src1.start(0, Math.random() * 8);
    src2.start(0, Math.random() * 7);

    // ── Periyodik titreşim (wobble) ──────────────────────────────────────────
    const wobble = () => {
      if (!crowdGainNode || crowdIsSurging) return;
      try {
        const now  = ac.currentTime;
        const bump = CROWD_BASE + Math.random() * 0.06;
        crowdGainNode.gain.cancelScheduledValues(now);
        crowdGainNode.gain.setValueAtTime(crowdCurrentGain, now);
        crowdGainNode.gain.linearRampToValueAtTime(bump, now + 1.5);
        crowdGainNode.gain.linearRampToValueAtTime(CROWD_BASE, now + 4);
        // gain takibini güncelle
        setTimeout(() => { crowdCurrentGain = CROWD_BASE; }, 4100);
      } catch (_) {}
    };
    // Fade-in bitmeden wobble başlamasın
    const wobbleId = setInterval(wobble, 9000 + Math.random() * 5000);

    // Cleanup fonksiyonu
    return () => {
      clearInterval(wobbleId);
      const node = crowdGainNode;
      crowdGainNode   = null;
      crowdIsSurging  = false;
      crowdCurrentGain = 0;
      try {
        const now = ac.currentTime;
        if (node) {
          node.gain.cancelScheduledValues(now);
          node.gain.setValueAtTime(node.gain.value, now);
          node.gain.linearRampToValueAtTime(0, now + 1.5);
        }
        setTimeout(() => {
          try { src1.stop(); } catch (_) {}
          try { src2.stop(); } catch (_) {}
        }, 1700);
      } catch (_) {}
    };
  } catch (_) {
    return () => {};
  }
}

// ── Ani kalabalık patlaması (gol / bitiş düdüğü) ────────────────────────────
export function surgeCrowd() {
  if (!crowdGainNode) return;
  try {
    const ac  = getCtx();
    const now = ac.currentTime;
    crowdIsSurging = true;
    crowdGainNode.gain.cancelScheduledValues(now);
    // Mevcut interpolasyonlu değeri yakala: bilinen son gain'den devam et
    crowdGainNode.gain.setValueAtTime(crowdCurrentGain, now);
    crowdGainNode.gain.linearRampToValueAtTime(CROWD_SURGE, now + 0.25);
    crowdGainNode.gain.setValueAtTime(CROWD_SURGE, now + 3.5);
    crowdGainNode.gain.linearRampToValueAtTime(CROWD_BASE, now + 7.0);
    crowdCurrentGain = CROWD_BASE;
    // Surge bitince wobble yeniden aktif
    setTimeout(() => { crowdIsSurging = false; }, 7200);
  } catch (_) {}
}

// ── Gol sesi ─────────────────────────────────────────────────────────────────
export function playGoalSound() {
  try {
    surgeCrowd();
    const ac     = getCtx();
    const master = getMaster();
    const now    = ac.currentTime;

    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.35);
    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(0.28, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
    osc.connect(oscGain); oscGain.connect(master);
    osc.start(now); osc.stop(now + 0.7);

    const w  = ac.createOscillator();
    w.type = "sine";
    w.frequency.setValueAtTime(3200, now + 0.05);
    w.frequency.linearRampToValueAtTime(2700, now + 0.32);
    const wg = ac.createGain();
    wg.gain.setValueAtTime(0, now + 0.05);
    wg.gain.linearRampToValueAtTime(0.45, now + 0.08);
    wg.gain.setValueAtTime(0.45, now + 0.26);
    wg.gain.linearRampToValueAtTime(0, now + 0.34);
    w.connect(wg); wg.connect(master);
    w.start(now + 0.05); w.stop(now + 0.38);
  } catch (_) {}
}

// ── Bitiş düdüğü ─────────────────────────────────────────────────────────────
export function playFinalWhistle() {
  try {
    const ac     = getCtx();
    const master = getMaster();
    const now    = ac.currentTime;

    const pitches = [2800, 2950, 2700];
    const offsets = [0, 0.45, 0.9];
    pitches.forEach((freq, i) => {
      const t   = now + offsets[i];
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq - 150, t + 0.3);
      const g = ac.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.55, t + 0.03);
      g.gain.setValueAtTime(0.55, t + 0.25);
      g.gain.linearRampToValueAtTime(0, t + 0.35);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + 0.4);
    });

    setTimeout(() => surgeCrowd(), 1100);
  } catch (_) {}
}

// ── Top vuruş sesi ────────────────────────────────────────────────────────────
export function playKickSound() {
  try {
    const ac     = getCtx();
    const master = getMaster();
    const now    = ac.currentTime;

    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.35, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(g); g.connect(master);
    osc.start(now); osc.stop(now + 0.18);

    const bufLen = Math.floor(ac.sampleRate * 0.06);
    const buf    = ac.createBuffer(1, bufLen, ac.sampleRate);
    const d      = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    const ng = ac.createGain();
    ng.gain.value = 0.12;
    noise.connect(ng); ng.connect(master);
    noise.start(now);
  } catch (_) {}
}

// ── Pas / oyun sesi ──────────────────────────────────────────────────────────
export function playPassSound() {
  try {
    const ac     = getCtx();
    const master = getMaster();
    const now    = ac.currentTime;
    const osc    = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g); g.connect(master);
    osc.start(now); osc.stop(now + 0.12);
  } catch (_) {}
}

// ── Köşe vuruşu ıslığı ───────────────────────────────────────────────────────
export function playCornerWhistle() {
  try {
    const ac     = getCtx();
    const master = getMaster();
    const now    = ac.currentTime;
    const osc    = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.linearRampToValueAtTime(1900, now + 0.18);
    const g = ac.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.3, now + 0.02);
    g.gain.setValueAtTime(0.3, now + 0.14);
    g.gain.linearRampToValueAtTime(0, now + 0.2);
    osc.connect(g); g.connect(master);
    osc.start(now); osc.stop(now + 0.22);
  } catch (_) {}
}

// ── Kart sesi ────────────────────────────────────────────────────────────────
export function playCardSound() {
  try {
    const ac     = getCtx();
    const master = getMaster();
    const now    = ac.currentTime;
    const osc    = ac.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.25);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(g); g.connect(master);
    osc.start(now); osc.stop(now + 0.35);
  } catch (_) {}
}
