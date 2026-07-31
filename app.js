// =============================================
// BALCI JANT LASTİK - APP DATA & LOGIC
// =============================================

// ---- STATE ----
let LASTIK_PRODUCTS = [];
let JANT_PRODUCTS = [];
let activeSegment = null; // 'lastik' or 'jant'

let currentBrand = "all";
let searchQuery = "";

// ---- DOM REFERENCES ----
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const noResults = document.getElementById("noResults");
const noResultsMsg = document.getElementById("noResultsMsg");
const sectionLabel = document.getElementById("sectionLabel");

const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");

const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearch");

const aboutPage = document.getElementById("aboutPage");
const appView = document.getElementById("app");

// Sidebar
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarOpenBtn = document.getElementById("sidebarOpenBtn");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const navHomeBtn = document.getElementById("navHomeBtn");
const navAboutBtn = document.getElementById("navAboutBtn");
const loadingOverlay = document.getElementById("loadingOverlay");

const activeFiltersContainer = document.getElementById("activeFiltersContainer");
const activeFiltersDiv = document.getElementById("activeFilters");

const brandsMenu = document.getElementById("brandsMenu");

// Header
const mainHeader = document.getElementById("mainHeader");

// Segment
const segmentSelector = document.getElementById("segmentSelector");
const segmentHeader = document.getElementById("segmentHeader");
const productSection = document.querySelector(".product-section");
const tabLastik = document.getElementById("tabLastik");
const tabJant = document.getElementById("tabJant");

// ---- PRODUCT IMAGES ----
const TIRE_IMAGE_SRC = "tire.png";
const JANT_IMAGE_SRC = "jant_17.png"; // Varsayılan jant görseli
const PT311_IMAGE_SRC = "pt311.jpg"; // Elegant PT311 model görseli
const SNOWMASTER2_IMAGE_SRC = "snowmaster2.jpg"; // Snowmaster2 model görseli

// Model bazlı özel görsel eşleştirme
function getModelImage(product) {
  const desc = ((product.description || '') + ' ' + (product.model || '')).toUpperCase();
  if (desc.includes('SNOWMASTER2') || desc.includes('SNOWMASTER 2')) return SNOWMASTER2_IMAGE_SRC;
  if (desc.includes('ELEGANT') && (desc.includes('PT311') || desc.includes('PT 311'))) return PT311_IMAGE_SRC;
  return null;
}

// Ürün görseli öncelik sırası: model bazlı > Excel'deki özel görsel > segment varsayılan
function getProductImage(p) {
  const modelImg = getModelImage(p);
  if (modelImg) return modelImg;
  if (p.image && p.image !== TIRE_IMAGE_SRC && p.image !== JANT_IMAGE_SRC) return p.image;
  return activeSegment === "jant" ? JANT_IMAGE_SRC : TIRE_IMAGE_SRC;
}

// ---- INITIALIZATION ----
document.addEventListener("DOMContentLoaded", () => {
  const savedSegment = localStorage.getItem("activeSegment");

  if (savedSegment && (savedSegment === "jant" || savedSegment === "lastik")) {
    // Sayfa yenilendiğinde kalınan segmentten başla
    selectSegment(savedSegment, true);
  }
  // Segment seçilmemişse JANT & LASTİK seçim ekranı gösterilir
  tryFetchAllExcel();
});

// ---- SIDEBAR & ACCORDIONS ----
function toggleSidebar() {
  const isOpen = sidebar.classList.toggle("show");
  if (isOpen) {
    sidebarOverlay.classList.remove("hidden");
    requestAnimationFrame(() => sidebarOverlay.classList.add("show"));
  } else {
    sidebarOverlay.classList.remove("show");
    setTimeout(() => sidebarOverlay.classList.add("hidden"), 300);
  }
}

sidebarOpenBtn.addEventListener("click", toggleSidebar);
sidebarCloseBtn.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", toggleSidebar);

document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    header.classList.toggle("open");
    const body = header.nextElementSibling;
    body.classList.toggle("expand");
  });
});

// ---- NAVIGATION ----
function switchTab(tab) {
  navHomeBtn.classList.remove("active");
  navAboutBtn.classList.remove("active");
  
  if (tab === "home") {
    navHomeBtn.classList.add("active");
    aboutPage.classList.add("hidden");
    if (activeSegment) {
      productSection.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else if (tab === "about") {
    navAboutBtn.classList.add("active");
    aboutPage.classList.remove("hidden");
  }
  toggleSidebar();
}

// ---- JANT FİLTRE STATE ----
let currentJantInc = "all";
let currentJantBjon = "all";
let currentJantOfset = "all";
let currentJantGoebek = "all";

// ---- SEGMENT SELECTOR ----
function selectSegment(type, isRestore = false) {
  activeSegment = type;
  localStorage.setItem("activeSegment", type);
  
  // Hide selector, show main header and product view
  segmentSelector.classList.add("hidden");
  if (mainHeader) mainHeader.classList.remove("hidden");
  segmentHeader.classList.remove("hidden");
  productSection.style.display = "";
  
  // Update tabs
  tabLastik.classList.toggle("active", type === "lastik");
  tabJant.classList.toggle("active", type === "jant");
  
  // Update section label
  sectionLabel.textContent = type === "lastik" ? "Lastikler" : "Jantlar";
  
  // Sidebar filtrelerini segment'e göre göster/gizle
  const lastikFiltersGroup = document.getElementById("lastikFiltersGroup");
  const lastikBrandsGroup  = document.getElementById("lastikBrandsGroup");

  if (type === "jant") {
    lastikFiltersGroup?.classList.remove("hidden");
    lastikBrandsGroup?.classList.remove("hidden");
  } else {
    lastikFiltersGroup?.classList.remove("hidden");
    lastikBrandsGroup?.classList.remove("hidden");
  }

  // Restore or reset filters
  if (isRestore) {
    currentBrand = sessionStorage.getItem("currentBrand") || "all";
    currentJantInc = sessionStorage.getItem("currentJantInc") || "all";
    currentJantBjon = sessionStorage.getItem("currentJantBjon") || "all";
    currentJantOfset = sessionStorage.getItem("currentJantOfset") || "all";
    currentJantGoebek = sessionStorage.getItem("currentJantGoebek") || "all";
    searchQuery = sessionStorage.getItem("searchQuery") || "";
    searchInput.value = searchQuery;
  } else {
    currentBrand = "all";
    currentJantInc = "all";
    currentJantBjon = "all";
    currentJantOfset = "all";
    currentJantGoebek = "all";
    searchQuery = "";
    searchInput.value = "";

    sessionStorage.setItem("currentBrand", "all");
    sessionStorage.setItem("currentJantInc", "all");
    sessionStorage.setItem("currentJantBjon", "all");
    sessionStorage.setItem("currentJantOfset", "all");
    sessionStorage.setItem("currentJantGoebek", "all");
    sessionStorage.setItem("searchQuery", "");
  }
  
  buildDynamicMenus();
  renderProducts();
}

function goBackToSelector() {
  activeSegment = null;
  localStorage.removeItem("activeSegment");
  segmentSelector.classList.remove("hidden");
  if (mainHeader) mainHeader.classList.add("hidden");
  segmentHeader.classList.add("hidden");
  productSection.style.display = "none";
  sectionLabel.textContent = "Tüm Ürünler";
}

// Make globally accessible
window.selectSegment = selectSegment;
window.goBackToSelector = goBackToSelector;

// ---- EXCEL READING (SheetJS) ----
// Tek kaynak: veri.xlsx | Cache-busting + canlı stok takibi (30sn)

async function fetchVeriExcel() {
  const isFirstLoad = LASTIK_PRODUCTS.length === 0 && JANT_PRODUCTS.length === 0;

  // İlk yüklemede loading overlay göster
  if (isFirstLoad) {
    loadingOverlay.classList.remove("hidden");
  }

  try {
    const url = `veri.xlsx?t=${new Date().getTime()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`[Stok] veri.xlsx alınamadı (HTTP ${response.status}). Eski veri korunuyor.`);
      if (isFirstLoad) loadingOverlay.classList.add("hidden");
      return;
    }

    const arrayBuffer = await response.arrayBuffer();

    // Boş dosya kontrolü
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.warn("[Stok] veri.xlsx boş. Eski veri korunuyor.");
      if (isFirstLoad) loadingOverlay.classList.add("hidden");
      return;
    }

    let workbook;
    try {
      workbook = XLSX.read(arrayBuffer, { type: "array" });
    } catch (parseErr) {
      console.error("[Stok] Excel parse hatası:", parseErr);
      if (isFirstLoad) loadingOverlay.classList.add("hidden");
      return;
    }

    const parsed = parseWorkbook(workbook);

    // Veri geçerliyse güncelle, değilse eski veriyi koru
    if (!parsed || parsed.length === 0) {
      console.warn("[Stok] veri.xlsx okunabildi fakat içerik boş/geçersiz. Eski veri korunuyor.");
      if (isFirstLoad) loadingOverlay.classList.add("hidden");
      return;
    }

    // Başarılı: verileri Tip sütununa göre dağıt (LASTİK / JANT)
    LASTIK_PRODUCTS = parsed.filter(p => p.tip === 'LASTİK');
    JANT_PRODUCTS   = parsed.filter(p => p.tip === 'JANT');

    console.info(`[Stok] ${LASTIK_PRODUCTS.length} lastik + ${JANT_PRODUCTS.length} jant ürünü güncellendi (${new Date().toLocaleTimeString("tr-TR")}).`);

    // Eğer kullanıcı halihazırda bir segment görüntülüyorsa, listeyi yeniden çiz
    if (activeSegment) {
      renderProducts();
    }

  } catch (err) {
    console.error("[Stok] Beklenmedik hata:", err);
  } finally {
    if (isFirstLoad) {
      loadingOverlay.classList.add("hidden");
      if (!activeSegment) {
        productSection.style.display = "none";
      }
    }
  }
}

// İlk yüklemede çalıştır, ardından her 30 saniyede bir canlı güncelle
function startLiveStockTracking() {
  fetchVeriExcel();
  setInterval(fetchVeriExcel, 30000);
}

// Geriye dönük uyumluluk için alias (window.addEventListener'daki çağrı)
function tryFetchAllExcel() {
  startLiveStockTracking();
}

function parseWorkbook(workbook) {
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) return [];
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) return [];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  return parseAndMapExcelData(jsonData);
}

function parseAndMapExcelData(rawData) {
  // Mevsim tespiti (mevsim sütunu + açıklama bazlı)
  function detectSeason(desc, mevsimCol) {
    const m = (mevsimCol || '').toUpperCase();
    const d = (desc || '').toUpperCase();
    if (m.includes('KI') || d.includes('SNOWMASTER2') || d.includes('SNOWMASTER 2')) return 'KIŞ';
    if (m.includes('4') || m.includes('ALL') || d.includes('PT565')) return '4 Mevsim';
    return 'YAZ';
  }

  // Önce tam sütun adına bak, yoksa normalize ederek ara
  function getCol(row, exactNames, fallbackIncludes) {
    for (const name of exactNames) {
      if (row[name] !== undefined) {
        const v = String(row[name]).trim();
        return v === '' || v === 'undefined' ? '' : v;
      }
    }
    if (fallbackIncludes) {
      for (const k of Object.keys(row)) {
        const kl = k.toLowerCase()
          .replace(/ı/g,'i').replace(/ğ/g,'g')
          .replace(/ü/g,'u').replace(/ş/g,'s')
          .replace(/ö/g,'o').replace(/ç/g,'c');
        if (fallbackIncludes.some(pk => kl.includes(pk))) {
          const v = String(row[k]).trim();
          return v === '' || v === 'undefined' ? '' : v;
        }
      }
    }
    return '';
  }

  return rawData.map((row, index) => {
    // BALCI OTO STOK sütun yapısı:
    // ÜRÜN | MARKA | STOK KODU | ÜRÜN AÇIKLAMASI | MEVSİM | TARİH | KATEGORİ | STOK
    const tip      = getCol(row, ['ÜRÜN','TİP','TIP'], ['tip','tur']);
    const marka    = getCol(row, ['MARKA','BRAND'], ['marka','brand','make']);
    const rawKod   = getCol(row, ['STOK KODU','KOD','SKU','CODE'], ['stok kodu','kod','kodu','code','sku']);
    const kod      = rawKod ? String(rawKod).replace(/^[\/#\\]+/, '').trim() : '';
    const aciklama = getCol(row, ['ÜRÜN AÇIKLAMASI','ACIKLAMA','TANIM','DESCRIPTION'], ['urun aciklama','aciklama','tanim','description','name']);
    const mevsimRaw= getCol(row, ['MEVSİM','MEVSIM','SEZON','SEASON'], ['mevsim','sezon','season']);
    const dot      = getCol(row, ['TARİH','TARIH','DOT','YIL'], ['tarih','dot','yil','year','uretim']);
    const stok     = getCol(row, ['STOK','ADET','QUANTITY'], ['adet','quantity','qty','miktar']);
    const gorsel   = getCol(row, ['GORSEL','RESİM','IMAGE','IMG'], ['gorsel','resim','foto','image','img']);

    // Tip belirsizse LASTİK varsayılan
    const finalTip = tip ? tip.toUpperCase().trim() : 'LASTİK';

    // Ebat açıklamadan çıkar
    let finalSize = '';
    if (aciklama) {
      if (finalTip === 'LASTİK') {
        // Örnek: "145/70R13 71T ELEGANT PT311 PETLAS"
        const m = aciklama.match(/(\d{2,4}[\/\\.]\d{2,3}[Rr]\d{2,3})/);
        if (m) finalSize = m[1];
      } else {
        // Örnek: "6X13 4X98 ET13 58.6 SILVER" → 6X13
        const m = aciklama.match(/(\d+(?:\.\d+)?[Xx]\d+(?:\.\d+)?)/);
        if (m) finalSize = m[1].toUpperCase();
      }
    }

    // Yük indeksi açıklamadan çıkar (lastik: "71T", "91H" vb.)
    let yuk = '';
    if (finalTip === 'LASTİK' && aciklama) {
      const m = aciklama.match(/\b(\d{2,3}[A-Z]{1,2})\b/i);
      if (m) yuk = m[1].toUpperCase();
    }

    // Model açıklamadan çıkar
    let finalModel = '';
    if (aciklama) {
      const parts = aciklama.trim().split(/\s+/);
      if (finalTip === 'LASTİK' && parts.length >= 3) {
        // İlk 2 token: ebat + yük indeksi → gerisi model+marka
        finalModel = parts.slice(2).join(' ').trim();
      } else if (finalTip === 'JANT') {
        // Jant açıklamasının son renk/model kısmı: "6X13 4X98 ET13 58.6 SILVER" → SILVER
        const m = aciklama.match(/[A-Za-z][A-Za-z0-9 ]+$/);
        if (m) finalModel = m[0].trim();
      }
    }

    // Jant özel alanları açıklamadan parse et
    let inc = '', bjon = '', ofset = '', goebek = '';
    if (finalTip === 'JANT' && aciklama) {
      const desc = aciklama.toUpperCase();
      // İnç: "6X13" → 13, "6.5X16" → 16
      const mInch = desc.match(/\d+(?:\.\d+)?[Xx](\d{2}(?:\.\d+)?)(?:\s|$)/);
      if (mInch) inc = mInch[1];
      // Bijon: "4X98", "5X112", "6X130"
      const mBjon = desc.match(/([456]X\d{2,5}(?:\.\d)?)/);
      if (mBjon) bjon = mBjon[1];
      // Ofset: "ET13", "ET35", "ET50"
      const mOfset = desc.match(/ET(-?\d{1,3})/);
      if (mOfset) ofset = 'ET' + mOfset[1];
      // Göbek: "58.6", "84.1"
      const mGoebek = desc.match(/\b(\d{2,3}\.\d)\b/);
      if (mGoebek) goebek = mGoebek[1];
    }

    return {
      id:          index + 1,
      tip:         finalTip,
      code:        kod,
      description: aciklama || 'İsimsiz Ürün',
      brand:       marka,
      size:        finalSize,
      load:        yuk,
      model:       finalModel,
      dot:         dot,
      season:      detectSeason(aciklama, mevsimRaw),
      image:       gorsel,
      stok:        stok,
      // Jant özel alanlar
      inc:         inc,
      bjon:        bjon,
      ofset:       ofset,
      goebek:      goebek,
    };
  }).filter(p => p.code || p.size || p.description !== 'İsimsiz Ürün');
}

function buildDynamicMenus() {
  const products = activeSegment === "jant" ? JANT_PRODUCTS : LASTIK_PRODUCTS;
  const brands = new Set();

  products.forEach(p => {
    if (p.brand) brands.add(p.brand.toUpperCase());
  });

  // Populate Brands - her iki segment için dinamik marka listesi
  brandsMenu.innerHTML = `<button class="sub-nav-btn active" data-filter-type="brand" data-filter-value="all">Tümü</button>`;
  [...brands].sort().forEach(brand => {
    brandsMenu.innerHTML += `<button class="sub-nav-btn" data-filter-type="brand" data-filter-value="${brand}">${brand}</button>`;
  });

  // Bind clicks
  document.querySelectorAll("#brandsMenu .sub-nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const val = btn.dataset.filterValue;
      
      btn.parentElement.querySelectorAll(".sub-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentBrand = val;
      sessionStorage.setItem("currentBrand", val);

      toggleSidebar();
      renderProducts();
    });
  });

}


// ---- SEASON HELPERS ----
function getSeasonIcon(season) {
  if (!season) return { emoji: "🌤️", cls: "allseason", label: "4 Mevsim" };
  const s = season.toUpperCase();
  if (s.includes("YAZ")) return { emoji: "☀️", cls: "summer", label: "Yaz" };
  if (s.includes("KIŞ") || s.includes("KIS")) return { emoji: "❄️", cls: "winter", label: "Kış" };
  return { emoji: "🌤️", cls: "allseason", label: "4 Mevsim" };
}


// ---- BRAND LOGO HELPER ----
function getBrandLogoHTML(brand) {
  if (!brand) return '';
  const b = brand.trim().toUpperCase();

  if (b.includes("PETLAS")) {
    return `<div class="brand-logo-wrap" title="PETLAS">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#E30613"/>
        <text x="60" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="21" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">petlas</text>
      </svg>
    </div>`;
  }
  if (b.includes("PIRELLI") || b.includes("PİRELLİ")) {
    return `<div class="brand-logo-wrap" title="PIRELLI">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#FED100"/>
        <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="17" fill="#000000" text-anchor="middle" letter-spacing="1">PIRELLI</text>
      </svg>
    </div>`;
  }
  if (b.includes("MICHELIN") || b.includes("MİCHELİN")) {
    return `<div class="brand-logo-wrap" title="MICHELIN">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#00205B"/>
        <text x="60" y="20" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">MICHELIN</text>
        <rect x="15" y="24" width="90" height="3" fill="#FFF200" rx="1.5"/>
      </svg>
    </div>`;
  }
  if (b.includes("BRIDGESTONE") || b.includes("BRİDGESTONE")) {
    return `<div class="brand-logo-wrap" title="BRIDGESTONE">
      <svg viewBox="0 0 125 32" class="brand-svg">
        <rect width="125" height="32" rx="4" fill="#000000" stroke="#333333" stroke-width="1"/>
        <text x="12" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="18" fill="#ED1C24">B</text>
        <text x="26" y="21" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="11.5" fill="#FFFFFF" letter-spacing="0.5">RIDGESTONE</text>
      </svg>
    </div>`;
  }
  if (b.includes("CONTINENTAL") || b.includes("CONTİNENTAL")) {
    return `<div class="brand-logo-wrap" title="CONTINENTAL">
      <svg viewBox="0 0 125 32" class="brand-svg">
        <rect width="125" height="32" rx="4" fill="#FFA500"/>
        <text x="62.5" y="21" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13.5" fill="#000000" text-anchor="middle" letter-spacing="0.5">Continental</text>
      </svg>
    </div>`;
  }
  if (b.includes("GOODYEAR")) {
    return `<div class="brand-logo-wrap" title="GOODYEAR">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#002B66"/>
        <text x="60" y="21" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="14" fill="#FFCC00" text-anchor="middle" letter-spacing="0.5">GOODYEAR</text>
      </svg>
    </div>`;
  }
  if (b.includes("LASSA")) {
    return `<div class="brand-logo-wrap" title="LASSA">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#D31018"/>
        <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">LASSA</text>
      </svg>
    </div>`;
  }
  if (b.includes("STARMAXX")) {
    return `<div class="brand-logo-wrap" title="STARMAXX">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#111111" stroke="#D4AF37" stroke-width="1"/>
        <text x="60" y="21" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="14" fill="#D4AF37" text-anchor="middle" letter-spacing="1">STARMAXX</text>
      </svg>
    </div>`;
  }
  if (b.includes("FALKEN")) {
    return `<div class="brand-logo-wrap" title="FALKEN">
      <svg viewBox="0 0 120 32" class="brand-svg">
        <rect width="120" height="32" rx="4" fill="#003A70"/>
        <text x="60" y="21" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="15" fill="#00A3E0" text-anchor="middle" letter-spacing="1">FALKEN</text>
      </svg>
    </div>`;
  }

  return `<div class="brand-logo-wrap default-badge" title="${brand}">
    <span class="brand-text-badge">${brand}</span>
  </div>`;
}

// ---- RENDER PRODUCTS ----
function renderProducts() {
  const products = activeSegment === "jant" ? JANT_PRODUCTS : LASTIK_PRODUCTS;
  
  const filtered = products.filter(p => {
    const matchBrand = currentBrand === "all" || (p.brand || '').toUpperCase() === currentBrand;

    // Jant spesifik filtreler
    const jantIncVal    = (p.inc    || '').trim();
    const jantBjonVal   = (p.bjon   || '').trim();
    const jantOfsetVal  = (p.ofset  || '').trim();
    const jantGobekVal  = (p.goebek || '').trim();

    const matchInc    = activeSegment !== "jant" || currentJantInc    === "all" || !jantIncVal    || jantIncVal.toUpperCase()    === currentJantInc.toUpperCase();
    const matchBjon   = activeSegment !== "jant" || currentJantBjon   === "all" || !jantBjonVal   || jantBjonVal.toUpperCase()   === currentJantBjon.toUpperCase();
    const matchOfset  = activeSegment !== "jant" || currentJantOfset  === "all" || !jantOfsetVal  || jantOfsetVal.toUpperCase()  === currentJantOfset.toUpperCase();
    const matchGoebek = activeSegment !== "jant" || currentJantGoebek === "all" || !jantGobekVal  || jantGobekVal.toUpperCase()  === currentJantGoebek.toUpperCase();
    
    const q = searchQuery.toLowerCase();
    const qNorm = q.replace(/r/gi, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const normalize = (s) => (s || '').replace(/r/gi, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const matchSearch = !q || (
      (p.size        || '').toLowerCase().includes(q) ||
      (p.model       || '').toLowerCase().includes(q) ||
      (p.brand       || '').toLowerCase().includes(q) ||
      (p.code        || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      normalize(p.size).includes(qNorm) ||
      normalize(p.model).includes(qNorm) ||
      normalize(p.brand).includes(qNorm) ||
      normalize(p.code).includes(qNorm) ||
      normalize(p.description).includes(qNorm)
    );
    return matchBrand && matchInc && matchBjon && matchOfset && matchGoebek && matchSearch;
  });

  productGrid.innerHTML = "";
  updateActiveFiltersUI();

  if (products.length === 0) {
    noResults.classList.remove("hidden");
    productGrid.classList.add("hidden");
    productCount.textContent = "0 Ürün";
    const typeName = activeSegment === "jant" ? "jant" : "lastik";
    noResultsMsg.innerHTML = `<strong>veri.xlsx'te ${typeName === 'jant' ? 'JANT' : 'LASTİK'} verisi bulunamadı.</strong><br/><br/>Excel dosyanızda <strong>TİP</strong> sütununda <strong>${typeName === 'jant' ? 'JANT' : 'LASTİK'}</strong> yazılı satırlar ekleyin.<br/>Ayrıca <strong>baslat.bat</strong> dosyasına çift tıklayarak çalıştırmayı deneyin.`;
    return;
  }

  if (filtered.length === 0) {
    noResults.classList.remove("hidden");
    productGrid.classList.add("hidden");
    productCount.textContent = "0 Ürün";
    noResultsMsg.textContent = "Bu filtrelere uygun sonuç bulunamadı.";
    return;
  }

  noResults.classList.add("hidden");
  productGrid.classList.remove("hidden");
  productCount.textContent = `${filtered.length} Ürün`;

  filtered.forEach((p, idx) => {
    const season = getSeasonIcon(p.season);
    const displaySize = p.size || p.description || "";
    const displayModel = p.model || "";
    const displayBrand = p.brand || "";
    const loadStr = p.load ? ` ${p.load}` : "";

    // Ürüne özel görsel: model bazlı > Excel özel görsel > segment varsayılan
    const imgSrc = getProductImage(p);

    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${Math.min(idx * 0.04, 0.4)}s`;
    
    // Sağ üst mevsim amblem rozeti (jant ise gösterilmez)
    const seasonBadge = activeSegment !== 'jant'
      ? `<span class="card-season-badge ${season.cls}" title="${season.label}">${season.emoji}</span>`
      : '';
    
    card.innerHTML = `
      ${seasonBadge}
      <div class="card-image-wrap${getModelImage(p) ? ' white-bg' : ''}">
        <img src="${imgSrc}" alt="${p.description}" loading="lazy" onerror="this.src='${activeSegment === 'jant' ? JANT_IMAGE_SRC : TIRE_IMAGE_SRC}'" />
      </div>
      <div class="card-body">
        <div class="card-brand-row">
          ${getBrandLogoHTML(displayBrand)}
          ${p.dot ? `<span class="meta-tag dot">DOT ${p.dot}</span>` : ""}
        </div>
        <div class="card-size">${displaySize}${loadStr}</div>
        ${displayModel ? `<div class="card-model">${displayModel}</div>` : ""}
        <div class="card-meta">
          ${p.code ? `<span class="meta-tag code">${String(p.code).replace(/^[\/#\\]+/, '').trim()}</span>` : "<span></span>"}
          ${p.stok ? `<span class="meta-tag stok">STK: ${p.stok}</span>` : "<span></span>"}
        </div>
      </div>
    `;
    card.addEventListener("click", () => openModal(p));
    productGrid.appendChild(card);
  });
}

function updateActiveFiltersUI() {
  activeFiltersDiv.innerHTML = "";
  
  if (currentBrand !== "all") {
    activeFiltersDiv.innerHTML += `
      <div class="filter-chip">
        Marka: ${currentBrand}
        <button onclick="clearFilter('brand')">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>`;
  }

  if (searchQuery) {
    activeFiltersDiv.innerHTML += `
      <div class="filter-chip">
        Arama: "${searchQuery}"
        <button onclick="clearSearchFilter()">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>`;
  }

  if (activeFiltersDiv.innerHTML.trim() !== "") {
    activeFiltersContainer.classList.remove("hidden");
  } else {
    activeFiltersContainer.classList.add("hidden");
  }
}

// Global functions for inline HTML calls
window.clearFilter = function(type) {
  if (type === 'brand') {
    currentBrand = 'all';
    document.querySelectorAll('#brandsMenu .sub-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('#brandsMenu .sub-nav-btn[data-filter-value="all"]').classList.add('active');
  }
  renderProducts();
};

window.clearSearchFilter = function() {
  searchInput.value = "";
  searchQuery = "";
  searchBar.classList.add("hidden");
  renderProducts();
}

// ---- MODAL ----
function openModal(p) {
  const season = getSeasonIcon(p.season);
  const seasonColorCls = season.cls === "summer" ? "summer-color" : season.cls === "winter" ? "winter-color" : "green-color";

  // Modal'da da ürüne özel görsel kullan
  const modalImg = getProductImage(p);

  const isJant = activeSegment === "jant";

  // Jant için detail kartları özel
  const detailCards = isJant ? `
    <div class="detail-card">
      <div class="detail-label">📏 İnç</div>
      <div class="detail-value accent">${p.inc ? p.inc + '"' : "-"}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">🔩 Bijon Aralığı</div>
      <div class="detail-value">${p.bjon || "-"}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">↔️ Ofset</div>
      <div class="detail-value">${p.ofset || "-"}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">⭕ Göbek</div>
      <div class="detail-value">${p.goebek || "-"}</div>
    </div>
    ${p.stok ? `
    <div class="detail-card" style="border: 1px solid var(--accent); background: rgba(212,175,55,0.06);">
      <div class="detail-label">📦 Stok Durumu</div>
      <div class="detail-value accent" style="font-size:1.1rem;">${p.stok}</div>
    </div>` : ''}
    <div class="detail-card">
      <div class="detail-label">🏷️ Ürün Kodu</div>
      <div class="detail-value accent">${p.code || "-"}</div>
    </div>

  ` : `
    <div class="detail-card">
      <div class="detail-label">Ürün Kodu</div>
      <div class="detail-value accent">${p.code || "-"}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">DOT / Üretim Yılı</div>
      <div class="detail-value">${p.dot || "-"}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">Mevsim</div>
      <div class="detail-value ${seasonColorCls}">${season.emoji} ${season.label}</div>
    </div>
    <div class="detail-card">
      <div class="detail-label">Yük İndeksi</div>
      <div class="detail-value">${p.load || "-"}</div>
    </div>
    ${p.stok ? `
    <div class="detail-card" style="border: 1px solid var(--accent); background: rgba(212,175,55,0.06);">
      <div class="detail-label">📦 Stok Durumu</div>
      <div class="detail-value accent" style="font-size:1.1rem;">${p.stok}</div>
    </div>` : ''}

  `;

  modalContent.innerHTML = `
    <div class="modal-image-wrap${getModelImage(p) ? ' white-bg' : ''}">
      <img src="${modalImg}" alt="${p.description}" onerror="this.src='${activeSegment === 'jant' ? JANT_IMAGE_SRC : TIRE_IMAGE_SRC}'" />
    </div>



    <div class="modal-header">
      <div>
        <div class="modal-brand">${p.brand || ''}</div>
        <div class="modal-size">${p.size || p.description}</div>
        <div class="modal-model">${p.model ? p.model + (p.load ? ' &bull; ' + p.load : '') : (p.load || '')}</div>
      </div>
      ${!isJant ? `<div class="modal-season-icon" title="${season.label}">${season.emoji}</div>` : ''}
    </div>

    <div class="modal-details">
      ${detailCards}
    </div>
  `;

  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

// ---- SEARCH HOOKS ----
searchBtn.addEventListener("click", () => {
  searchBar.classList.toggle("hidden");
  if (!searchBar.classList.contains("hidden")) {
    searchInput.focus();
  } else {
    searchQuery = "";
    searchInput.value = "";
    renderProducts();
  }
});

clearSearchBtn.addEventListener("click", () => {
  window.clearSearchFilter();
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  renderProducts();
});

// ---- SWIPE/KEYBOARD ----
let modalTouchStartY = 0;
const modal = document.getElementById("productModal");
modal.addEventListener("touchstart", e => { modalTouchStartY = e.touches[0].clientY; }, { passive: true });
modal.addEventListener("touchmove", e => {
  if (e.touches[0].clientY - modalTouchStartY > 60) {
    modalOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }
}, { passive: true });

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    modalOverlay.classList.add("hidden");
    sidebar.classList.remove("show");
    sidebarOverlay.classList.remove("show");
    document.body.style.overflow = "";
    if (!searchBar.classList.contains("hidden")) {
      searchBar.classList.add("hidden");
    }
  }
});
