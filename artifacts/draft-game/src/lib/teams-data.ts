export interface RealPlayer {
  id: string;
  name: string;
  position: string;
  subPos?: string;
  ovr?: number;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  flag: string;
  league: string;
  color: string;
  secondaryColor: string;
  players: RealPlayer[];
  apiId?: number;
}

const mkPlayers = (teamId: string, list: [string, string, string?, number?][]): RealPlayer[] =>
  list.map(([name, position, subPos, ovr]) => ({
    id: `${teamId}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")}`,
    name,
    position,
    subPos,
    ovr,
    teamId,
  }));

export const SUB_POS_CATEGORY: Record<string, string> = {
  "Kaleci": "GK",
  "Stoper": "DEF", "Sol Bek": "DEF", "Sağ Bek": "DEF", "Kanat Bek": "DEF",
  "Ön Libero": "MID", "Orta Saha": "MID", "Ofansif OS": "MID", "Sol Kanat": "MID", "Sağ Kanat": "MID",
  "Santrafor": "FWD", "İkinci Forvet": "FWD",
};

export const SUB_POS_ABBR: Record<string, string> = {
  "Kaleci":        "KL",
  "Stoper":        "STP",
  "Sol Bek":       "SLB",
  "Sağ Bek":       "SĞB",
  "Kanat Bek":     "DF",
  "Ön Libero":     "LBR",
  "Orta Saha":     "GÖ",
  "Ofansif OS":    "OOS",
  "Sol Kanat":     "SLK",
  "Sağ Kanat":     "SĞK",
  "Santrafor":     "SF",
  "İkinci Forvet": "GF",
};

export const POS_ABBR: Record<string, string> = {
  GK: "KL", DEF: "DF", MID: "OS", FWD: "FV",
};

export const TEAMS: Team[] = [
  // ── SÜPER LİG 2025-26 ──────────────────────────────────────────────────────
  {
    id: "GAL", name: "Galatasaray", flag: "🟡🔴", league: "Süper Lig", color: "#fdb912", secondaryColor: "#a90432", apiId: 645,
    players: mkPlayers("GAL", [
      ["Uğurcan Çakır","GK","Kaleci",80],["Günay Güvenç","GK","Kaleci",78],
      ["Davinson Sánchez","DEF","Stoper",84],["Ismail Jakobs","DEF","Sol Bek",80],["Abdülkerim Bardakcı","DEF","Stoper",79],["Kaan Ayhan","DEF","Stoper",77],["Wilfried Singo","DEF","Sağ Bek",82],["Sacha Boey","DEF","Sağ Bek",85],["Eren Elmalı","DEF","Sol Bek",77],
      ["Lucas Torreira","MID","Ön Libero",84],["Gabriel Sara","MID","Orta Saha",81],["İlkay Gündoğan","MID","Ofansif OS",88],["Mario Lemina","MID","Orta Saha",79],["Roland Sallai","MID","Sağ Kanat",81],
      ["Victor Osimhen","FWD","Santrafor",91],["Barış Alper Yılmaz","FWD","Sol Kanat",80],["Leroy Sané","FWD","Sağ Kanat",90],["Noa Lang","FWD","Sol Kanat",81],["Mauro Icardi","FWD","Santrafor",85],
    ]),
  },
  {
    id: "FEN", name: "Fenerbahçe", flag: "🔵💛", league: "Süper Lig", color: "#002060", secondaryColor: "#eded00", apiId: 611,
    players: mkPlayers("FEN", [
      ["Ederson","GK","Kaleci",90],["İrfan Can Eğribayat","GK","Kaleci",78],
      ["Milan Škriniar","DEF","Stoper",86],["Nélson Semedo","DEF","Sağ Bek",80],["Mert Müldür","DEF","Sağ Bek",78],["Çağlar Söyüncü","DEF","Stoper",83],["Jayden Oosterwolde","DEF","Sol Bek",79],["Luca Mercan","DEF","Stoper",71],
      ["N'Golo Kanté","MID","Ön Libero",84],["Mattéo Guendouzi","MID","Orta Saha",83],["Fred","MID","Ön Libero",82],["İsmail Yüksek","MID","Orta Saha",81],["Edson Álvarez","MID","Ön Libero",85],["Kerem Aktürkoğlu","MID","Sol Kanat",83],
      ["Anderson Talisca","FWD","İkinci Forvet",84],["Marco Asensio","FWD","Sağ Kanat",85],["Oğuz Aydın","FWD","Sol Kanat",73],["Nene Dorgeles","FWD","Sağ Kanat",79],
    ]),
  },
  {
    id: "BJK", name: "Beşiktaş", flag: "⚫⚪", league: "Süper Lig", color: "#1a1a1a", secondaryColor: "#c0c0c0", apiId: 549,
    players: mkPlayers("BJK", [
      ["Mert Günok","GK","Kaleci",78],["Ersin Destanoğlu","GK","Kaleci",80],["Devis Vásquez","GK","Kaleci",75],
      ["Gabriel Paulista","DEF","Stoper",70],["Tiago Djaló","DEF","Stoper",81],["Emmanuel Agbadou","DEF","Stoper",76],["Felix Uduokhai","DEF","Stoper",79],["Necip Uysal","DEF","Kanat Bek",69],["Rıdvan Yılmaz","DEF","Sol Bek",78],["David Jurásek","DEF","Sol Bek",79],
      ["Orkun Kökçü","MID","Ofansif OS",86],["Salih Uçan","MID","Ön Libero",77],["Wilfred Ndidi","MID","Ön Libero",81],["Rachid Ghezzal","MID","Sol Kanat",68],["Gedson Fernandes","MID","Orta Saha",84],
      ["Cengiz Ünder","FWD","Sağ Kanat",84],["Semih Kılıçsoy","FWD","Santrafor",83],["Cenk Tosun","FWD","Santrafor",69],["Ernest Muçi","FWD","Sol Kanat",79],
    ]),
  },
  {
    id: "TRB", name: "Trabzonspor", flag: "🔵🍊", league: "Süper Lig", color: "#6B0A0A", secondaryColor: "#1A3F7A", apiId: 998,
    players: mkPlayers("TRB", [
      ["André Onana","GK","Kaleci",83],["Onuralp Çevikkan","GK","Kaleci",62],
      ["Stefan Savić","DEF","Stoper",72],["Arseniy Batagov","DEF","Stoper",77],["Wagner Pina","DEF","Sol Bek",68],["Arif Boşlu","DEF","Sağ Bek",60],["Yusuf Erdoğan","DEF","Kanat Bek",67],
      ["Okay Yokuşlu","MID","Ön Libero",78],["Ozan Tufan","MID","Orta Saha",78],["Oleksandr Zubkov","MID","Sol Kanat",79],["Edin Višća","MID","Sağ Kanat",65],["Benjamin Bouchouari","MID","Orta Saha",77],["Bakasetas","MID","Ofansif OS",80],
      ["Paul Onuachu","FWD","Santrafor",79],["Djaniny","FWD","Sol Kanat",66],["Maxi Gómez","FWD","Santrafor",78],["Anastasios Douvikas","FWD","Santrafor",81],
    ]),
  },
  {
    id: "IBB", name: "Başakşehir", flag: "🌙⭐", league: "Süper Lig", color: "#F68B1F", secondaryColor: "#1A3065", apiId: 564,
    players: mkPlayers("IBB", [
      ["Süha Tekeli","GK","Kaleci",58],["Mert Kaçmaz","GK","Kaleci",57],
      ["Rafael","DEF","Sağ Bek",58],["Carlos Ponck","DEF","Stoper",77],["Eray Erkin","DEF","Stoper",62],["Junior Caiçara","DEF","Sağ Bek",57],["Aziz Behich","DEF","Sol Bek",63],
      ["Mahmut Tekdemir","MID","Ön Libero",56],["Berkay Özcan","MID","Orta Saha",77],["Deniz Türüç","MID","Sol Kanat",73],["Kerim Frei","MID","Sağ Kanat",69],["Mehmet Topal","MID","Ön Libero",52],
      ["Islam Slimani","FWD","Santrafor",59],["Mame Thiam","FWD","Santrafor",71],["Ezequiel Ponce","FWD","Santrafor",77],["Barış Yılmaz","FWD","Sol Kanat",64],
    ]),
  },
  {
    id: "GOZ", name: "Göztepe", flag: "🟡🔴", league: "Süper Lig", color: "#CC0000", secondaryColor: "#FFD700", apiId: 994,
    players: mkPlayers("GOZ", [
      ["Beto","GK","Kaleci",77],["Sezer Öztürk","GK","Kaleci",61],
      ["Caner Osmanpaşa","DEF","Stoper",55],["Emre Güngör","DEF","Sol Bek",52],["Tayyip Talha","DEF","Stoper",79],["Kerem Alıcı","DEF","Stoper",70],["Ferhat Çökmüş","DEF","Sağ Bek",60],
      ["Emre Çolak","MID","Orta Saha",64],["Okan Derici","MID","Orta Saha",66],["Erdoğan Yeşilyurt","MID","Ön Libero",77],["Ola John","MID","Sol Kanat",69],["Enis Bardhi","MID","Ofansif OS",78],
      ["Mbaye Diagne","FWD","Santrafor",58],["Haluk Akbunar","FWD","Sağ Kanat",77],["Gökhan Töre","FWD","Sağ Kanat",63],["Haris Duljevic","FWD","Sol Kanat",69],
    ]),
  },
  {
    id: "SIV", name: "Sivasspor", flag: "🔴⚪", league: "Süper Lig", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 1002,
    players: mkPlayers("SIV", [
      ["Muriz Memic","GK","Kaleci",57],["Ahmet Şasi","GK","Kaleci",60],
      ["Appindangoye","DEF","Stoper",68],["Ziya Erdal","DEF","Stoper",50],["Ali Kavrazlı","DEF","Sağ Bek",59],["Faye","DEF","Stoper",67],["Ahmet Yılmaz","DEF","Sol Bek",58],
      ["Hakan Arslan","MID","Ön Libero",50],["Claudemir","MID","Ön Libero",50],["Emre Kılınç","MID","Sol Kanat",69],["Bartuğ Elmaz","MID","Orta Saha",75],["Yasin Aktaş","MID","Sağ Kanat",59],
      ["Aaron Boupendza","FWD","Santrafor",80],["Moise Sahi","FWD","Sol Kanat",77],["Sory Kaba","FWD","Santrafor",76],["Adis Jahovic","FWD","İkinci Forvet",57],
    ]),
  },
  {
    id: "ALN", name: "Alanyaspor", flag: "🟠⚪", league: "Süper Lig", color: "#FF8000", secondaryColor: "#FFFFFF", apiId: 996,
    players: mkPlayers("ALN", [
      ["Ruben Martinez","GK","Kaleci",50],["Ahmet Kuru","GK","Kaleci",57],
      ["Welinton","DEF","Stoper",55],["Baiano","DEF","Stoper",68],["Efecan Karaca","DEF","Sağ Bek",68],["Davidson","DEF","Sol Bek",68],["Osman Korklu","DEF","Kanat Bek",58],["Tunay Torun","MID","Sol Kanat",59],
      ["Efkan Bekiroğlu","MID","Ön Libero",70],["Bill Antonio","MID","Orta Saha",68],["Salih Dursun","MID","Orta Saha",65],["Masouras","MID","Sağ Kanat",75],["Mert Çelik","DEF","Sağ Bek",77],
      ["Kvilitaia","FWD","Santrafor",73],["Nosa Igiebor","FWD","İkinci Forvet",55],["Emir Çelik","FWD","Sol Kanat",57],["Murilo","FWD","Sol Kanat",69],
    ]),
  },
  {
    id: "ANT", name: "Antalyaspor", flag: "🌴🔴", league: "Süper Lig", color: "#BE0000", secondaryColor: "#FFFFFF", apiId: 1005,
    players: mkPlayers("ANT", [
      ["Kamil Ahmet Çörekçi","GK","Kaleci",67],["Yiğit Güven","GK","Kaleci",56],
      ["Luiz Henrique","DEF","Sağ Bek",68],["Veysel Sarı","DEF","Sol Bek",58],["Rajovic","DEF","Stoper",59],["Elçin Şahin","DEF","Stoper",57],["Fredy Ribeiro","DEF","Stoper",69],
      ["Fulgani","MID","Ön Libero",55],["Eray Şapcı","MID","Orta Saha",58],["Nazariy Rusyn","MID","Sol Kanat",74],["Douglas","MID","Orta Saha",68],["Elvis Saravia","MID","Sağ Kanat",56],
      ["Riad Bajic","FWD","Santrafor",72],["Oghenekaro Etebo","MID","Ön Libero",76],["Yasin Öztekin","FWD","Sol Kanat",58],["Adis Jahovic","FWD","Santrafor",57],
    ]),
  },
  {
    id: "KAY", name: "Kayserispor", flag: "🟡🔴", league: "Süper Lig", color: "#FFD700", secondaryColor: "#CC0000", apiId: 1001,
    players: mkPlayers("KAY", [
      ["Jonas Lössl","GK","Kaleci",73],["Doğan Alemdar","GK","Kaleci",80],
      ["Furkan Durmaz","DEF","Stoper",63],["Bernardo","DEF","Stoper",76],["Seydou Sano","DEF","Stoper",67],["Vito Hammers","DEF","Sol Bek",66],["Eze","DEF","Sağ Bek",70],
      ["Oğuzhan Kefkir","MID","Ön Libero",60],["Tayfur Bingöl","MID","Orta Saha",72],["Recep Niyaz","MID","Sol Kanat",72],["Emre Demir","MID","Ofansif OS",72],["Jiya","MID","Sağ Kanat",66],
      ["Moryke Fofana","FWD","Sol Kanat",69],["Muhammed Beşir Ay","FWD","Santrafor",68],["Naby Sarr","DEF","Stoper",75],["Kaan Öztürk","FWD","İkinci Forvet",60],
    ]),
  },
  {
    id: "KAS", name: "Kasımpaşa", flag: "🟡🔵", league: "Süper Lig", color: "#FFD700", secondaryColor: "#003399", apiId: 1004,
    players: mkPlayers("KAS", [
      ["Ataberk Arıkan","GK","Kaleci",68],["Soner Şen","GK","Kaleci",67],
      ["Soner Dikmen","DEF","Stoper",68],["Shaquell Moore","DEF","Stoper",76],["Mücahit Albayrak","DEF","Stoper",62],["Caner Erzurum","DEF","Sol Bek",62],["Ali Emre Trabzon","DEF","Sağ Bek",63],
      ["İrfan Can Kahveci","MID","Ofansif OS",84],["Yusuf Şahin","MID","Orta Saha",58],["Batuhan Şen","MID","Sol Kanat",60],["Atakan Üner","MID","Ön Libero",67],["Gökhan Gönül","DEF","Sağ Bek",50],
      ["Mamadou Sylla","FWD","Santrafor",75],["Lekjaa","FWD","Sol Kanat",58],["Peniel Mlapa","FWD","Santrafor",57],["Veysel Şahin","FWD","İkinci Forvet",61],
    ]),
  },
  {
    id: "RIZ", name: "Çaykur Rizespor", flag: "🟢⚫", league: "Süper Lig", color: "#007A33", secondaryColor: "#000000", apiId: 1007,
    players: mkPlayers("RIZ", [
      ["Giedrius Arlauskis","GK","Kaleci",56],["Harun Alpsoy","GK","Kaleci",62],
      ["Elvir Koljic","DEF","Stoper",72],["Fabio Martins","DEF","Sol Bek",77],["Ertuğrul Taşkıran","DEF","Stoper",61],["Saba Lobzhanidze","DEF","Sağ Bek",78],["Furkan Soyalp","DEF","Kanat Bek",68],
      ["Ahmet Çalık","MID","Ön Libero",50],["Amir Hadziahmetovic","MID","Orta Saha",83],["Filip Krovinovic","MID","Orta Saha",80],["Recep Niyaz","MID","Sol Kanat",72],["Yasin Öztekin","MID","Sağ Kanat",58],
      ["Braian Rodríguez","FWD","Sol Kanat",51],["Owusu","FWD","Santrafor",76],["Kanga Kaku","FWD","Sağ Kanat",72],["Oghenekaro Etebo","MID","Ön Libero",76],
    ]),
  },
  {
    id: "SAM", name: "Samsunspor", flag: "🔴⚪", league: "Süper Lig", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 3603,
    players: mkPlayers("SAM", [
      ["Dejan Iliev","GK","Kaleci",73],["Mücahit Saraçoğlu","GK","Kaleci",62],
      ["Ahmet Oğuz","DEF","Stoper",70],["Sane","DEF","Stoper",55],["Mert Yandaş","DEF","Sol Bek",57],["Levan Shengelia","DEF","Sağ Bek",71],["Josue Sá","DEF","Stoper",70],
      ["Emre Mor","MID","Sol Kanat",76],["Ondrej Duda","MID","Ofansif OS",80],["Guilherme","MID","Orta Saha",68],["Fernando","MID","Ön Libero",58],["Stef Peeters","MID","Orta Saha",68],
      ["Oğulcan Çağlayan","FWD","Santrafor",70],["Serdar Gürler","FWD","Sağ Kanat",71],["Idrissa Doumbia","FWD","Sol Kanat",78],["Ghislain Konan","DEF","Sol Bek",79],
    ]),
  },
  {
    id: "ADA", name: "Adana Demirspor", flag: "🔵🔴", league: "Süper Lig", color: "#003399", secondaryColor: "#CC0000", apiId: 3563,
    players: mkPlayers("ADA", [
      ["Erhan Erentürk","GK","Kaleci",68],["Tomas Vaclik","GK","Kaleci",65],
      ["Abdülhamit Dursun","DEF","Sağ Bek",63],["Filip Korijenić","DEF","Stoper",60],["Lamine Gassama","DEF","Sağ Bek",60],["Efecan Karaca","DEF","Stoper",68],["Umut Nayir","DEF","Sol Bek",75],
      ["Yunus Mallı","MID","Ofansif OS",67],["Berkay Özcan","MID","Orta Saha",77],["Enis Bardhi","MID","Orta Saha",78],["Emre Demir","MID","Sol Kanat",72],["Kevin-Prince Boateng","MID","Orta Saha",55],
      ["Dario Benedetto","FWD","Santrafor",76],["Haluk Akbunar","FWD","Sağ Kanat",77],["Bafétimbi Gomis","FWD","Santrafor",52],["Cengiz Ünder","FWD","Sağ Kanat",84],
    ]),
  },
  {
    id: "GAS", name: "Gaziantep FK", flag: "🟠⚪", league: "Süper Lig", color: "#FF6600", secondaryColor: "#FFFFFF", apiId: 3573,
    players: mkPlayers("GAS", [
      ["Günay Güvenç","GK","Kaleci",78],["Samir","GK","Kaleci",68],
      ["Pedro Henrique","DEF","Stoper",73],["Mert Çelik","DEF","Sağ Bek",77],["Oscar Duarte","DEF","Stoper",70],["Erdal Rakip","DEF","Sol Bek",72],["Gökhan Süzen","DEF","Kanat Bek",58],
      ["Mehdi Bourabia","MID","Ön Libero",77],["Giorgi Aburjania","MID","Orta Saha",76],["Bilal Kısa","MID","Orta Saha",50],["Waris Majewski","MID","Sağ Kanat",70],["Tarasov","MID","Sol Kanat",70],
      ["Mustapha Yatabaré","FWD","Santrafor",57],["Olarenwaju Kayode","FWD","Sol Kanat",76],["Dzon Delarge","FWD","İkinci Forvet",69],["Anıl Karaer","FWD","Santrafor",56],
    ]),
  },
  {
    id: "BOD", name: "Bodrum FK", flag: "🔵⚪", league: "Süper Lig", color: "#0055A4", secondaryColor: "#FFFFFF", apiId: 3583,
    players: mkPlayers("BOD", [
      ["Harun Tekin","GK","Kaleci",70],["Levent Uysal","GK","Kaleci",60],
      ["Ömer Bayram","DEF","Sağ Bek",75],["Kerim Alıcı","DEF","Stoper",74],["Emre Taşdemir","DEF","Stoper",68],["Serdar Aziz","DEF","Stoper",73],["Mustafa Kaya","DEF","Sol Bek",57],
      ["Kerem Kesgin","MID","Ön Libero",69],["Batuhan Altıntaş","MID","Orta Saha",67],["Emre Güngör","DEF","Kanat Bek",52],["İbrahim Akdağ","MID","Orta Saha",63],["Hasan Kılıç","MID","Sol Kanat",75],
      ["Oğuz Aydın","FWD","Sol Kanat",73],["Kaan Kanak","FWD","İkinci Forvet",61],["Mete Kaan Demir","FWD","Sağ Kanat",60],["Anıl Karaer","FWD","Santrafor",56],
    ]),
  },
  {
    id: "EYU", name: "Eyüpspor", flag: "🟡🔵", league: "Süper Lig", color: "#003399", secondaryColor: "#FFD700", apiId: 3588,
    players: mkPlayers("EYU", [
      ["Doğan Alemdar","GK","Kaleci",80],["Ahmet Şasi","GK","Kaleci",60],
      ["Ryan Donk","DEF","Stoper",58],["Yusuf Sarı","DEF","Stoper",77],["Ferhat Çökmüş","DEF","Sağ Bek",60],["Batuhan Karadeniz","DEF","Sol Bek",62],["Barış Alıcı","DEF","Kanat Bek",73],
      ["Taylan Antalyalı","MID","Ön Libero",77],["Enis Destan","MID","Orta Saha",75],["Emre Demir","MID","Sol Kanat",72],["Recep Niyaz","MID","Sol Kanat",72],["Barış Soğan","MID","Sağ Kanat",60],
      ["Kerem Atakan Kesgin","FWD","İkinci Forvet",71],["Semih Kılıçsoy","FWD","Santrafor",83],["Halil Dervişoğlu","FWD","Santrafor",74],["Haris Duljevic","FWD","Sol Kanat",69],
    ]),
  },
  {
    id: "KON", name: "Konyaspor", flag: "🟢⚪", league: "Süper Lig", color: "#006633", secondaryColor: "#FFFFFF", apiId: 607,
    players: mkPlayers("KON", [
      ["Serkan Kırıntılı","GK","Kaleci",50],["Halil Kaya","GK","Kaleci",57],
      ["Hasan Ali Kaldırım","DEF","Sol Bek",65],["Kélian Nsona","DEF","Stoper",67],["Mücahit Albayrak","DEF","Stoper",62],["Skubic","DEF","Stoper",50],["Mustafa Kaya","DEF","Sağ Bek",57],
      ["Sinan Osmanoğlu","MID","Ofansif OS",68],["Halil Çolak","MID","Sol Kanat",72],["Abdülkerim Bardakçı","DEF","Stoper",82],["Gökhan Töre","MID","Sağ Kanat",63],["Yunus Mallı","MID","Ofansif OS",67],
      ["Haji Wright","FWD","Santrafor",80],["Muhammed Enes Kara","FWD","Santrafor",57],["Shamar Nicholson","FWD","Sol Kanat",73],["Bojan Jokić","DEF","Sol Bek",50],
    ]),
  },
  {
    id: "HAT", name: "Hatayspor", flag: "🟢🔴", league: "Süper Lig", color: "#006600", secondaryColor: "#CC0000", apiId: 3575,
    players: mkPlayers("HAT", [
      ["Ayhan Akman","GK","Kaleci",57],["Deniz Duman","GK","Kaleci",57],
      ["Muhammed Sahan","DEF","Stoper",55],["Aytaç Kara","DEF","Stoper",76],["Emre Güvenç","DEF","Sağ Bek",67],["Barış Alıcı","DEF","Sol Bek",73],["Gökhan Süzen","DEF","Kanat Bek",58],
      ["Oussama Tannane","MID","Sağ Kanat",78],["Souza","MID","Ön Libero",59],["Nathan Dossevi","MID","Sol Kanat",57],["Hasan Kılıç","MID","Orta Saha",75],["Erdoğan Yeşilyurt","MID","Ön Libero",77],
      ["Ndri Koffi","FWD","Sol Kanat",72],["Cheick Touré","FWD","Santrafor",70],["Nzuzi Toko","FWD","İkinci Forvet",60],["Stephane Badji","FWD","Santrafor",61],
    ]),
  },
  // ── TFF 1. LİG 2025-26 ─────────────────────────────────────────────────────
  {
    id: "SAK", name: "Sakaryaspor", flag: "🔴⚫", league: "TFF 1. Lig", color: "#CC0000", secondaryColor: "#000000", apiId: 3602,
    players: mkPlayers("SAK", [
      ["Önder Turaci","GK","Kaleci",50],["Emre Güral","GK","Kaleci",62],
      ["Ömer Bayram","DEF","Sağ Bek",75],["Samed Bazdar","DEF","Stoper",66],["Taha Tuncel","DEF","Stoper",65],["Burak Kapacak","DEF","Sol Bek",69],["Emirhan Han Gümüşdağ","DEF","Kanat Bek",67],
      ["Kerem Kesgin","MID","Ön Libero",69],["Musa Çağıran","MID","Orta Saha",76],["Taha Altıparmak","MID","Orta Saha",68],["Berkay Özcan","MID","Ofansif OS",77],["Enis Bardhi","MID","Sağ Kanat",78],
      ["Batuhan Şen","FWD","Sol Kanat",60],["Mete Kaan Demir","FWD","Sağ Kanat",60],["Sercan Yıldırım","FWD","Santrafor",50],["Ali Palabıyık","FWD","Santrafor",50],
    ]),
  },
  {
    id: "GCB", name: "Gençlerbirliği", flag: "🔴🟡", league: "TFF 1. Lig", color: "#CC0000", secondaryColor: "#FFD700", apiId: 997,
    players: mkPlayers("GCB", [
      ["Serkan Kırıntılı","GK","Kaleci",50],["Furkan Demir","GK","Kaleci",58],
      ["Mehmet Güven","DEF","Stoper",58],["Bahadır Oba","DEF","Stoper",58],["Haluk Tığ","DEF","Stoper",62],["Emre Güngör","DEF","Sol Bek",52],["Yusuf Şahin","DEF","Sağ Bek",58],
      ["Erdem Çelik","MID","Ön Libero",58],["Furkan Yokuşlu","MID","Orta Saha",68],["Halil Çolak","MID","Sol Kanat",72],["Musa Nizam","MID","Orta Saha",57],["Gökay Güney","MID","Ofansif OS",62],
      ["Mustafa Pektemek","FWD","Santrafor",57],["Eray Şapcı","FWD","İkinci Forvet",58],["Kaan Kanak","FWD","Sağ Kanat",61],["Ali Palabıyık","FWD","Santrafor",50],
    ]),
  },
  {
    id: "PND", name: "Pendikspor", flag: "🔵🔴", league: "TFF 1. Lig", color: "#1A1AE6", secondaryColor: "#CC0000", apiId: 3601,
    players: mkPlayers("PND", [
      ["Sinan Özkan","GK","Kaleci",58],["Emre Başkan","GK","Kaleci",58],
      ["Hüseyin Turgut","DEF","Stoper",58],["Carlos Ponck","DEF","Stoper",77],["Burak Kapacak","DEF","Sol Bek",69],["İbrahim İpek","DEF","Sağ Bek",68],["Kadir Ezdan","DEF","Kanat Bek",62],
      ["Taylan Antalyalı","MID","Ön Libero",77],["Batuhan Altıntaş","MID","Orta Saha",67],["Veli Yüksel","MID","Orta Saha",63],["Sinan Osmanoğlu","MID","Ofansif OS",68],["Hüseyin Eroğlu","MID","Sol Kanat",63],
      ["Mustafa Pektemek","FWD","Santrafor",57],["Kaan Öztürk","FWD","Santrafor",60],["Ahmet Ilgaz Çetin","FWD","İkinci Forvet",69],["Gökhan Töre","FWD","Sağ Kanat",63],
    ]),
  },
  {
    id: "ERZ", name: "Erzurumspor FK", flag: "🔵⚪", league: "TFF 1. Lig", color: "#003399", secondaryColor: "#FFFFFF", apiId: 1009,
    players: mkPlayers("ERZ", [
      ["Muhammed Bayır","GK","Kaleci",62],["Ramazan Civelek","GK","Kaleci",61],
      ["Soner Dikmen","DEF","Stoper",68],["Tarık Çamdal","DEF","Sağ Bek",67],["Emre Taşdemir","DEF","Stoper",68],["Efecan Karaca","DEF","Sol Bek",68],["Mehmet Dedeoğlu","DEF","Kanat Bek",60],
      ["Erdal Rakip","MID","Ön Libero",72],["Bilal Kısa","MID","Orta Saha",50],["Atakan Üner","MID","Orta Saha",67],["İbrahim Akdağ","MID","Orta Saha",63],["Ali Yüksel","MID","Sol Kanat",60],
      ["İlhan Parlak","FWD","Sol Kanat",50],["Kaan Kanak","FWD","İkinci Forvet",61],["Sercan Yıldırım","FWD","Santrafor",50],["Musa Araz","FWD","Sağ Kanat",69],
    ]),
  },
  {
    id: "ADP", name: "Adanaspor", flag: "🔵⚪", league: "TFF 1. Lig", color: "#003366", secondaryColor: "#FFFFFF", apiId: 3564,
    players: mkPlayers("ADP", [
      ["Tarık Özbir","GK","Kaleci",68],["Bülent Çorlu","GK","Kaleci",69],
      ["Serkan Asan","DEF","Stoper",72],["Tiago Pinto","DEF","Stoper",55],["Haluk Levent Tığ","DEF","Stoper",57],["Soner Aydoğdu","DEF","Sol Bek",70],["Oğuzhan Taş","DEF","Sağ Bek",68],
      ["Ferhan Haspolatlı","MID","Ön Libero",69],["Serkan Balcı","MID","Orta Saha",50],["Mert Erdoğan","MID","Ofansif OS",60],["Evandro Brandão","MID","Sağ Kanat",62],["Emre Kılınç","MID","Sol Kanat",69],
      ["Anıl Karaer","FWD","Santrafor",56],["Oğuz Aydın","FWD","Sol Kanat",73],["Ahmet Ilgaz Çetin","FWD","İkinci Forvet",69],["Ramzi Safuri","FWD","Sağ Kanat",72],
    ]),
  },
  {
    id: "ALT", name: "Altay", flag: "⚫🔴", league: "TFF 1. Lig", color: "#000000", secondaryColor: "#CC0000",
    players: mkPlayers("ALT", [
      ["Yusuf Eke","GK","Kaleci",68],["Muhammet Çakıroğlu","GK","Kaleci",69],
      ["Hasan Ali Kaldırım","DEF","Sol Bek",65],["Mustafa Kapı","DEF","Stoper",70],["Murat Ceylan","DEF","Stoper",60],["Ufuk Sarpar","DEF","Sağ Bek",67],["Servet Çetin","DEF","Stoper",50],
      ["Engin Saltuk","MID","Ön Libero",62],["Recep Niyaz","MID","Sol Kanat",72],["Kerem Atakan Kesgin","MID","Ofansif OS",71],["Furkan Yokuşlu","MID","Orta Saha",68],["Volkan Şen","MID","Sağ Kanat",58],
      ["İlhan Parlak","FWD","Sol Kanat",50],["Emre Mor","FWD","Sol Kanat",76],["Batuhan Karadeniz","DEF","Sol Bek",62],["Ali Palabıyık","FWD","Santrafor",50],
    ]),
  },
  {
    id: "COR", name: "Çorum FK", flag: "🔴⚪", league: "TFF 1. Lig", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 6343,
    players: mkPlayers("COR", [
      ["Sinan Küçük","GK","Kaleci",63],["Cüneyt Aktaş","GK","Kaleci",58],
      ["Tarık Çamdal","DEF","Sağ Bek",67],["Ali Turan","DEF","Stoper",52],["Abdulkadir Kayalı","DEF","Stoper",70],["Batuhan Karadeniz","DEF","Sol Bek",62],["Barış Alıcı","DEF","Kanat Bek",73],
      ["Veli Yüksel","MID","Ön Libero",63],["Deniz Kadah","MID","Ofansif OS",50],["Halil Akbunar","MID","Sağ Kanat",80],["Sinan Osmanoğlu","MID","Ofansif OS",68],["Halil Çolak","MID","Sol Kanat",72],
      ["Oğuz Duman","FWD","Sol Kanat",58],["Mert Erdoğan","FWD","Santrafor",60],["Kaan Öztürk","FWD","Santrafor",60],["Kerem Atakan","FWD","İkinci Forvet",68],
    ]),
  },
  {
    id: "KOC", name: "Kocaelispor", flag: "🔵⚫", league: "TFF 1. Lig", color: "#003366", secondaryColor: "#000000", apiId: 7411,
    players: mkPlayers("KOC", [
      ["Oğuzhan Çakır","GK","Kaleci",66],["Mehmet Akyüz","GK","Kaleci",56],
      ["Fuat Akdoğan","DEF","Stoper",67],["Murat Kılıç","DEF","Stoper",67],["Deniz Yılmaz","DEF","Sol Bek",58],["Mert Aydın","DEF","Sağ Bek",55],["Ali Turan","DEF","Kanat Bek",52],
      ["Ramazan Aslan","MID","Ön Libero",67],["Serhat Ağın","MID","Orta Saha",67],["Mehmet Bayram","MID","Orta Saha",62],["Olcay Şahan","MID","Ofansif OS",55],["Ahmet Çelik","MID","Sol Kanat",67],
      ["Burak Yılmaz","FWD","Santrafor",50],["Kaan Kanak","FWD","İkinci Forvet",61],["Musa Araz","FWD","Sol Kanat",69],["Özgür Yanık","FWD","Sağ Kanat",68],
    ]),
  },
  {
    id: "MNS", name: "Manisa FK", flag: "🟡🔵", league: "TFF 1. Lig", color: "#FFD700", secondaryColor: "#003399", apiId: 3597,
    players: mkPlayers("MNS", [
      ["Selim Ay","GK","Kaleci",70],["Serkan Kırıntılı","GK","Kaleci",50],
      ["Emre Güngör","DEF","Sol Bek",52],["Batuhan Altıntaş","DEF","Sağ Bek",67],["Murat Ceylan","DEF","Stoper",60],["Mehmet Yıldız","DEF","Stoper",67],["Gökhan Gönül","DEF","Sağ Bek",50],
      ["Uğur Boral","MID","Ön Libero",50],["Volkan Şen","MID","Sağ Kanat",58],["Kerem Tunçeri","MID","Orta Saha",62],["Ozan Tufan","MID","Orta Saha",78],["Berkay Özcan","MID","Ofansif OS",77],
      ["Burak Yılmaz","FWD","Santrafor",50],["Batuhan Karadeniz","FWD","Sol Kanat",62],["Semih Şentürk","FWD","Santrafor",50],["Tayfun Talınlı","FWD","İkinci Forvet",61],
    ]),
  },
  {
    id: "BND", name: "Bandırmaspor", flag: "🔴⚪", league: "TFF 1. Lig", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 3584,
    players: mkPlayers("BND", [
      ["Mehmet Akyüz","GK","Kaleci",56],["Tarık Özbir","GK","Kaleci",68],
      ["Soner Aydoğdu","DEF","Stoper",70],["Mehmet Gönüllü","DEF","Stoper",63],["Erhan Çelenk","DEF","Sol Bek",57],["Muhammet Kılıçaslan","DEF","Sağ Bek",58],["Emir Kaan Çalık","DEF","Kanat Bek",61],
      ["Özgür Çek","MID","Ön Libero",58],["Emre Çolak","MID","Orta Saha",64],["Okan Derici","MID","Orta Saha",66],["Abdülkadir Ömür","MID","Sağ Kanat",81],["Barış Özbek","MID","Sol Kanat",50],
      ["Necati Ateş","FWD","Santrafor",50],["Mete Kaan Demir","FWD","Sol Kanat",60],["Ali Vural","FWD","Santrafor",62],["Oğuz Duman","FWD","İkinci Forvet",58],
    ]),
  },
  {
    id: "KEC", name: "Keçiörengücü", flag: "🟢⚫", league: "TFF 1. Lig", color: "#006633", secondaryColor: "#000000", apiId: 3595,
    players: mkPlayers("KEC", [
      ["Murat Uslu","GK","Kaleci",58],["Emrah Başsan","GK","Kaleci",65],
      ["Yasin Pehlivan","DEF","Stoper",58],["Şevki Boztepe","DEF","Stoper",68],["Mücahit Albayrak","DEF","Stoper",62],["Mehmet Yıldırım","DEF","Sağ Bek",63],["Emre Taşdemir","DEF","Sol Bek",68],
      ["Emre Kaplan","MID","Ön Libero",67],["Musa Nizam","MID","Orta Saha",57],["İbrahim Akdağ","MID","Orta Saha",63],["Ahmet Şen","MID","Ofansif OS",68],["Emre Güngör","DEF","Sol Bek",52],
      ["Erdinç Karakaş","FWD","Santrafor",58],["Oğuz Duman","FWD","Sol Kanat",58],["Emre Kılınç","FWD","Sağ Kanat",69],["Kaan Kanak","FWD","İkinci Forvet",61],
    ]),
  },
  {
    id: "GIR", name: "Giresunspor", flag: "🟢⚪", league: "TFF 1. Lig", color: "#008000", secondaryColor: "#FFFFFF",
    players: mkPlayers("GIR", [
      ["Erten Ersu","GK","Kaleci",68],["Furkan Durmaz","GK","Kaleci",63],
      ["Burak Kapacak","DEF","Sol Bek",69],["Roberge","DEF","Stoper",60],["Lévani Đikia","DEF","Stoper",67],["Mensur Mujdža","DEF","Sağ Bek",50],["Lamine Gassama","DEF","Sağ Bek",60],
      ["Musa Nizam","MID","Ön Libero",57],["Celso Borges","MID","Orta Saha",58],["Giorgi Chakvetadze","MID","Ofansif OS",73],["Stef Peeters","MID","Orta Saha",68],["Mattias Svanberg","MID","Sağ Kanat",77],
      ["Fode Koita","FWD","Sol Kanat",62],["Gabriel Debeljuh","FWD","Santrafor",72],["Fabrice N'Guessi","FWD","Santrafor",60],["Saidou Panin Diallo","FWD","İkinci Forvet",58],
    ]),
  },
  {
    id: "BOL", name: "Boluspor", flag: "🟡⚫", league: "TFF 1. Lig", color: "#FFD700", secondaryColor: "#000000", apiId: 3569,
    players: mkPlayers("BOL", [
      ["Ömer Şişmanoğlu","GK","Kaleci",52],["Ahmet Demir","GK","Kaleci",58],
      ["Serdar Aziz","DEF","Stoper",73],["Hüseyin Balcı","DEF","Stoper",57],["Metehan Kaygalak","DEF","Sağ Bek",56],["Haluk Tığ","DEF","Stoper",62],["Emre Taşdemir","DEF","Sol Bek",68],
      ["Mert Yandaş","MID","Ön Libero",57],["Onur Bulut","MID","Orta Saha",74],["Erdi Elmaz","MID","Orta Saha",56],["Muhammed Sahan","MID","Sol Kanat",55],["Bilal Kısa","MID","Ofansif OS",50],
      ["Kerem Atakan Kesgin","FWD","İkinci Forvet",71],["Sercan Yıldırım","FWD","Santrafor",50],["Musa Araz","FWD","Sağ Kanat",69],["Emre Mor","FWD","Sol Kanat",76],
    ]),
  },
  {
    id: "TAR", name: "Tarsus İdman Yurdu", flag: "⚫🔴", league: "TFF 1. Lig", color: "#000000", secondaryColor: "#CC0000",
    players: mkPlayers("TAR", [
      ["Tolga Zengin","GK","Kaleci",50],["Gökhan Sarp","GK","Kaleci",55],
      ["Mert Aydın","DEF","Stoper",55],["Metin Aktaş","DEF","Stoper",58],["Haluk Levent Tığ","DEF","Sol Bek",57],["Serkan Balcı","DEF","Sağ Bek",50],["Hamza Akman","DEF","Kanat Bek",59],
      ["Bilal Kısa","MID","Ön Libero",50],["Vedat Güneş","MID","Orta Saha",56],["Furkan Soyalp","MID","Orta Saha",68],["Onur Özekinci","MID","Ofansif OS",57],["Mehmet Bayram","MID","Sol Kanat",62],
      ["Kaan Kanak","FWD","İkinci Forvet",61],["Erdinç Karakaş","FWD","Santrafor",58],["Oğuz Duman","FWD","Sol Kanat",58],["Gökay Güney","FWD","Sağ Kanat",62],
    ]),
  },
  {
    id: "SAN", name: "Şanlıurfaspor", flag: "🟠⚪", league: "TFF 1. Lig", color: "#FF6600", secondaryColor: "#FFFFFF", apiId: 3613,
    players: mkPlayers("SAN", [
      ["Murat Uslu","GK","Kaleci",58],["Sinan Küçük","GK","Kaleci",63],
      ["Yasin Abalı","DEF","Stoper",59],["Yusuf Çiçek","DEF","Stoper",58],["Burak Kapacak","DEF","Sol Bek",69],["Erhan Çelenk","DEF","Sağ Bek",57],["Soner Dikmen","DEF","Kanat Bek",68],
      ["Furkan Soyalp","MID","Ön Libero",68],["Serkan Balcı","MID","Orta Saha",50],["Erdal Rakip","MID","Orta Saha",72],["Oğuz Aydın","MID","Ofansif OS",73],["Emre Kılınç","MID","Sol Kanat",69],
      ["Batuhan Karadeniz","FWD","Sol Kanat",62],["Mert Erdoğan","FWD","Santrafor",60],["Mete Kaan Demir","FWD","Sağ Kanat",60],["Kaan Öztürk","FWD","Santrafor",60],
    ]),
  },
  {
    id: "AMD", name: "Amed Sportif", flag: "🟢🔴", league: "TFF 1. Lig", color: "#006600", secondaryColor: "#CC0000", apiId: 3579,
    players: mkPlayers("AMD", [
      ["Sinan Küçük","GK","Kaleci",63],["Cüneyt Aktaş","GK","Kaleci",58],
      ["Haluk Tığ","DEF","Stoper",62],["Ali Turan","DEF","Stoper",52],["Deniz Yılmaz","DEF","Sol Bek",58],["Muhammet Kılıçaslan","DEF","Sağ Bek",58],["Emre Taşdemir","DEF","Kanat Bek",68],
      ["Mehmet Bayram","MID","Ön Libero",62],["Gökay Güney","MID","Ofansif OS",62],["Musa Nizam","MID","Orta Saha",57],["Furkan Soyalp","MID","Orta Saha",68],["Atakan Üner","MID","Sol Kanat",67],
      ["Kaan Kanak","FWD","İkinci Forvet",61],["Erdinç Karakaş","FWD","Santrafor",58],["Oğuz Duman","FWD","Sol Kanat",58],["Emre Kılınç","FWD","Sağ Kanat",69],
    ]),
  },
  // ── PREMIER LEAGUE 2025-26 ───────────────────────────────────────────────────
  {
    id: "LIV", name: "Liverpool", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#C8102E", secondaryColor: "#00B2A9", apiId: 40,
    players: mkPlayers("LIV", [
      ["Alisson","GK","Kaleci",91],["Giorgi Mamardashvili","GK","Kaleci",88],
      ["Virgil van Dijk","DEF","Stoper",90],["Ibrahima Konaté","DEF","Stoper",86],["Jarell Quansah","DEF","Stoper",80],["Jeremie Frimpong","DEF","Sağ Bek",87],["Andrew Robertson","DEF","Sol Bek",85],["Milos Kerkez","DEF","Sol Bek",80],["Conor Bradley","DEF","Sağ Bek",79],
      ["Florian Wirtz","MID","Ofansif OS",91],["Alexis Mac Allister","MID","Orta Saha",85],["Ryan Gravenberch","MID","Ön Libero",83],["Dominik Szoboszlai","MID","Orta Saha",86],["Harvey Elliott","MID","Sağ Kanat",81],
      ["Mohamed Salah","FWD","Sağ Kanat",87],["Luis Díaz","FWD","Sol Kanat",85],["Cody Gakpo","FWD","Sol Kanat",84],["Alexander Isak","FWD","Santrafor",87],["Hugo Ekitike","FWD","Santrafor",79],
    ]),
  },
  {
    id: "ARS", name: "Arsenal", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#EF0107", secondaryColor: "#063672", apiId: 42,
    players: mkPlayers("ARS", [
      ["David Raya","GK","Kaleci",85],["Kepa Arrizabalaga","GK","Kaleci",78],
      ["William Saliba","DEF","Stoper",89],["Gabriel Magalhães","DEF","Stoper",85],["Ben White","DEF","Sağ Bek",84],["Riccardo Calafiori","DEF","Sol Bek",82],["Jurriën Timber","DEF","Sağ Bek",84],["Cristhian Mosquera","DEF","Stoper",81],["Myles Lewis-Skelly","DEF","Sol Bek",70],
      ["Martin Ødegaard","MID","Ofansif OS",89],["Declan Rice","MID","Ön Libero",89],["Martín Zubimendi","MID","Ön Libero",86],["Thomas Partey","MID","Ön Libero",78],["Eberechi Eze","MID","Orta Saha",86],
      ["Bukayo Saka","FWD","Sağ Kanat",91],["Gabriel Martinelli","FWD","Sol Kanat",87],["Viktor Gyökeres","FWD","Santrafor",86],["Kai Havertz","FWD","İkinci Forvet",86],["Noni Madueke","FWD","Sağ Kanat",81],
    ]),
  },
  {
    id: "MCI", name: "Manchester City", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#6CABDD", secondaryColor: "#1C2C5B", apiId: 50,
    players: mkPlayers("MCI", [
      ["Stefan Ortega","GK","Kaleci",83],["Scott Carson","GK","Kaleci",60],
      ["Rúben Dias","DEF","Stoper",90],["John Stones","DEF","Stoper",89],["Nathan Aké","DEF","Sol Bek",85],["Joško Gvardiol","DEF","Sol Bek",88],["Rico Lewis","DEF","Sağ Bek",84],["Rayan Ait-Nouri","DEF","Sol Bek",83],
      ["Bernardo Silva","MID","Orta Saha",90],["Matheus Nunes","MID","Orta Saha",80],["Kovacic","MID","Ön Libero",84],["Phil Foden","MID","Ofansif OS",92],["Savinho","MID","Sağ Kanat",85],
      ["Erling Haaland","FWD","Santrafor",93],["Jeremy Doku","FWD","Sol Kanat",87],["Omar Marmoush","FWD","İkinci Forvet",84],["James McAtee","FWD","Sağ Kanat",82],
    ]),
  },
  {
    id: "CHE", name: "Chelsea", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#034694", secondaryColor: "#DBA111", apiId: 49,
    players: mkPlayers("CHE", [
      ["Filip Jörgensen","GK","Kaleci",81],["Robert Sánchez","GK","Kaleci",76],
      ["Reece James","DEF","Sağ Bek",87],["Levi Colwill","DEF","Stoper",84],["Wesley Fofana","DEF","Stoper",83],["Marc Cucurella","DEF","Sol Bek",77],["Malo Gusto","DEF","Sağ Bek",81],["Tosin Adarabioyo","DEF","Stoper",78],["Renato Veiga","DEF","Stoper",77],
      ["Moisés Caicedo","MID","Ön Libero",84],["Enzo Fernández","MID","Orta Saha",86],["Kiernan Dewsbury-Hall","MID","Orta Saha",81],["Pedro Neto","MID","Sol Kanat",84],["Jadon Sancho","MID","Sol Kanat",85],
      ["Cole Palmer","MID","Ofansif OS",88],["Nicolas Jackson","FWD","Santrafor",82],["Christopher Nkunku","FWD","İkinci Forvet",86],["João Félix","FWD","Sol Kanat",80],["Mykhaylo Mudryk","FWD","Sol Kanat",79],
    ]),
  },
  {
    id: "MUN", name: "Man United", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#DA291C", secondaryColor: "#FFE500", apiId: 33,
    players: mkPlayers("MUN", [
      ["André Onana","GK","Kaleci",83],["Altay Bayındır","GK","Kaleci",76],
      ["Noussair Mazraoui","DEF","Sağ Bek",82],["Leny Yoro","DEF","Stoper",85],["Harry Maguire","DEF","Stoper",78],["Lisandro Martínez","DEF","Stoper",85],["Patrick Dorgu","DEF","Sol Bek",79],["Diogo Dalot","DEF","Sağ Bek",83],["Victor Lindelöf","DEF","Stoper",78],
      ["Bruno Fernandes","MID","Ofansif OS",88],["Kobbie Mainoo","MID","Orta Saha",84],["Manuel Ugarte","MID","Ön Libero",85],["Christian Eriksen","MID","Orta Saha",77],["Casemiro","MID","Ön Libero",80],
      ["Rasmus Højlund","FWD","Santrafor",85],["Alejandro Garnacho","FWD","Sol Kanat",84],["Amad Diallo","FWD","Sağ Kanat",79],["Mason Mount","FWD","İkinci Forvet",82],
    ]),
  },
  {
    id: "TOT", name: "Tottenham", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#132257", secondaryColor: "#FFFFFF", apiId: 47,
    players: mkPlayers("TOT", [
      ["Guglielmo Vicario","GK","Kaleci",86],["Fraser Forster","GK","Kaleci",70],
      ["Pedro Porro","DEF","Sağ Bek",83],["Micky van de Ven","DEF","Stoper",86],["Cristian Romero","DEF","Stoper",87],["Destiny Udogie","DEF","Sol Bek",85],["Archie Gray","DEF","Sağ Bek",77],["Ben Davies","DEF","Sol Bek",76],["Djed Spence","DEF","Kanat Bek",68],
      ["James Maddison","MID","Ofansif OS",86],["Yves Bissouma","MID","Ön Libero",82],["Rodrigo Bentancur","MID","Orta Saha",84],["Pape Matar Sarr","MID","Orta Saha",83],["Lucas Bergvall","MID","Orta Saha",81],
      ["Son Heung-min","FWD","Sol Kanat",91],["Dejan Kulusevski","FWD","Sağ Kanat",86],["Dominic Solanke","FWD","Santrafor",85],["Wilson Odobert","FWD","Sol Kanat",80],["Mikey Moore","FWD","Sağ Kanat",76],
    ]),
  },
  {
    id: "NEW", name: "Newcastle", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#241F20", secondaryColor: "#FFFFFF", apiId: 34,
    players: mkPlayers("NEW", [
      ["Nick Pope","GK","Kaleci",84],["Martin Dúbravka","GK","Kaleci",75],
      ["Fabian Schär","DEF","Stoper",78],["Sven Botman","DEF","Stoper",87],["Dan Burn","DEF","Sol Bek",74],["Tino Livramento","DEF","Sağ Bek",84],["Lewis Hall","DEF","Sol Bek",79],["Kieran Trippier","DEF","Sağ Bek",77],
      ["Bruno Guimarães","MID","Ön Libero",90],["Sandro Tonali","MID","Orta Saha",88],["Joelinton","MID","Orta Saha",85],["Harvey Barnes","MID","Sol Kanat",83],["Sean Longstaff","MID","Ön Libero",79],
      ["Anthony Gordon","FWD","Sol Kanat",85],["Callum Wilson","FWD","Santrafor",77],["Jacob Murphy","FWD","Sağ Kanat",74],["William Osula","FWD","Santrafor",76],
    ]),
  },
  {
    id: "AVL", name: "Aston Villa", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#670E36", secondaryColor: "#95BFE5", apiId: 66,
    players: mkPlayers("AVL", [
      ["Emiliano Martínez","GK","Kaleci",87],["Joe Gauci","GK","Kaleci",76],
      ["Ezri Konsa","DEF","Sağ Bek",83],["Pau Torres","DEF","Stoper",85],["Ian Maatsen","DEF","Sol Bek",82],["Matty Cash","DEF","Sağ Bek",79],["Lucas Digne","DEF","Sol Bek",77],["Clément Lenglet","DEF","Stoper",72],
      ["John McGinn","MID","Orta Saha",82],["Youri Tielemans","MID","Ön Libero",80],["Jacob Ramsey","MID","Orta Saha",81],["Boubakar Kamara","MID","Ön Libero",85],["Marcus Rashford","MID","Sol Kanat",86],
      ["Ollie Watkins","FWD","Santrafor",87],["Jhon Duran","FWD","Santrafor",80],["Morgan Rogers","FWD","İkinci Forvet",77],["Leon Bailey","FWD","Sağ Kanat",80],
    ]),
  },
  {
    id: "NOT", name: "Nottm Forest", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#DD0000", secondaryColor: "#FFFFFF", apiId: 65,
    players: mkPlayers("NOT", [
      ["Matz Sels","GK","Kaleci",78],["Carlos Miguel","GK","Kaleci",72],
      ["Ola Aina","DEF","Sağ Bek",76],["Nikola Milenković","DEF","Stoper",79],["Murillo","DEF","Stoper",83],["Nuno Tavares","DEF","Sol Bek",71],["Harry Toffolo","DEF","Sol Bek",69],["Eric da Silva Moreira","DEF","Kanat Bek",67],
      ["Ryan Yates","MID","Ön Libero",72],["Elliot Anderson","MID","Orta Saha",77],["Morgan Gibbs-White","MID","Ofansif OS",82],["Callum Hudson-Odoi","MID","Sağ Kanat",79],["Nicolas Dominguez","MID","Orta Saha",78],
      ["Chris Wood","FWD","Santrafor",69],["Anthony Elanga","FWD","Sağ Kanat",77],["Taiwo Awoniyi","FWD","Santrafor",79],["Jota Silva","FWD","Sol Kanat",76],
    ]),
  },
  {
    id: "BOU", name: "Bournemouth", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#DA291C", secondaryColor: "#000000", apiId: 35,
    players: mkPlayers("BOU", [
      ["Neto","GK","Kaleci",77],["Mark Travers","GK","Kaleci",75],
      ["Adam Smith","DEF","Sağ Bek",68],["Illya Zabarnyi","DEF","Stoper",84],["Dean Huijsen","DEF","Stoper",80],["Ryan Fredericks","DEF","Sağ Bek",60],["Chris Mepham","DEF","Stoper",76],
      ["Lewis Cook","MID","Ön Libero",78],["Ryan Christie","MID","Orta Saha",77],["Philip Billing","MID","Orta Saha",79],["Tyler Adams","MID","Ön Libero",83],["Marcus Tavernier","MID","Sol Kanat",79],
      ["Antoine Semenyo","FWD","Sağ Kanat",78],["Evanilson","FWD","Santrafor",85],["Justin Kluivert","FWD","İkinci Forvet",79],["Dango Ouattara","FWD","Sol Kanat",77],
    ]),
  },
  {
    id: "FUL", name: "Fulham", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#FFFFFF", secondaryColor: "#CC0000", apiId: 36,
    players: mkPlayers("FUL", [
      ["Bernd Leno","GK","Kaleci",80],["Marek Rodák","GK","Kaleci",70],
      ["Kenny Tete","DEF","Sağ Bek",77],["Issa Diop","DEF","Stoper",78],["Calvin Bassey","DEF","Stoper",80],["Antonee Robinson","DEF","Sol Bek",84],["Timothy Castagne","DEF","Sağ Bek",79],
      ["Andreas Pereira","MID","Ofansif OS",79],["Harrison Reed","MID","Ön Libero",76],["Tom Cairney","MID","Orta Saha",68],["Alex Iwobi","MID","Sol Kanat",81],["Emile Smith Rowe","MID","Sağ Kanat",82],
      ["Raúl Jiménez","FWD","Santrafor",67],["Rodrigo Muniz","FWD","Santrafor",81],["Harry Wilson","FWD","Sol Kanat",78],["Sasa Lukic","FWD","İkinci Forvet",77],
    ]),
  },
  {
    id: "BHA", name: "Brighton", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#0057B8", secondaryColor: "#FFFFFF", apiId: 51,
    players: mkPlayers("BHA", [
      ["Bart Verbruggen","GK","Kaleci",85],["Jason Steele","GK","Kaleci",70],
      ["Joel Veltman","DEF","Sağ Bek",72],["Lewis Dunk","DEF","Stoper",84],["Jan Paul van Hecke","DEF","Stoper",81],["Pervis Estupiñán","DEF","Sol Bek",85],["Tariq Lamptey","DEF","Sağ Bek",79],
      ["Jack Hinshelwood","MID","Orta Saha",80],["Carlos Baleba","MID","Ön Libero",82],["Solly March","MID","Sol Kanat",78],["Georginio Rutter","MID","Ofansif OS",81],["Yasin Ayari","MID","Orta Saha",77],
      ["João Pedro","FWD","İkinci Forvet",85],["Kaoru Mitoma","FWD","Sol Kanat",85],["Simon Adingra","FWD","Sağ Kanat",82],["Evan Ferguson","FWD","Santrafor",86],
    ]),
  },
  {
    id: "BRE", name: "Brentford", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#E30613", secondaryColor: "#FFFFFF", apiId: 55,
    players: mkPlayers("BRE", [
      ["Mark Flekken","GK","Kaleci",80],["Matthew Cox","GK","Kaleci",70],
      ["Aaron Hickey","DEF","Sağ Bek",81],["Ben Mee","DEF","Stoper",72],["Ethan Pinnock","DEF","Stoper",79],["Sepp van den Berg","DEF","Stoper",77],["Mads Roerslev","DEF","Sağ Bek",77],
      ["Vitaly Janelt","MID","Ön Libero",80],["Mathias Jensen","MID","Orta Saha",80],["Mikkel Damsgaard","MID","Ofansif OS",78],["Kevin Schade","MID","Sağ Kanat",79],["Yehor Yarmolyuk","MID","Orta Saha",77],
      ["Yoane Wissa","FWD","Sol Kanat",80],["Bryan Mbeumo","FWD","Sağ Kanat",83],["Igor Thiago","FWD","Santrafor",80],["Fabio Carvalho","FWD","İkinci Forvet",79],
    ]),
  },
  {
    id: "EVE", name: "Everton", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#003399", secondaryColor: "#FFFFFF", apiId: 45,
    players: mkPlayers("EVE", [
      ["Jordan Pickford","GK","Kaleci",84],["Joao Virginia","GK","Kaleci",72],
      ["James Tarkowski","DEF","Stoper",79],["Jarrad Branthwaite","DEF","Stoper",84],["Vitaliy Mykolenko","DEF","Sol Bek",80],["Ashley Young","DEF","Sağ Bek",55],["Seamus Coleman","DEF","Sağ Bek",55],
      ["Idrissa Gana Gueye","MID","Ön Libero",68],["Abdoulaye Doucouré","MID","Orta Saha",74],["Jack Harrison","MID","Sol Kanat",80],["Iliman Ndiaye","MID","Sağ Kanat",79],["Tim Iroegbunam","MID","Orta Saha",76],
      ["Dominic Calvert-Lewin","FWD","Santrafor",78],["Beto","FWD","Santrafor",77],["Jesper Lindstrøm","FWD","Sol Kanat",81],["Armando Broja","FWD","İkinci Forvet",79],
    ]),
  },
  {
    id: "CRY", name: "Crystal Palace", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#1B458F", secondaryColor: "#C4122E", apiId: 52,
    players: mkPlayers("CRY", [
      ["Dean Henderson","GK","Kaleci",79],["Sam Johnstone","GK","Kaleci",78],
      ["Daniel Muñoz","DEF","Sağ Bek",78],["Marc Guéhi","DEF","Stoper",84],["Joachim Andersen","DEF","Stoper",81],["Tyrick Mitchell","DEF","Sol Bek",79],["Nathaniel Clyne","DEF","Sağ Bek",65],
      ["Adam Wharton","MID","Ön Libero",82],["Jefferson Lerma","MID","Ön Libero",78],["Will Hughes","MID","Orta Saha",76],["Daichi Kamada","MID","Ofansif OS",81],["Ismaïla Sarr","MID","Sağ Kanat",79],
      ["Jean-Philippe Mateta","FWD","Santrafor",79],["Eddie Nketiah","FWD","Santrafor",79],["Odsonne Edouard","FWD","İkinci Forvet",77],["Romain Esse","FWD","Sol Kanat",72],
    ]),
  },
  {
    id: "WOL", name: "Wolves", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#FDB913", secondaryColor: "#231F20", apiId: 39,
    players: mkPlayers("WOL", [
      ["José Sá","GK","Kaleci",80],["Sam Johnstone","GK","Kaleci",78],
      ["Nelson Semedo","DEF","Sağ Bek",79],["Toti Gomes","DEF","Stoper",77],["Santiago Bueno","DEF","Stoper",74],["Emmanuel Agbadou","DEF","Stoper",76],["Matt Doherty","DEF","Sağ Bek",70],
      ["João Gomes","MID","Ön Libero",82],["André","MID","Ön Libero",81],["Tommy Doyle","MID","Orta Saha",78],["Pablo Sarabia","MID","Sol Kanat",77],["Rodrigo Gomes","MID","Sağ Kanat",73],
      ["Matheus Cunha","FWD","İkinci Forvet",84],["Jørgen Strand Larsen","FWD","Santrafor",78],["Carlos Forbs","FWD","Sağ Kanat",75],["Rodrigo Gomes","FWD","Sol Kanat",73],
    ]),
  },
  {
    id: "IPS", name: "Ipswich Town", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#0044A9", secondaryColor: "#FFFFFF", apiId: 57,
    players: mkPlayers("IPS", [
      ["Arijanet Muric","GK","Kaleci",74],["Christian Walton","GK","Kaleci",69],
      ["Cameron Burgess","DEF","Stoper",70],["Axel Tuanzebe","DEF","Stoper",72],["Leif Davis","DEF","Sol Bek",75],["Ben Johnson","DEF","Sağ Bek",76],["Dara O'Shea","DEF","Stoper",77],
      ["Sam Morsy","MID","Ön Libero",71],["Omari Hutchinson","MID","Sağ Kanat",82],["Jack Clarke","MID","Sol Kanat",81],["Kalvin Phillips","MID","Ön Libero",77],["Wes Burns","DEF","Sağ Bek",72],
      ["Liam Delap","FWD","Santrafor",76],["Sammie Szmodics","FWD","İkinci Forvet",79],["George Hirst","FWD","Santrafor",73],["Ali Al-Hamadi","FWD","Sol Kanat",71],
    ]),
  },
  {
    id: "LEI", name: "Leicester City", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", color: "#003090", secondaryColor: "#FDBE11", apiId: 46,
    players: mkPlayers("LEI", [
      ["Mads Hermansen","GK","Kaleci",82],["Danny Ward","GK","Kaleci",71],
      ["Conor Coady","DEF","Stoper",74],["Wout Faes","DEF","Stoper",80],["Ricardo Pereira","DEF","Sağ Bek",78],["Victor Kristiansen","DEF","Sol Bek",79],["Luke Thomas","DEF","Sol Bek",74],
      ["Wilfred Ndidi","MID","Ön Libero",81],["Boubakary Soumaré","MID","Orta Saha",78],["Harry Winks","MID","Orta Saha",78],["Abdul Fatawu","MID","Sağ Kanat",84],["Stephy Mavididi","MID","Sol Kanat",79],
      ["Jamie Vardy","FWD","Santrafor",65],["Patson Daka","FWD","Santrafor",79],["Tom Cannon","FWD","İkinci Forvet",76],["Kiernan Dewsbury-Hall","MID","Ofansif OS",81],
    ]),
  },
  // ── LA LİGA 2025-26 ────────────────────────────────────────────────────────
  {
    id: "RMA", name: "Real Madrid", flag: "🇪🇸", league: "La Liga", color: "#FEBE10", secondaryColor: "#00529F", apiId: 541,
    players: mkPlayers("RMA", [
      ["Thibaut Courtois","GK","Kaleci",91],["Andriy Lunin","GK","Kaleci",86],
      ["Éder Militão","DEF","Stoper",90],["Antonio Rüdiger","DEF","Stoper",87],["Ferland Mendy","DEF","Sol Bek",84],["Trent Alexander-Arnold","DEF","Sağ Bek",90],["Dean Huijsen","DEF","Stoper",80],["Álvaro Carreras","DEF","Sol Bek",79],["Raúl Asencio","DEF","Stoper",76],
      ["Jude Bellingham","MID","Ofansif OS",94],["Aurelien Tchouaméni","MID","Ön Libero",89],["Eduardo Camavinga","MID","Orta Saha",90],["Federico Valverde","MID","Orta Saha",91],["Arda Güler","MID","Sağ Kanat",85],["Franco Mastantuono","MID","Sol Kanat",77],
      ["Kylian Mbappé","FWD","Sol Kanat",95],["Vinicius Jr","FWD","Sol Kanat",93],["Rodrygo","FWD","Sağ Kanat",89],["Endrick","FWD","Santrafor",86],["Brahim Díaz","FWD","İkinci Forvet",85],
    ]),
  },
  {
    id: "BAR", name: "Barcelona", flag: "🇪🇸", league: "La Liga", color: "#A50044", secondaryColor: "#004D98", apiId: 529,
    players: mkPlayers("BAR", [
      ["Wojciech Szczesny","GK","Kaleci",83],["İñaki Peña","GK","Kaleci",79],
      ["Jules Koundé","DEF","Sağ Bek",87],["Pau Cubarsí","DEF","Stoper",86],["Ronald Araújo","DEF","Stoper",89],["Alejandro Balde","DEF","Sol Bek",86],["Gerard Martín","DEF","Sol Bek",72],["Andreas Christensen","DEF","Stoper",83],["Héctor Fort","DEF","Sağ Bek",75],
      ["Pedri","MID","Orta Saha",90],["Marc Casadó","MID","Ön Libero",74],["Dani Olmo","MID","Ofansif OS",85],["Fermín López","MID","Orta Saha",81],["Gavi","MID","Orta Saha",86],["Frenkie de Jong","MID","Ön Libero",88],
      ["Raphinha","FWD","Sağ Kanat",84],["Lamine Yamal","FWD","Sağ Kanat",89],["Robert Lewandowski","FWD","Santrafor",81],["Ferran Torres","FWD","Sol Kanat",80],["Pau Víctor","FWD","İkinci Forvet",76],
    ]),
  },
  {
    id: "ATM", name: "Atletico Madrid", flag: "🇪🇸", league: "La Liga", color: "#CE3524", secondaryColor: "#272E61", apiId: 530,
    players: mkPlayers("ATM", [
      ["Jan Oblak","GK","Kaleci",86],["Juan Musso","GK","Kaleci",79],
      ["Nahuel Molina","DEF","Sağ Bek",82],["Robin Le Normand","DEF","Stoper",82],["José María Giménez","DEF","Stoper",82],["Reinildo","DEF","Sol Bek",80],["Marcos Llorente","DEF","Sağ Bek",83],["Samuel Lino","MID","Sol Kanat",83],
      ["Koke","MID","Orta Saha",80],["Rodrigo De Paul","MID","Orta Saha",86],["Conor Gallagher","MID","Ön Libero",84],["Pablo Barrios","MID","Ön Libero",83],["Giuliano Simeone","MID","Sağ Kanat",77],
      ["Antoine Griezmann","FWD","İkinci Forvet",87],["Julián Álvarez","FWD","Santrafor",89],["Alexander Sørloth","FWD","Santrafor",83],["Ángel Correa","FWD","Sol Kanat",80],["Arnau Puigmal","FWD","Sağ Kanat",75],
    ]),
  },
  {
    id: "VIL", name: "Villarreal", flag: "🇪🇸", league: "La Liga", color: "#FFE135", secondaryColor: "#004F9F", apiId: 533,
    players: mkPlayers("VIL", [
      ["Filip Jörgensen","GK","Kaleci",81],["Diego Conde","GK","Kaleci",77],
      ["Alfonso Pedraza","DEF","Sol Bek",79],["Raúl Albiol","DEF","Stoper",68],["Serge Aurier","DEF","Sağ Bek",75],["Kiko Femenía","DEF","Sağ Bek",71],["Pau Torres","DEF","Stoper",85],
      ["Dani Parejo","MID","Ön Libero",76],["Yeremy Pino","MID","Sağ Kanat",84],["Francis Coquelin","MID","Ön Libero",72],["Álex Baena","MID","Sol Kanat",83],["Samu Chukwueze","MID","Sağ Kanat",82],
      ["Gerard Moreno","FWD","İkinci Forvet",79],["Thierno Barry","FWD","Santrafor",73],["Arnaut Danjuma","FWD","Sol Kanat",80],["Ayoze Pérez","FWD","Sağ Kanat",78],
    ]),
  },
  {
    id: "SEV", name: "Sevilla", flag: "🇪🇸", league: "La Liga", color: "#D40000", secondaryColor: "#FFFFFF", apiId: 536,
    players: mkPlayers("SEV", [
      ["Orjan Nyland","GK","Kaleci",76],["Álvaro Fernández","GK","Kaleci",77],
      ["Nianzou Kouassi","DEF","Stoper",81],["Loïc Badé","DEF","Stoper",82],["Adrià Pedrosa","DEF","Sol Bek",78],["Marcos Acuña","DEF","Sol Bek",77],["Juanlu Sánchez","DEF","Sağ Bek",79],
      ["Lucien Agoumé","MID","Ön Libero",79],["Dodi Lukébakio","MID","Sağ Kanat",79],["Oliver Torres","MID","Orta Saha",78],["Suso","MID","Sol Kanat",76],["Óliver Torres","MID","Ofansif OS",78],
      ["Chidera Ejuke","FWD","Sol Kanat",78],["Isaac Romero","FWD","Santrafor",81],["Peque","FWD","Sağ Kanat",73],["Jesé","FWD","İkinci Forvet",58],
    ]),
  },
  {
    id: "BET", name: "Real Betis", flag: "🇪🇸", league: "La Liga", color: "#00954B", secondaryColor: "#FFFFFF", apiId: 543,
    players: mkPlayers("BET", [
      ["Rui Silva","GK","Kaleci",80],["Fran Vieites","GK","Kaleci",72],
      ["Natan","DEF","Stoper",79],["Ricardo Rodríguez","DEF","Sol Bek",76],["Juan Miranda","DEF","Sol Bek",79],["Youssouf Sabaly","DEF","Sağ Bek",76],["Marc Bartra","DEF","Stoper",72],
      ["Sergi Altimira","MID","Ön Libero",75],["Johnny Cardoso","MID","Ön Libero",82],["Pablo Fornals","MID","Sol Kanat",80],["Isco","MID","Ofansif OS",79],["Lo Celso","MID","Orta Saha",84],
      ["Vitor Roque","FWD","Santrafor",86],["Chimy Ávila","FWD","İkinci Forvet",79],["Juanmi","FWD","Sağ Kanat",77],["Assane Diao","FWD","Sol Kanat",80],
    ]),
  },
  {
    id: "ATH", name: "Athletic Bilbao", flag: "🇪🇸", league: "La Liga", color: "#EE2020", secondaryColor: "#FFFFFF", apiId: 531,
    players: mkPlayers("ATH", [
      ["Unai Simón","GK","Kaleci",87],["Julen Agirrezabala","GK","Kaleci",80],
      ["Óscar de Marcos","DEF","Sağ Bek",70],["Dani Vivian","DEF","Stoper",84],["Yeray Álvarez","DEF","Stoper",82],["Iñigo Lekue","DEF","Sağ Bek",77],["Álex Petxarroman","DEF","Sol Bek",72],["Andoni Gorosabel","DEF","Sağ Bek",79],
      ["Mikel Vesga","MID","Ön Libero",78],["Oihan Sancet","MID","Ofansif OS",86],["Dani García","MID","Ön Libero",70],["Beñat Prados","MID","Orta Saha",77],["Nico Williams","MID","Sol Kanat",89],
      ["Gorka Guruzeta","FWD","Santrafor",79],["Iñaki Williams","FWD","Sol Kanat",83],["Mikel Jauregizar","FWD","İkinci Forvet",67],["Adama Boiro","FWD","Sağ Kanat",67],
    ]),
  },
  {
    id: "RSO", name: "Real Sociedad", flag: "🇪🇸", league: "La Liga", color: "#0067B1", secondaryColor: "#FFFFFF", apiId: 548,
    players: mkPlayers("RSO", [
      ["Álex Remiro","GK","Kaleci",86],["Unai Marrero","GK","Kaleci",78],
      ["Aritz Elustondo","DEF","Stoper",79],["Igor Zubeldia","DEF","Stoper",84],["Aihen Muñoz","DEF","Sol Bek",78],["Jon Aramburu","DEF","Sağ Bek",77],["Hamari Traoré","DEF","Sağ Bek",76],
      ["Brais Méndez","MID","Sol Kanat",85],["Beñat Turrientes","MID","Ön Libero",79],["Ander Barrenetxea","MID","Sol Kanat",83],["Pablo Marín","MID","Orta Saha",76],["Jon Pacheco","MID","Orta Saha",79],
      ["Takefusa Kubo","FWD","Sağ Kanat",88],["Sheraldo Becker","FWD","Sol Kanat",78],["Umar Sadiq","FWD","Santrafor",77],["Orri Óskarsson","FWD","Santrafor",76],
    ]),
  },
  {
    id: "OSA", name: "Osasuna", flag: "🇪🇸", league: "La Liga", color: "#C4122F", secondaryColor: "#002A5B", apiId: 727,
    players: mkPlayers("OSA", [
      ["Sergio Herrera","GK","Kaleci",79],["Aitor Fernández","GK","Kaleci",76],
      ["Unai García","DEF","Stoper",78],["David García","DEF","Stoper",82],["Juan Cruz","DEF","Sol Bek",77],["Nacho Vidal","DEF","Sağ Bek",77],["Moi Gómez","DEF","Sol Bek",79],
      ["Lucas Torró","MID","Ön Libero",81],["Iker Muñoz","MID","Orta Saha",77],["Rubén García","MID","Sol Kanat",78],["Aimar Oroz","MID","Ofansif OS",81],["Abde Ezzalzouli","MID","Sol Kanat",83],
      ["Kike García","FWD","Santrafor",68],["Bryan Zaragoza","FWD","Sağ Kanat",85],["Chimy Ávila","FWD","İkinci Forvet",79],["Ante Budimir","FWD","Santrafor",75],
    ]),
  },
  {
    id: "GIR2", name: "Girona", flag: "🇪🇸", league: "La Liga", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 547,
    players: mkPlayers("GIR2", [
      ["Paulo Gazzaniga","GK","Kaleci",77],["Astralaga","GK","Kaleci",70],
      ["Yangel Herrera","DEF","Stoper",81],["Daley Blind","DEF","Stoper",69],["Miguel Gutiérrez","DEF","Sol Bek",85],["Arnau Martínez","DEF","Sağ Bek",83],["David López","DEF","Stoper",69],
      ["Oriol Romeu","MID","Ön Libero",75],["Iván Martín","MID","Orta Saha",79],["Viktor Tsygankov","MID","Sol Kanat",84],["Bryan Gil","MID","Sol Kanat",79],["Jhon Solis","MID","Sağ Kanat",76],
      ["Cristhian Stuani","FWD","Santrafor",60],["Abel Ruiz","FWD","İkinci Forvet",78],["Bojan Miovski","FWD","Santrafor",77],["Yasser Larouci","FWD","Sol Kanat",73],
    ]),
  },
  {
    id: "CEL", name: "Celta Vigo", flag: "🇪🇸", league: "La Liga", color: "#75AADB", secondaryColor: "#FFFFFF", apiId: 538,
    players: mkPlayers("CEL", [
      ["Iván Villar","GK","Kaleci",75],["Guaita","GK","Kaleci",60],
      ["Kevin Vázquez","DEF","Sağ Bek",69],["Aidoo","DEF","Stoper",77],["Carl Starfelt","DEF","Stoper",76],["Jailson","DEF","Sol Bek",75],["Alfonso Espino","DEF","Sol Bek",73],
      ["Fran Beltrán","MID","Ön Libero",79],["Marcos Alonso","DEF","Sol Bek",68],["Jonathan Bamba","MID","Sol Kanat",80],["Williot Swedberg","MID","Sağ Kanat",76],["Gabri Veiga","MID","Ofansif OS",85],
      ["Iago Aspas","FWD","İkinci Forvet",60],["Carles Pérez","FWD","Sağ Kanat",78],["Borja Iglesias","FWD","Santrafor",79],["Jørgen Strand Larsen","FWD","Santrafor",78],
    ]),
  },
  {
    id: "MAL", name: "Mallorca", flag: "🇪🇸", league: "La Liga", color: "#CC0000", secondaryColor: "#FFD700", apiId: 798,
    players: mkPlayers("MAL", [
      ["Leo Román","GK","Kaleci",75],["Predrag Rajković","GK","Kaleci",79],
      ["Martin Valjent","DEF","Stoper",76],["Brian Oliván","DEF","Sol Bek",74],["Pablo Maffeo","DEF","Sağ Bek",78],["Antonio Raíllo","DEF","Stoper",70],["Matija Nastasić","DEF","Stoper",73],
      ["Iddrisu Baba","MID","Ön Libero",76],["Dani Rodríguez","MID","Sağ Kanat",58],["Samú Costa","MID","Orta Saha",77],["Sergi Darder","MID","Ofansif OS",79],["Cyle Larin","FWD","Santrafor",77],
      ["Vedat Muriqi","FWD","Santrafor",79],["Abdón Prats","FWD","İkinci Forvet",68],["Lago Junior","FWD","Sol Kanat",58],["Abdon Prats","FWD","Santrafor",68],
    ]),
  },
  {
    id: "RBT", name: "Rayo Vallecano", flag: "🇪🇸", league: "La Liga", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 728,
    players: mkPlayers("RBT", [
      ["Stole Dimitrievski","GK","Kaleci",79],["Sergio Contreras","GK","Kaleci",60],
      ["Fran García","DEF","Sol Bek",86],["Alejandro Catena","DEF","Stoper",77],["Florian Lejeune","DEF","Stoper",70],["Iván Balliu","DEF","Sağ Bek",72],["Jordi Amat","DEF","Stoper",60],
      ["Isi Palazón","MID","Sol Kanat",80],["Oscar Trejo","MID","Ofansif OS",55],["Randy","MID","Orta Saha",58],["Álvaro García","MID","Sağ Kanat",76],["Unai López","MID","Ön Libero",78],
      ["Raúl de Tomás","FWD","Santrafor",80],["Jorge De Frutos","FWD","Sağ Kanat",79],["Sergio Camello","FWD","İkinci Forvet",79],["Pathé Ciss","FWD","Sol Kanat",77],
    ]),
  },
  {
    id: "ALA", name: "Alavés", flag: "🇪🇸", league: "La Liga", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 542,
    players: mkPlayers("ALA", [
      ["Antonio Sivera","GK","Kaleci",78],["Rovaneta","GK","Kaleci",58],
      ["Manu Sánchez","DEF","Sol Bek",82],["Abqar","DEF","Stoper",79],["Mouriño","DEF","Stoper",81],["Nahuel Tenaglia","DEF","Sağ Bek",78],["Adrián Marín","DEF","Kanat Bek",77],
      ["Javi López","MID","Orta Saha",79],["Tomás Conechny","MID","Orta Saha",76],["Guridi","MID","Ön Libero",79],["Jon Guridi","MID","Ön Libero",79],["Theo Zidane","MID","Sol Kanat",80],
      ["Carlos Vicente","FWD","Sol Kanat",77],["Kike García","FWD","Santrafor",68],["Luis Rioja","FWD","Sağ Kanat",78],["Mamadou Sylla","FWD","İkinci Forvet",75],
    ]),
  },
  {
    id: "GET", name: "Getafe", flag: "🇪🇸", league: "La Liga", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 546,
    players: mkPlayers("GET", [
      ["David Soria","GK","Kaleci",81],["Guaita","GK","Kaleci",60],
      ["Damián Suárez","DEF","Sağ Bek",65],["Omar Alderete","DEF","Stoper",80],["Djené","DEF","Stoper",79],["Stefan Ristovski","DEF","Sağ Bek",76],["Juan Iglesias","DEF","Sol Bek",78],
      ["Mauro Arambarri","MID","Ön Libero",82],["Carles Aleñá","MID","Orta Saha",81],["Óscar Rodríguez","MID","Ofansif OS",79],["Okay Yokuslu","MID","Ön Libero",77],["Coba","MID","Sağ Kanat",70],
      ["Juanmi Latasa","FWD","Santrafor",79],["Jaime Mata","FWD","İkinci Forvet",66],["Enes Ünal","FWD","Santrafor",82],["Munir El Haddadi","FWD","Sol Kanat",73],
    ]),
  },
  {
    id: "LEG", name: "Leganés", flag: "🇪🇸", league: "La Liga", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 537,
    players: mkPlayers("LEG", [
      ["Marko Dmitrović","GK","Kaleci",76],["Álvaro Fernández","GK","Kaleci",77],
      ["Sergio González","DEF","Stoper",68],["Unai Núñez","DEF","Stoper",79],["Franquesa","DEF","Sol Bek",70],["Jorge Sáenz","DEF","Sağ Bek",76],["David Villanueva","DEF","Kanat Bek",67],
      ["Roger Assalé","MID","Sol Kanat",66],["Selim Amallah","MID","Ofansif OS",78],["Yvan Neyou","MID","Ön Libero",72],["René","MID","Orta Saha",65],["Darko Brasanac","MID","Orta Saha",69],
      ["Miguel de la Fuente","FWD","Sol Kanat",77],["Manu García","FWD","Sağ Kanat",71],["Ante Budimir","FWD","Santrafor",75],["Sergio Camello","FWD","Santrafor",79],
    ]),
  },
  {
    id: "VAL", name: "Valencia", flag: "🇪🇸", league: "La Liga", color: "#FF8000", secondaryColor: "#FFFFFF", apiId: 532,
    players: mkPlayers("VAL", [
      ["Stole Dimitrievski","GK","Kaleci",79],["Jaume Doménech","GK","Kaleci",68],
      ["Thierry Correia","DEF","Sağ Bek",80],["Gabriel Paulista","DEF","Stoper",70],["Cenk Özkaçar","DEF","Stoper",77],["José Gayà","DEF","Sol Bek",85],["Cristhian Mosquera","DEF","Stoper",81],
      ["Javi Guerra","MID","Ön Libero",83],["Pepelu","MID","Orta Saha",82],["Hugo Guillamon","MID","Ön Libero",79],["Jesús Vázquez","DEF","Sol Bek",76],["Rafa Mir","FWD","Santrafor",75],
      ["Hugo Duro","FWD","Santrafor",78],["Diego López","FWD","Sağ Kanat",81],["Dani Gómez","FWD","Sol Kanat",69],["Romain Faivre","FWD","Sol Kanat",73],
    ]),
  },
  {
    id: "LPA", name: "Las Palmas", flag: "🇪🇸", league: "La Liga", color: "#FFCC00", secondaryColor: "#0033CC", apiId: 534,
    players: mkPlayers("LPA", [
      ["Álvaro Valles","GK","Kaleci",83],["Raúl Fernández","GK","Kaleci",66],
      ["Álex Suárez","DEF","Sol Bek",75],["Mika Mármol","DEF","Stoper",80],["Óscar Climent","DEF","Stoper",62],["Álex González","DEF","Sağ Bek",62],["Diego Suárez","DEF","Kanat Bek",62],
      ["Kirian Rodríguez","MID","Ön Libero",80],["Alberto Moleiro","MID","Sol Kanat",84],["Jonathan Viera","MID","Ofansif OS",63],["Marvin Park","MID","Sağ Kanat",74],["Imran Louza","MID","Ön Libero",77],
      ["Munir El Haddadi","FWD","Sol Kanat",73],["Marc Cardona","FWD","Santrafor",74],["Fabio Silva","FWD","Santrafor",78],["Matheus Pereira","FWD","İkinci Forvet",80],
    ]),
  },
  // ── BUNDESLİGA 2025-26 ──────────────────────────────────────────────────────
  {
    id: "BAY", name: "Bayern München", flag: "🇩🇪", league: "Bundesliga", color: "#DC052D", secondaryColor: "#0066B2", apiId: 157,
    players: mkPlayers("BAY", [
      ["Manuel Neuer","GK","Kaleci",84],["Sven Ulreich","GK","Kaleci",74],
      ["Alphonso Davies","DEF","Sol Bek",86],["Dayot Upamecano","DEF","Stoper",85],["Min-jae Kim","DEF","Stoper",85],["Jonathan Tah","DEF","Stoper",83],["Hiroki Ito","DEF","Sol Bek",81],["Joshua Kimmich","DEF","Sağ Bek",87],["Konrad Laimer","DEF","Sağ Bek",83],
      ["Jamal Musiala","MID","Ofansif OS",90],["Leon Goretzka","MID","Orta Saha",84],["João Palhinha","MID","Ön Libero",84],["Michael Olise","MID","Sağ Kanat",86],["Serge Gnabry","MID","Sol Kanat",83],["Aleksandar Pavlovic","MID","Orta Saha",82],
      ["Harry Kane","FWD","Santrafor",90],["Mathys Tel","FWD","Sol Kanat",84],["Arijon Ibrahimovic","FWD","İkinci Forvet",73],["Gabriel Vidovic","FWD","Sağ Kanat",74],
    ]),
  },
  {
    id: "LEV", name: "Bayer Leverkusen", flag: "🇩🇪", league: "Bundesliga", color: "#E32221", secondaryColor: "#000000", apiId: 168,
    players: mkPlayers("LEV", [
      ["Lukáš Hrádecký","GK","Kaleci",77],["Matej Kovař","GK","Kaleci",76],
      ["Odilon Kossounou","DEF","Stoper",83],["Edmond Tapsoba","DEF","Stoper",85],["Piero Hincapié","DEF","Sol Bek",85],["Alejandro Grimaldo","DEF","Sol Bek",86],["Josip Stanisic","DEF","Sağ Bek",81],["Norbert Gyömbér","DEF","Stoper",71],
      ["Granit Xhaka","MID","Ön Libero",85],["Robert Andrich","MID","Ön Libero",82],["Exequiel Palacios","MID","Orta Saha",86],["Martin Terrier","MID","Sağ Kanat",80],["Aleix García","MID","Orta Saha",84],
      ["Victor Boniface","FWD","Santrafor",87],["Patrik Schick","FWD","Santrafor",84],["Adam Hlozek","FWD","Sol Kanat",79],["Jonas Wind","FWD","İkinci Forvet",79],
    ]),
  },
  {
    id: "DOR", name: "Borussia Dortmund", flag: "🇩🇪", league: "Bundesliga", color: "#FDE100", secondaryColor: "#000000", apiId: 165,
    players: mkPlayers("DOR", [
      ["Gregor Kobel","GK","Kaleci",89],["Alexander Meyer","GK","Kaleci",74],
      ["Nico Schlotterbeck","DEF","Stoper",86],["Niklas Süle","DEF","Stoper",83],["Waldemar Anton","DEF","Stoper",83],["Ramy Bensebaini","DEF","Sol Bek",78],["Julian Ryerson","DEF","Sağ Bek",81],["Pascal Groß","MID","Orta Saha",82],
      ["Marcel Sabitzer","MID","Orta Saha",82],["Emre Can","MID","Ön Libero",80],["Julian Brandt","MID","Ofansif OS",86],["Felix Nmecha","MID","Orta Saha",80],["Giovanni Reyna","MID","Sol Kanat",80],
      ["Serhou Guirassy","FWD","Santrafor",86],["Karim Adeyemi","FWD","Sol Kanat",85],["Jamie Gittens","FWD","Sağ Kanat",80],["Maximilian Beier","FWD","İkinci Forvet",82],
    ]),
  },
  {
    id: "RBL", name: "RB Leipzig", flag: "🇩🇪", league: "Bundesliga", color: "#DD0741", secondaryColor: "#FFFFFF", apiId: 173,
    players: mkPlayers("RBL", [
      ["Peter Gulácsi","GK","Kaleci",76],["Janis Blaswich","GK","Kaleci",75],
      ["Willi Orbán","DEF","Stoper",81],["David Raum","DEF","Sol Bek",84],["Mohamed Simakan","DEF","Sağ Bek",86],["Castello Lukeba","DEF","Stoper",85],["Lukas Klostermann","DEF","Sağ Bek",79],
      ["Kevin Kampl","MID","Ön Libero",75],["Xavi Simons","MID","Ofansif OS",91],["Christoph Baumgartner","MID","Sol Kanat",83],["Antonio Nusa","MID","Sağ Kanat",82],["Nicolas Seiwald","MID","Ön Libero",81],
      ["Lois Openda","FWD","Santrafor",87],["Benjamin Šeško","FWD","Santrafor",86],["Yussuf Poulsen","FWD","İkinci Forvet",77],["Timo Werner","FWD","Sol Kanat",78],
    ]),
  },
  {
    id: "EIN", name: "Eintracht Frankfurt", flag: "🇩🇪", league: "Bundesliga", color: "#E1000F", secondaryColor: "#000000", apiId: 169,
    players: mkPlayers("EIN", [
      ["Kevin Trapp","GK","Kaleci",82],["Kaua Santos","GK","Kaleci",68],
      ["Tuta","DEF","Stoper",79],["Robin Koch","DEF","Stoper",80],["Aurelio Buta","DEF","Sağ Bek",77],["Philipp Max","DEF","Sol Bek",76],["Nnamdi Collins","DEF","Kanat Bek",76],
      ["Hugo Larsson","MID","Orta Saha",85],["Ellyes Skhiri","MID","Ön Libero",82],["Can Uzun","MID","Ofansif OS",84],["Farès Chaibi","MID","Sol Kanat",83],["Nathaniel Brown","MID","Sağ Kanat",73],
      ["Ansgar Knauff","FWD","Sağ Kanat",79],["Omar Marmoush","FWD","İkinci Forvet",84],["Junior Dina Ebimbe","FWD","Sol Kanat",80],["Ragnar Ache","FWD","Santrafor",77],
    ]),
  },
  {
    id: "STU", name: "VfB Stuttgart", flag: "🇩🇪", league: "Bundesliga", color: "#E32221", secondaryColor: "#FFFFFF", apiId: 172,
    players: mkPlayers("STU", [
      ["Alexander Nübel","GK","Kaleci",83],["Florian Müller","GK","Kaleci",75],
      ["Dan-Axel Zagadou","DEF","Stoper",80],["Maximilian Mittelstädt","DEF","Sol Bek",84],["Pascal Stenzel","DEF","Sağ Bek",76],["Leonidas Stergiou","DEF","Stoper",74],["Jeff Chabot","DEF","Stoper",79],
      ["Atakan Karazor","MID","Ön Libero",81],["Angelo Stiller","MID","Ön Libero",85],["Enzo Millot","MID","Orta Saha",84],["Chris Führich","MID","Sol Kanat",84],["Aster Vranckx","MID","Orta Saha",78],
      ["Deniz Undav","FWD","İkinci Forvet",86],["Nick Woltemade","FWD","Santrafor",72],["Ermedin Demirović","FWD","Santrafor",82],["El Bilal Touré","FWD","Sol Kanat",84],
    ]),
  },
  {
    id: "WOB", name: "VfL Wolfsburg", flag: "🇩🇪", league: "Bundesliga", color: "#65B32E", secondaryColor: "#004591", apiId: 161,
    players: mkPlayers("WOB", [
      ["Kamil Grabara","GK","Kaleci",84],["Pavao Pervan","GK","Kaleci",68],
      ["Ridle Baku","DEF","Sağ Bek",81],["Maxence Lacroix","DEF","Stoper",85],["Sebastiaan Bornauw","DEF","Stoper",79],["Paulo Otavio","DEF","Sol Bek",77],["Bartol Franjic","DEF","Kanat Bek",76],
      ["Yannick Gerhardt","MID","Ön Libero",78],["Lovro Majer","MID","Orta Saha",86],["Patrick Wimmer","MID","Sol Kanat",83],["Maximilian Arnold","MID","Orta Saha",82],["Mattias Svanberg","MID","Sağ Kanat",77],
      ["Mohamed Amoura","FWD","Sol Kanat",85],["Tiago Tomás","FWD","Santrafor",78],["Lukas Nmecha","FWD","İkinci Forvet",84],["Jonas Wind","FWD","Santrafor",79],
    ]),
  },
  {
    id: "BMG", name: "M'gladbach", flag: "🇩🇪", league: "Bundesliga", color: "#000000", secondaryColor: "#FFFFFF", apiId: 163,
    players: mkPlayers("BMG", [
      ["Moritz Nicolas","GK","Kaleci",75],["Jonas Omlin","GK","Kaleci",81],
      ["Nico Elvedi","DEF","Stoper",83],["Luca Netz","DEF","Sol Bek",80],["Stefan Lainer","DEF","Sağ Bek",72],["Marvin Friedrich","DEF","Stoper",77],["Joe Scally","DEF","Sağ Bek",79],
      ["Manu Koné","MID","Orta Saha",83],["Florian Neuhaus","MID","Orta Saha",82],["Kouadio Koné","MID","Ön Libero",87],["Patrick Herrmann","MID","Sağ Kanat",67],["Rocco Reitz","MID","Sol Kanat",80],
      ["Tim Kleindienst","FWD","Santrafor",76],["Tomas Cvancara","FWD","İkinci Forvet",79],["Nathan Ngoumou","FWD","Sol Kanat",77],["Alassane Pléa","FWD","Santrafor",74],
    ]),
  },
  {
    id: "FRE", name: "SC Freiburg", flag: "🇩🇪", league: "Bundesliga", color: "#CC0000", secondaryColor: "#000000", apiId: 160,
    players: mkPlayers("FRE", [
      ["Noah Atubolu","GK","Kaleci",80],["Mark Flekken","GK","Kaleci",80],
      ["Lukas Kübler","DEF","Sağ Bek",71],["Philipp Lienhart","DEF","Stoper",81],["Kiliann Sildillia","DEF","Sağ Bek",79],["Christian Günter","DEF","Sol Bek",75],["Matthias Ginter","DEF","Stoper",81],
      ["Nicolas Höfler","MID","Ön Libero",68],["Vincenzo Grifo","MID","Sol Kanat",77],["Ritsu Doan","MID","Sağ Kanat",80],["Roland Sallai","MID","Sağ Kanat",81],["Merlin Röhl","MID","Orta Saha",77],
      ["Michael Gregoritsch","FWD","Santrafor",75],["Junior Adamu","FWD","Sol Kanat",76],["Noah Weißhaupt","FWD","Sağ Kanat",77],["Eren Dinkçi","FWD","İkinci Forvet",78],
    ]),
  },
  {
    id: "HOF", name: "Hoffenheim", flag: "🇩🇪", league: "Bundesliga", color: "#1257AF", secondaryColor: "#FFFFFF", apiId: 167,
    players: mkPlayers("HOF", [
      ["Oliver Baumann","GK","Kaleci",76],["Luca Philipp","GK","Kaleci",69],
      ["Kevin Vogt","DEF","Stoper",69],["Pavel Kadeřábek","DEF","Sağ Bek",71],["Angeliño","DEF","Sol Bek",79],["Ozan Kabak","DEF","Stoper",79],["David Jurásek","DEF","Sol Bek",79],
      ["Dennis Geiger","MID","Orta Saha",81],["Andrej Kramarić","MID","Ofansif OS",79],["Tom Bischof","MID","Sol Kanat",78],["Grischa Prömel","MID","Ön Libero",78],["Jacob Bruun Larsen","MID","Sağ Kanat",77],
      ["Wout Weghorst","FWD","Santrafor",77],["Marius Bülter","FWD","Sol Kanat",75],["Adam Čiliak","FWD","İkinci Forvet",62],["Sargis Adamyan","FWD","Sağ Kanat",73],
    ]),
  },
  {
    id: "MAI", name: "FSV Mainz 05", flag: "🇩🇪", league: "Bundesliga", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 164,
    players: mkPlayers("MAI", [
      ["Robin Zentner","GK","Kaleci",80],["Finn Dahmen","GK","Kaleci",78],
      ["Andreas Hanche-Olsen","DEF","Stoper",78],["Alexander Hack","DEF","Stoper",74],["Silvan Widmer","DEF","Sağ Bek",77],["Aaron Martin","DEF","Sol Bek",78],["Philipp Mwene","DEF","Kanat Bek",75],
      ["Leandro Barreiro","MID","Ön Libero",81],["Dominik Kohr","MID","Ön Libero",76],["Karim Onisiwo","MID","Sol Kanat",75],["Paul Nebel","MID","Sağ Kanat",76],["Jonathan Burkardt","MID","Ofansif OS",82],
      ["Ludovic Ajorque","FWD","Santrafor",76],["Nelson Weiper","FWD","İkinci Forvet",77],["Jae-sung Lee","FWD","Sol Kanat",76],["Aymen Barkok","FWD","Sağ Kanat",72],
    ]),
  },
  {
    id: "AUG", name: "FC Augsburg", flag: "🇩🇪", league: "Bundesliga", color: "#BA3733", secondaryColor: "#007B3D", apiId: 170,
    players: mkPlayers("AUG", [
      ["Finn Dahmen","GK","Kaleci",78],["Tomas Koubek","GK","Kaleci",68],
      ["Maximilian Bauer","DEF","Stoper",77],["Felix Uduokhai","DEF","Stoper",79],["Robert Gumny","DEF","Sağ Bek",76],["Iago","DEF","Sol Bek",78],["Elvis Rexhbecaj","DEF","Kanat Bek",77],
      ["Niklas Dorsch","MID","Ön Libero",79],["Fredrik Jensen","MID","Orta Saha",70],["Ruben Vargas","MID","Sol Kanat",80],["Tim Civeja","MID","Orta Saha",68],["Kristijan Jakić","MID","Ön Libero",79],
      ["Ermedin Demirović","FWD","Santrafor",82],["Phillip Tietz","FWD","İkinci Forvet",76],["Mergim Berisha","FWD","Sağ Kanat",81],["Samuel Essende","FWD","Sol Kanat",69],
    ]),
  },
  {
    id: "UNB", name: "Union Berlin", flag: "🇩🇪", league: "Bundesliga", color: "#EB1923", secondaryColor: "#FFFFFF", apiId: 182,
    players: mkPlayers("UNB", [
      ["Frederik Rönnow","GK","Kaleci",82],["Lennart Grill","GK","Kaleci",70],
      ["Robin Knoche","DEF","Stoper",79],["Diogo Leite","DEF","Stoper",81],["Josip Juranović","DEF","Sağ Bek",80],["Rani Khedira","DEF","Kanat Bek",80],["Niko Gießelmann","DEF","Sol Bek",67],
      ["Andras Schäfer","MID","Ön Libero",79],["Miloš Pantović","MID","Orta Saha",71],["Janik Haberer","MID","Sol Kanat",79],["Tim Skarke","MID","Sağ Kanat",77],["Yorbe Vertessen","MID","Ofansif OS",78],
      ["Kevin Volland","FWD","İkinci Forvet",76],["Benedict Hollerbach","FWD","Sol Kanat",74],["Tom Rothe","FWD","Sağ Kanat",78],["Jordan Siebatcheu","FWD","Santrafor",75],
    ]),
  },
  // ── SERİE A 2025-26 ─────────────────────────────────────────────────────────
  {
    id: "INT", name: "Inter Milan", flag: "🇮🇹", league: "Serie A", color: "#003DA5", secondaryColor: "#000000", apiId: 505,
    players: mkPlayers("INT", [
      ["Yann Sommer","GK","Kaleci",79],["Josep Martínez","GK","Kaleci",81],
      ["Alessandro Bastoni","DEF","Stoper",89],["Benjamin Pavard","DEF","Sağ Bek",87],["Francesco Acerbi","DEF","Stoper",76],["Matteo Darmian","DEF","Sağ Bek",75],["Denzel Dumfries","DEF","Sağ Bek",83],["Federico Dimarco","DEF","Sol Bek",87],["Yann Aurel Bisseck","DEF","Stoper",81],
      ["Nicolò Barella","MID","Orta Saha",90],["Henrikh Mkhitaryan","MID","Ofansif OS",76],["Kristjan Asllani","MID","Ön Libero",81],["Davide Frattesi","MID","Orta Saha",85],["Piotr Zielinski","MID","Orta Saha",84],
      ["Lautaro Martínez","FWD","Santrafor",91],["Marcus Thuram","FWD","Santrafor",86],["Mehdi Taremi","FWD","İkinci Forvet",78],["Joaquín Correa","FWD","Sol Kanat",75],
    ]),
  },
  {
    id: "JUV", name: "Juventus", flag: "🇮🇹", league: "Serie A", color: "#000000", secondaryColor: "#FFFFFF", apiId: 496,
    players: mkPlayers("JUV", [
      ["Michele Di Gregorio","GK","Kaleci",83],["Carlo Pinsoglio","GK","Kaleci",68],
      ["Andrea Cambiaso","DEF","Sağ Bek",80],["Federico Gatti","DEF","Stoper",79],["Gleison Bremer","DEF","Stoper",86],["Danilo","DEF","Sağ Bek",80],["Nicolò Savona","DEF","Sağ Bek",67],["Juan Cabal","DEF","Sol Bek",76],
      ["Manuel Locatelli","MID","Ön Libero",83],["Douglas Luiz","MID","Orta Saha",85],["Khéphren Thuram","MID","Ön Libero",85],["Teun Koopmeiners","MID","Ofansif OS",86],["Weston McKennie","MID","Orta Saha",79],
      ["Dušan Vlahović","FWD","Santrafor",87],["Timothy Weah","FWD","Sağ Kanat",77],["Francisco Conceição","FWD","Sol Kanat",80],["Nico González","FWD","İkinci Forvet",84],
    ]),
  },
  {
    id: "MIL", name: "AC Milan", flag: "🇮🇹", league: "Serie A", color: "#FB090B", secondaryColor: "#000000", apiId: 489,
    players: mkPlayers("MIL", [
      ["Mike Maignan","GK","Kaleci",90],["Marco Sportiello","GK","Kaleci",73],
      ["Davide Calabria","DEF","Sağ Bek",80],["Malick Thiaw","DEF","Stoper",81],["Matteo Gabbia","DEF","Stoper",76],["Theo Hernández","DEF","Sol Bek",90],["Emerson Royal","DEF","Sağ Bek",79],["Strahinja Pavlović","DEF","Stoper",83],
      ["Tijjani Reijnders","MID","Orta Saha",84],["Luka Modrić","MID","Orta Saha",68],["Ruben Loftus-Cheek","MID","Ön Libero",85],["Samuel Chukwueze","MID","Sağ Kanat",79],["Rafael Leão","MID","Sol Kanat",89],
      ["Tammy Abraham","FWD","Santrafor",80],["Christian Pulisic","FWD","Sağ Kanat",83],["Luka Jović","FWD","İkinci Forvet",77],["Noah Okafor","FWD","Sol Kanat",78],
    ]),
  },
  {
    id: "NAP", name: "Napoli", flag: "🇮🇹", league: "Serie A", color: "#087AC1", secondaryColor: "#FFFFFF", apiId: 492,
    players: mkPlayers("NAP", [
      ["Alex Meret","GK","Kaleci",83],["Elia Caprile","GK","Kaleci",76],
      ["Giovanni Di Lorenzo","DEF","Sağ Bek",84],["Amir Rrahmani","DEF","Stoper",81],["Alessandro Buongiorno","DEF","Stoper",84],["Leonardo Spinazzola","DEF","Sol Bek",79],["Mathías Olivera","DEF","Sol Bek",80],["Pasquale Mazzocchi","DEF","Sağ Bek",78],
      ["Stanislav Lobotka","MID","Ön Libero",85],["André Frank Zambo Anguissa","MID","Orta Saha",86],["Scott McTominay","MID","Orta Saha",82],["Giacomo Raspadori","MID","Ofansif OS",83],["Khvicha Kvaratskhelia","MID","Sol Kanat",90],
      ["Kevin De Bruyne","MID","Ofansif OS",88],["Giovanni Simeone","FWD","Santrafor",79],["David Neres","FWD","Sağ Kanat",81],["Cyril Ngonge","FWD","Sol Kanat",78],
    ]),
  },
  {
    id: "ROM", name: "AS Roma", flag: "🇮🇹", league: "Serie A", color: "#8B0000", secondaryColor: "#FFD700", apiId: 497,
    players: mkPlayers("ROM", [
      ["Mile Svilar","GK","Kaleci",82],["Łukasz Skorupski","GK","Kaleci",79],
      ["Gianluca Mancini","DEF","Stoper",84],["Mario Hermoso","DEF","Stoper",83],["Angeliño","DEF","Sol Bek",79],["Zeki Çelik","DEF","Sağ Bek",77],["Devyne Rensch","DEF","Sağ Bek",79],["Rui Patrício","GK","Kaleci",68],
      ["Leandro Paredes","MID","Ön Libero",80],["Manu Koné","MID","Orta Saha",83],["Lorenzo Pellegrini","MID","Ofansif OS",84],["Nicola Zalewski","MID","Sol Kanat",79],["Tommaso Baldanzi","MID","Orta Saha",81],
      ["Paulo Dybala","FWD","İkinci Forvet",86],["Artem Dovbyk","FWD","Santrafor",83],["Eldor Shomurodov","FWD","Santrafor",72],["Stephan El Shaarawy","FWD","Sol Kanat",77],
    ]),
  },
  {
    id: "LAZ", name: "Lazio", flag: "🇮🇹", league: "Serie A", color: "#87D8F7", secondaryColor: "#FFFFFF", apiId: 487,
    players: mkPlayers("LAZ", [
      ["Ivan Provedel","GK","Kaleci",83],["Christos Mandas","GK","Kaleci",76],
      ["Mario Gila","DEF","Stoper",78],["Nicolò Casale","DEF","Stoper",79],["Patric","DEF","Sağ Bek",77],["Luca Pellegrini","DEF","Sol Bek",76],["Adam Marusic","DEF","Sağ Bek",77],["Nuno Tavares","DEF","Sol Bek",71],
      ["Mattia Zaccagni","MID","Sol Kanat",83],["Daichi Kamada","MID","Ofansif OS",81],["Fisayo Dele-Bashiru","MID","Orta Saha",78],["Rovella","MID","Ön Libero",84],["Gustav Isaksen","MID","Sağ Kanat",80],
      ["Taty Castellanos","FWD","Santrafor",79],["Pedro","FWD","Sol Kanat",68],["Ciro Immobile","FWD","Santrafor",68],["Loum Tchaouna","FWD","Sağ Kanat",77],
    ]),
  },
  {
    id: "FIO", name: "Fiorentina", flag: "🇮🇹", league: "Serie A", color: "#6A0DAD", secondaryColor: "#FFFFFF", apiId: 502,
    players: mkPlayers("FIO", [
      ["David de Gea","GK","Kaleci",83],["Pietro Terracciano","GK","Kaleci",75],
      ["Luca Ranieri","DEF","Sol Bek",78],["Lucas Quarta","DEF","Stoper",81],["Cristiano Biraghi","DEF","Sol Bek",70],["Dodô","DEF","Sağ Bek",84],["Michael Kayode","DEF","Sağ Bek",79],["Matías Moreno","DEF","Stoper",70],
      ["Rolando Mandragora","MID","Ön Libero",79],["Antonín Barák","MID","Orta Saha",78],["Nicolás González","MID","Sol Kanat",85],["Yacine Adli","MID","Orta Saha",77],["Albert Gudmundsson","MID","Ofansif OS",85],
      ["Moise Kean","FWD","Santrafor",79],["Jonathan Ikoné","FWD","Sağ Kanat",78],["Riccardo Sottil","FWD","Sol Kanat",77],["M'Bala Nzola","FWD","İkinci Forvet",73],
    ]),
  },
  {
    id: "ATA", name: "Atalanta", flag: "🇮🇹", league: "Serie A", color: "#1F8BC8", secondaryColor: "#000000", apiId: 499,
    players: mkPlayers("ATA", [
      ["Marco Carnesecchi","GK","Kaleci",84],["Juan Musso","GK","Kaleci",79],
      ["Rafael Tolói","DEF","Stoper",76],["Giorgio Scalvini","DEF","Stoper",87],["Berat Djimsiti","DEF","Stoper",78],["Matteo Ruggeri","DEF","Sol Bek",79],["Zappacosta","DEF","Sağ Bek",74],["Ben Godfrey","DEF","Kanat Bek",77],
      ["Éderson","MID","Ön Libero",85],["Marten de Roon","MID","Ön Libero",76],["Mario Pašalić","MID","Orta Saha",80],["Ademola Lookman","MID","Sol Kanat",84],["Charles De Ketelaere","MID","Ofansif OS",83],
      ["Gianluca Scamacca","FWD","Santrafor",83],["El Bilal Touré","FWD","İkinci Forvet",84],["Nicolò Zaniolo","FWD","Sağ Kanat",80],["Lázaro","FWD","Sol Kanat",73],
    ]),
  },
  {
    id: "BOL2", name: "Bologna", flag: "🇮🇹", league: "Serie A", color: "#E2001A", secondaryColor: "#003DA5", apiId: 500,
    players: mkPlayers("BOL2", [
      ["Lukasz Skorupski","GK","Kaleci",77],["Federico Ravaglia","GK","Kaleci",71],
      ["Jhon Lucumí","DEF","Stoper",79],["Sam Beukema","DEF","Stoper",79],["Lykogiannis","DEF","Sol Bek",73],["Wisdom Amey","DEF","Sağ Bek",70],["Nicola Sansone","DEF","Kanat Bek",66],
      ["Remo Freuler","MID","Ön Libero",76],["Lewis Ferguson","MID","Orta Saha",84],["Giovanni Fabbian","MID","Orta Saha",77],["Alexis Saelemaekers","MID","Sağ Kanat",80],["Nicolás Domínguez","MID","Sol Kanat",79],
      ["Joshua Zirkzee","FWD","İkinci Forvet",85],["Riccardo Orsolini","FWD","Sağ Kanat",81],["Dan Ndoye","FWD","Sol Kanat",78],["Jens Odgaard","FWD","Santrafor",72],
    ]),
  },
  {
    id: "TOR", name: "Torino", flag: "🇮🇹", league: "Serie A", color: "#8B1A1A", secondaryColor: "#FFFFFF", apiId: 586,
    players: mkPlayers("TOR", [
      ["Vanja Milinković-Savić","GK","Kaleci",79],["Luca Gemello","GK","Kaleci",69],
      ["Alessandro Buongiorno","DEF","Stoper",84],["Ricardo Rodriguez","DEF","Sol Bek",74],["Mergim Vojvoda","DEF","Sağ Bek",75],["Wilfried Singo","DEF","Sağ Bek",82],["Adam Masina","DEF","Sol Bek",75],["Perr Schuurs","DEF","Stoper",83],
      ["Sasa Lukic","MID","Ön Libero",77],["Karol Linetty","MID","Orta Saha",76],["Ivan Ilić","MID","Orta Saha",81],["Valentino Lazaro","MID","Sağ Kanat",76],["Samuele Ricci","MID","Ön Libero",81],
      ["Antonio Sanabria","FWD","Santrafor",77],["Duván Zapata","FWD","Santrafor",76],["Nemanja Radonjić","FWD","Sol Kanat",74],["Borna Sosa","FWD","Sol Bek",79],
    ]),
  },
  {
    id: "GEN", name: "Genoa", flag: "🇮🇹", league: "Serie A", color: "#D40000", secondaryColor: "#003DA5", apiId: 508,
    players: mkPlayers("GEN", [
      ["Josip Sutalo","GK","Kaleci",83],["Joseph Aidoo","GK","Kaleci",77],
      ["Stefano Sabelli","DEF","Sağ Bek",73],["Radu Drăgușin","DEF","Stoper",84],["Mattia Bani","DEF","Stoper",75],["Silvan Hefti","DEF","Sağ Bek",77],["Aaron Martin","DEF","Sol Bek",78],
      ["Manolo Portanova","MID","Orta Saha",76],["Malinovskyi","MID","Ofansif OS",79],["Morten Frendrup","MID","Ön Libero",83],["Massimo Badelj","MID","Ön Libero",68],["Ivan Ilić","MID","Orta Saha",81],
      ["Mateo Retegui","FWD","Santrafor",82],["Vitinha","FWD","İkinci Forvet",86],["Caleb Ekuban","FWD","Sağ Kanat",74],["Albert Gudmundsson","FWD","Sol Kanat",85],
    ]),
  },
  {
    id: "USS", name: "Udinese", flag: "🇮🇹", league: "Serie A", color: "#000000", secondaryColor: "#FFFFFF", apiId: 494,
    players: mkPlayers("USS", [
      ["Marco Silvestri","GK","Kaleci",77],["Simone Padelli","GK","Kaleci",58],
      ["Nehuén Pérez","DEF","Stoper",81],["Jaka Bijol","DEF","Stoper",79],["Destiny Udogie","DEF","Sol Bek",85],["Enzo Ebosse","DEF","Stoper",76],["Hassane Kamara","DEF","Sol Bek",77],
      ["Sandi Lovrić","MID","Orta Saha",79],["Lazar Samardžić","MID","Ofansif OS",84],["Walace","MID","Ön Libero",78],["Roberto Pereyra","MID","Sol Kanat",78],["Martin Payero","MID","Sağ Kanat",76],
      ["Lorenzo Lucca","FWD","Santrafor",78],["Florian Thauvin","FWD","Sağ Kanat",79],["Beto","FWD","İkinci Forvet",77],["Isaak Success","FWD","Sol Kanat",75],
    ]),
  },
  {
    id: "EMP", name: "Empoli", flag: "🇮🇹", league: "Serie A", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 511,
    players: mkPlayers("EMP", [
      ["Ethan Walle","GK","Kaleci",65],["Devis Vasquez","GK","Kaleci",77],
      ["Sebastiano Luperto","DEF","Stoper",78],["Mattia Viti","DEF","Stoper",79],["Simone Bastoni","DEF","Sol Bek",76],["Tyronne Ebuehi","DEF","Sağ Bek",75],["Nicolò Cambiaghi","DEF","Kanat Bek",79],
      ["Razvan Marin","MID","Ön Libero",79],["Youssef Maleh","MID","Orta Saha",77],["Alberto Grassi","MID","Orta Saha",76],["Liam Henderson","MID","Sol Kanat",75],["Szymon Żurkowski","MID","Sağ Kanat",78],
      ["Andrea Piccoli","FWD","Santrafor",77],["Niccolò Pierozzi","FWD","Sağ Kanat",76],["Mihailo Ivanović","FWD","Sol Kanat",68],["Patrick Cutrone","FWD","İkinci Forvet",70],
    ]),
  },
  {
    id: "COM", name: "Como", flag: "🇮🇹", league: "Serie A", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 895,
    players: mkPlayers("COM", [
      ["Audero","GK","Kaleci",79],["Pepe Reina","GK","Kaleci",55],
      ["Raphaël Guerreiro","DEF","Sol Bek",84],["Strahinja Pavlović","DEF","Stoper",83],["Yan Couto","DEF","Sağ Bek",85],["Vojin Milinković-Savić","DEF","Stoper",68],["Alexio Bernabé","DEF","Kanat Bek",70],
      ["Ellyes Skhiri","MID","Ön Libero",82],["Lucas Da Cunha","MID","Sol Kanat",76],["Assane Diao","MID","Sol Kanat",80],["Sergi Roberto","MID","Orta Saha",75],["Nico Paz","MID","Ofansif OS",79],
      ["Ciro Immobile","FWD","Santrafor",68],["Patrick Cutrone","FWD","İkinci Forvet",70],["Alberto Cerri","FWD","Santrafor",65],["Ikechukwu Ogbenna","FWD","Sol Kanat",67],
    ]),
  },
  // ── LIGUE 1 2025-26 ───────────────────────────────────────────────────────
  {
    id: "PSG", name: "Paris SG", flag: "🇫🇷", league: "Ligue 1", color: "#004170", secondaryColor: "#DA291C", apiId: 85,
    players: mkPlayers("PSG", [
      ["Gianluigi Donnarumma","GK","Kaleci",88],["Matvey Safonov","GK","Kaleci",84],
      ["Achraf Hakimi","DEF","Sağ Bek",89],["Marquinhos","DEF","Stoper",87],["Willian Pacho","DEF","Stoper",85],["Lucas Beraldo","DEF","Stoper",83],["Nuno Mendes","DEF","Sol Bek",87],["Lucas Hernández","DEF","Sol Bek",85],["Yoram Zague","DEF","Sağ Bek",72],
      ["Vitinha","MID","Ön Libero",86],["Warren Zaïre-Emery","MID","Orta Saha",88],["João Neves","MID","Orta Saha",86],["Fabián Ruiz","MID","Orta Saha",82],["Desire Doué","MID","Sol Kanat",83],["Lee Kang-in","MID","Sağ Kanat",82],
      ["Gonçalo Ramos","FWD","Santrafor",83],["Bradley Barcola","FWD","Sol Kanat",84],["Ousmane Dembélé","FWD","Sağ Kanat",86],["Khvicha Kvaratskhelia","FWD","Sol Kanat",90],
    ]),
  },
  {
    id: "MAR", name: "Marseille", flag: "🇫🇷", league: "Ligue 1", color: "#2196F3", secondaryColor: "#FFFFFF", apiId: 81,
    players: mkPlayers("MAR", [
      ["Geronimo Rulli","GK","Kaleci",79],["Pau López","GK","Kaleci",80],
      ["Jonathan Clauss","DEF","Sağ Bek",78],["Leonardo Balerdi","DEF","Stoper",82],["Samuel Gigot","DEF","Stoper",77],["Quentin Merlin","DEF","Sol Bek",83],["Ulisses Garcia","DEF","Sol Bek",76],
      ["Valentin Rongier","MID","Ön Libero",80],["Ismaël Koné","MID","Orta Saha",79],["Adrien Rabiot","MID","Orta Saha",85],["Luis Henrique","MID","Sol Kanat",77],["Geoffrey Kondogbia","MID","Ön Libero",76],
      ["Mason Greenwood","FWD","Sağ Kanat",84],["Elye Wahi","FWD","Santrafor",83],["Neal Maupay","FWD","İkinci Forvet",78],["Pierre-Emerick Aubameyang","FWD","Santrafor",75],
    ]),
  },
  {
    id: "MON", name: "Monaco", flag: "🇫🇷", league: "Ligue 1", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 91,
    players: mkPlayers("MON", [
      ["Philipp Köhn","GK","Kaleci",81],["Alexander Nübel","GK","Kaleci",83],
      ["Vanderson","DEF","Sağ Bek",82],["Axel Disasi","DEF","Stoper",84],["Benoît Badiashile","DEF","Stoper",83],["Caio Henrique","DEF","Sol Bek",80],["Mohamed Salisu","DEF","Stoper",79],["Jordan Teze","DEF","Sağ Bek",78],
      ["Denis Zakaria","MID","Ön Libero",79],["Aleksandr Golovin","MID","Ofansif OS",84],["Maghnes Akliouche","MID","Sol Kanat",82],["Youssouf Fofana","MID","Orta Saha",85],["Eliot Matazo","MID","Orta Saha",76],
      ["Breel Embolo","FWD","Santrafor",81],["Folarin Balogun","FWD","İkinci Forvet",83],["Takumi Minamino","FWD","Sol Kanat",77],["Eliesse Ben Seghir","FWD","Sağ Kanat",84],
    ]),
  },
  {
    id: "LIL", name: "Lille", flag: "🇫🇷", league: "Ligue 1", color: "#CC0000", secondaryColor: "#003DA5", apiId: 79,
    players: mkPlayers("LIL", [
      ["Lucas Chevalier","GK","Kaleci",84],["Ivo Grbić","GK","Kaleci",74],
      ["Alexsandro","DEF","Stoper",78],["Gabriel Gudmundsson","DEF","Sol Bek",76],["Bafodé Diakité","DEF","Stoper",83],["Ismaily","DEF","Sol Bek",70],["Tiago Djaló","DEF","Stoper",81],
      ["André Gomes","MID","Ön Libero",75],["Yusuf Yazıcı","MID","Sol Kanat",76],["Edon Zhegrova","MID","Sağ Kanat",79],["Angel Gomes","MID","Orta Saha",81],["Benjamin André","MID","Ön Libero",75],
      ["Jonathan David","FWD","Santrafor",86],["Mohamed Bayo","FWD","İkinci Forvet",74],["Rémy Cabella","FWD","Sol Kanat",70],["Adam Ounas","FWD","Sağ Kanat",75],
    ]),
  },
  {
    id: "LYO", name: "Lyon", flag: "🇫🇷", league: "Ligue 1", color: "#0033CC", secondaryColor: "#CC0000", apiId: 80,
    players: mkPlayers("LYO", [
      ["Lucas Perri","GK","Kaleci",79],["Anthony Lopes","GK","Kaleci",78],
      ["Jake O'Brien","DEF","Stoper",73],["Nicolas Tagliafico","DEF","Sol Bek",79],["Saël Kumbedi","DEF","Sağ Bek",76],["Ainsley Maitland-Niles","DEF","Kanat Bek",78],["Corentin Tolisso","MID","Ön Libero",78],
      ["Maxence Caqueret","MID","Ön Libero",83],["Johann Lepenant","MID","Orta Saha",77],["Rayan Cherki","MID","Ofansif OS",84],["Malick Fofana","MID","Sol Kanat",76],["Ernest Nuamah","MID","Sağ Kanat",81],
      ["Alexandre Lacazette","FWD","Santrafor",76],["Gift Orban","FWD","Sol Kanat",84],["Georges Mikautadze","FWD","İkinci Forvet",80],["Saïd Benrahma","FWD","Sağ Kanat",78],
    ]),
  },
  {
    id: "LEN", name: "Lens", flag: "🇫🇷", league: "Ligue 1", color: "#CC0000", secondaryColor: "#FFD700", apiId: 116,
    players: mkPlayers("LEN", [
      ["Brice Samba","GK","Kaleci",84],["Jean-Louis Leca","GK","Kaleci",58],
      ["Jonathan Gradit","DEF","Stoper",75],["Kevin Danso","DEF","Stoper",83],["Deiver Machado","DEF","Sol Bek",77],["Przemysław Frankowski","DEF","Sağ Bek",79],["Cabot","DEF","Sağ Bek",73],
      ["Salis Abdul Samed","MID","Ön Libero",82],["Adrien Thomasson","MID","Sol Kanat",76],["Christopher Wooh","DEF","Stoper",77],["Neil El Aynaoui","MID","Orta Saha",75],["Wesley Said","MID","Sağ Kanat",74],
      ["Lois Openda","FWD","Santrafor",87],["David Pereira da Costa","FWD","İkinci Forvet",81],["Florian Sotoca","FWD","Sol Kanat",77],["Massadio Haïdara","DEF","Sol Bek",76],
    ]),
  },
  {
    id: "NIC", name: "Nice", flag: "🇫🇷", league: "Ligue 1", color: "#000000", secondaryColor: "#CC0000", apiId: 84,
    players: mkPlayers("NIC", [
      ["Marcin Bułka","GK","Kaleci",84],["Walter Benítez","GK","Kaleci",79],
      ["Jean-Clair Todibo","DEF","Stoper",87],["Melvin Bard","DEF","Sol Bek",79],["Jordan Lotomba","DEF","Sağ Bek",78],["Alexis Beka Beka","DEF","Stoper",75],["Dante","DEF","Stoper",62],
      ["Pablo Rosario","MID","Ön Libero",79],["Sofiane Diop","MID","Sol Kanat",83],["Hicham Boudaoui","MID","Orta Saha",81],["Evann Guessand","MID","Sağ Kanat",77],["Nicolas Pépé","MID","Sol Kanat",78],
      ["Gaëtan Laborde","FWD","Santrafor",79],["Terem Moffi","FWD","İkinci Forvet",84],["Ayase Ueda","FWD","Santrafor",79],["Kasper Dolberg","FWD","Sol Kanat",77],
    ]),
  },
  {
    id: "REN", name: "Rennes", flag: "🇫🇷", league: "Ligue 1", color: "#CC0000", secondaryColor: "#000000", apiId: 94,
    players: mkPlayers("REN", [
      ["Steve Mandanda","GK","Kaleci",68],["Dogan Alemdar","GK","Kaleci",78],
      ["Hamari Traoré","DEF","Sağ Bek",76],["Adrien Truffert","DEF","Sol Bek",83],["Joe Rodon","DEF","Stoper",78],["Warrick Fulgini","DEF","Kanat Bek",78],["Adeline Badie","DEF","Stoper",69],
      ["Baptiste Santamaria","MID","Ön Libero",78],["Benjamin Bourigeaud","MID","Sağ Kanat",81],["Martin Terrier","MID","Sol Kanat",80],["Amine Gouiri","MID","Ofansif OS",85],["Jonas Martin","MID","Orta Saha",69],
      ["Arnaud Kalimuendo","FWD","Santrafor",83],["Ludovic Blas","FWD","İkinci Forvet",82],["Mathis Lambourde","FWD","Sol Kanat",68],["Emmanuel Emegha","FWD","Sağ Kanat",79],
    ]),
  },
  {
    id: "TOU", name: "Toulouse", flag: "🇫🇷", league: "Ligue 1", color: "#7B2C8B", secondaryColor: "#FFFFFF", apiId: 96,
    players: mkPlayers("TOU", [
      ["Guillaume Restes","GK","Kaleci",82],["Maxime Dupe","GK","Kaleci",77],
      ["Logan Costa","DEF","Stoper",79],["Anthony Rouault","DEF","Stoper",80],["Mikkel Desler","DEF","Sağ Bek",77],["Rasmus Nicolaisen","DEF","Sol Bek",79],["Gabriel Suazo","DEF","Sol Bek",78],
      ["Branco van den Boomen","MID","Ön Libero",81],["Stijn Spierings","MID","Ön Libero",78],["Zakaria Aboukhlal","MID","Sol Kanat",81],["Kjetil Haug","MID","Sağ Kanat",66],["Thijs Dallinga","FWD","İkinci Forvet",83],
      ["Rafael Ratão","FWD","Sol Kanat",76],["Frank Magri","FWD","Sağ Kanat",79],["Rhys Healey","FWD","Santrafor",72],["Yann Gboho","FWD","Sol Kanat",78],
    ]),
  },
  {
    id: "BRE2", name: "Brest", flag: "🇫🇷", league: "Ligue 1", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 106,
    players: mkPlayers("BRE2", [
      ["Marco Bizot","GK","Kaleci",77],["Gautier Larsonneur","GK","Kaleci",78],
      ["Lilian Brassier","DEF","Stoper",80],["Brendan Chardonnet","DEF","Stoper",76],["Julien Le Cardinal","DEF","Sağ Bek",75],["Bradley Locko","DEF","Sol Bek",83],["Haris Belkebla","DEF","Kanat Bek",73],
      ["Hugo Magnetti","MID","Ön Libero",76],["Pierre Lees-Melou","MID","Orta Saha",77],["Franck Honorat","MID","Sağ Kanat",82],["Romain Faivre","MID","Sol Kanat",73],["Mathias Pereira Lage","MID","Sol Kanat",74],
      ["Moussa Diaby","FWD","Sağ Kanat",86],["Steve Mounié","FWD","Santrafor",72],["El Bilal Touré","FWD","İkinci Forvet",84],["Ludovic Ajorque","FWD","Santrafor",76],
    ]),
  },
  {
    id: "NAN", name: "Nantes", flag: "🇫🇷", league: "Ligue 1", color: "#FFD700", secondaryColor: "#003DA5", apiId: 83,
    players: mkPlayers("NAN", [
      ["Alban Lafont","GK","Kaleci",84],["Rémy Descamps","GK","Kaleci",70],
      ["Jean-Charles Castelletto","DEF","Stoper",75],["Nicolas Pallois","DEF","Stoper",60],["Fabio","DEF","Sol Bek",65],["Quentin Merlin","DEF","Sol Bek",83],["Pedro Chirivella","MID","Ön Libero",78],
      ["Moussa Sissoko","MID","Ön Libero",68],["Florent Mollet","MID","Ofansif OS",72],["Moses Simon","MID","Sol Kanat",80],["Andrei Girotto","MID","Orta Saha",75],["El-Arouch","MID","Sağ Kanat",78],
      ["Mostafa Mohamed","FWD","Santrafor",80],["Evann Guessand","FWD","Sol Kanat",77],["Ludovic Blas","FWD","İkinci Forvet",82],["Jonathan Rodríguez","FWD","Santrafor",68],
    ]),
  },
  {
    id: "REI", name: "Reims", flag: "🇫🇷", league: "Ligue 1", color: "#CC0000", secondaryColor: "#FFFFFF", apiId: 93,
    players: mkPlayers("REI", [
      ["Yehvann Diouf","GK","Kaleci",81],["Patrick Pentz","GK","Kaleci",78],
      ["Emmanuel Agbadou","DEF","Stoper",76],["Yunis Abdelhamid","DEF","Stoper",70],["Maxime Busi","DEF","Sağ Bek",76],["Ghislain Konan","DEF","Sol Bek",79],["Andrew Wilson","DEF","Kanat Bek",66],
      ["Jens Cajuste","MID","Ön Libero",80],["Alexis Flips","MID","Orta Saha",79],["Dion Lopy","MID","Orta Saha",81],["Cheick Keita","MID","Sol Kanat",67],["Kamory Doumbia","MID","Sağ Kanat",79],
      ["Ilan Kebbal","FWD","Sol Kanat",75],["Mitchell van Bergen","FWD","Sağ Kanat",76],["Oumar Diakité","FWD","İkinci Forvet",79],["Emmanuel Latte Lath","FWD","Santrafor",78],
    ]),
  },
  {
    id: "STE", name: "Saint Etienne", flag: "🇫🇷", league: "Ligue 1", color: "#006600", secondaryColor: "#FFFFFF", apiId: 1063,
    players: mkPlayers("STE", [
      ["Étienne Green","GK","Kaleci",76],["Stefan Bajić","GK","Kaleci",75],
      ["Harold Moukoudi","DEF","Stoper",79],["Mickael Nadé","DEF","Stoper",76],["Yvann Maçon","DEF","Sağ Bek",77],["Niels Nkounkou","DEF","Sol Bek",81],["Matias Vargas","DEF","Kanat Bek",68],
      ["Yvan Neyou","MID","Ön Libero",72],["Zaydou Youssouf","MID","Orta Saha",77],["Mahdi Camara","MID","Orta Saha",78],["Pierre Ekwah","MID","Sol Kanat",76],["Assane Diousse","MID","Sağ Kanat",75],
      ["Ibrahima Wadji","FWD","Santrafor",72],["Lucas Stassin","FWD","İkinci Forvet",75],["Zuriko Davitashvili","FWD","Sol Kanat",79],["Gauthier Gallon","FWD","Sağ Kanat",69],
    ]),
  },
  {
    id: "LHA", name: "Le Havre", flag: "🇫🇷", league: "Ligue 1", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 111,
    players: mkPlayers("LHA", [
      ["Arthur Desmas","GK","Kaleci",76],["Yahia Fofana","GK","Kaleci",78],
      ["Gautier Lloris","DEF","Stoper",77],["Emmanuel Coulibaly","DEF","Stoper",65],["Arouna Sangante","DEF","Sol Bek",79],["Chrislain Matsima","DEF","Sağ Bek",77],["Daler Kuzyaev","DEF","Kanat Bek",81],
      ["Yoann Salmier","MID","Ön Libero",76],["Elie Mbondi","MID","Orta Saha",64],["Jimmy Cabot","MID","Sağ Kanat",76],["Rassoul Ndiaye","MID","Sol Kanat",77],["Nabil Alioui","MID","Ofansif OS",75],
      ["Ilias Akhomach","FWD","Sağ Kanat",83],["Yoann Cathline","FWD","Santrafor",76],["Josué Casimir","FWD","Sol Kanat",75],["Anas Tahiri","FWD","İkinci Forvet",77],
    ]),
  },
  {
    id: "AUX", name: "Auxerre", flag: "🇫🇷", league: "Ligue 1", color: "#003DA5", secondaryColor: "#FFFFFF", apiId: 108,
    players: mkPlayers("AUX", [
      ["Benoit Costil","GK","Kaleci",58],["Théo Bertrand","GK","Kaleci",62],
      ["Birama Touré","DEF","Stoper",70],["Thomas Autret","DEF","Stoper",52],["Rayan Aït-Nouri","DEF","Sol Bek",85],["Kevin Lavalée","DEF","Sağ Bek",58],["Théo Zidane","DEF","Kanat Bek",72],
      ["Nuno Da Costa","MID","Sağ Kanat",67],["Gauthier Hein","MID","Sol Kanat",76],["Rémy Dugimont","MID","Orta Saha",50],["Paul Joly","MID","Ön Libero",73],["Lassine Sinayoko","MID","Ofansif OS",75],
      ["Gaëtan Perrin","FWD","Sol Kanat",77],["Omar Diallo","FWD","Santrafor",58],["Mathian Laviron","FWD","İkinci Forvet",58],["M'Baye Niang","FWD","Santrafor",72],
    ]),
  },
];

export const FORMATIONS = [
  // ── Klasik Dizilişler ─────────────────────────────────────────────────────
  { id: "4-4-2",   name: "4-4-2",          layout: [1, 4, 4, 2],       label: "Klasik" },
  { id: "4-3-3",   name: "4-3-3",          layout: [1, 4, 3, 3],       label: "Hücum" },
  { id: "3-5-2",   name: "3-5-2",          layout: [1, 3, 5, 2],       label: "Dengeli" },
  { id: "5-3-2",   name: "5-3-2",          layout: [1, 5, 3, 2],       label: "Savunma" },
  { id: "3-4-3",   name: "3-4-3",          layout: [1, 3, 4, 3],       label: "Ultra Hücum" },
  // ── Modern Taktikler ──────────────────────────────────────────────────────
  { id: "4-2-3-1", name: "4-2-3-1",        layout: [1, 4, 2, 3, 1],   label: "Modern" },
  { id: "4-1-4-1", name: "4-1-4-1",        layout: [1, 4, 1, 4, 1],   label: "Pressing" },
  { id: "4-4-1-1", name: "4-4-1-1",        layout: [1, 4, 4, 1, 1],   label: "Dengeli" },
  { id: "3-4-2-1", name: "3-4-2-1",        layout: [1, 3, 4, 2, 1],   label: "Dinamik" },
  // ── Özel Taktik Sistemler ─────────────────────────────────────────────────
  { id: "4-3-1-2", name: "4-3-1-2 ◆",     layout: [1, 4, 3, 1, 2],   label: "Baklava" },
  { id: "4-3-2-1", name: "4-3-2-1 🎄",    layout: [1, 4, 3, 2, 1],   label: "Çam Ağacı" },
  { id: "4-2-2-2", name: "4-2-2-2",        layout: [1, 4, 2, 2, 2],   label: "Box Midfield" },
  // ── Katı Savunma ──────────────────────────────────────────────────────────
  { id: "4-5-1",   name: "4-5-1",          layout: [1, 4, 5, 1],       label: "Savunma" },
  { id: "5-4-1",   name: "5-4-1 🛡️",      layout: [1, 5, 4, 1],       label: "Katı Savunma" },
];
