const XLSX = require('xlsx');
const wb = XLSX.readFile('veri.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

const janlar = data.filter(r => String(r['URÜN']||r['ÜRÜN']||'').toUpperCase() === 'JANT' || Object.values(r).some(v => String(v).toUpperCase().trim() === 'JANT'));
const lastikler = data.filter(r => Object.values(r).some(v => String(v).toUpperCase().trim().includes('LAST')));

// Get unique jant models/descriptions
const jantModels = [...new Set(janlar.map(r => r['ÜRÜN AÇIKLAMASI'] || ''))].filter(Boolean);
// Get renk ve model patterns
const renk_patterns = jantModels.map(m => {
  const match = m.match(/([A-Za-z][A-Za-z0-9 ]+)$/);
  return match ? match[0].trim() : '';
}).filter(Boolean);
const unique_renkler = [...new Set(renk_patterns)];

console.log('JANT MODELS:', JSON.stringify(jantModels, null, 2));
console.log('\nRENKLER/MODELLER:', JSON.stringify(unique_renkler, null, 2));
console.log('\nJANT MARKA DETAY:');
['RC','CARRE','CMS','DJ'].forEach(b => {
  const items = janlar.filter(r => r['MARKA'] === b);
  const descs = [...new Set(items.map(r => r['ÜRÜN AÇIKLAMASI']))];
  console.log(`${b} (${items.length} adet):`, JSON.stringify(descs.slice(0,8)));
});
