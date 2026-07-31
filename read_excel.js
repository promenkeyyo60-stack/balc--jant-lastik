const XLSX = require('./node_modules/xlsx');
const wb = XLSX.readFile('veri.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

// ÜRÜN sütunundaki tüm unique değerleri bul
const urunDegerleri = {};
data.forEach(r => {
  const v = String(r['ÜRÜN'] || r['URUN'] || '').trim().toUpperCase();
  urunDegerleri[v] = (urunDegerleri[v] || 0) + 1;
});
console.log('ÜRÜN sütunu değerleri:', urunDegerleri);

const jantlar = data.filter(r => String(r['ÜRÜN'] || r['URUN'] || '').trim().toUpperCase() === 'JANT');
const lastikler = data.filter(r => String(r['ÜRÜN'] || r['URUN'] || '').trim().toUpperCase() === 'LASTİK' || String(r['ÜRÜN'] || r['URUN'] || '').trim().toUpperCase() === 'LASTIK');

console.log('JANT sayısı:', jantlar.length);
console.log('LASTİK sayısı:', lastikler.length);
console.log('Toplam:', data.length);

if (lastikler.length > 0) {
  console.log('\nLastik örnek satır:', JSON.stringify(lastikler[0]));
  console.log('Lastik örnek satır 2:', JSON.stringify(lastikler[1]));
}
if (jantlar.length > 0) {
  console.log('\nJant örnek satır:', JSON.stringify(jantlar[0]));
}
