const xlsx = require('xlsx');
const workbook = xlsx.readFile('veri.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
console.log('Row 1:', data[0]);
console.log('Row 2:', data[1]);
