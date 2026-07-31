const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Sadece jant görselleri - kollar arasındaki siyah boşlukları temizle
const jantImages = [
  'jant_15.png',
  'jant_16.png', 
  'jant_17.png',
  'jant_18.png',
  'jant_19.png',
  'jant_21.png'
];

async function cleanJantSpokes(inputPath) {
  console.log(`İşleniyor: ${inputPath}...`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;
    
    // Raw RGBA olarak oku
    const rawBuffer = await image
      .ensureAlpha()
      .raw()
      .toBuffer();
    
    const pixels = new Uint8Array(rawBuffer);
    const totalPixels = width * height;
    
    // Önce kenar pikselleri kontrol et - dış çerçeve alanını beyaz yap (flood fill benzeri)
    // Basit yaklaşım: parlaklık eşiğini 50'ye çıkar
    for (let i = 0; i < totalPixels; i++) {
      const offset = i * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];
      
      const brightness = (r + g + b) / 3;
      
      // Koyu pikseller (eşik: 50) → beyaz yap
      if (brightness < 50) {
        pixels[offset] = 255;
        pixels[offset + 1] = 255;
        pixels[offset + 2] = 255;
        pixels[offset + 3] = 255;
      }
    }
    
    await sharp(Buffer.from(pixels.buffer), {
      raw: { width, height, channels: 4 }
    })
      .png({ quality: 95 })
      .toFile(inputPath + '.tmp');
    
    fs.renameSync(inputPath + '.tmp', inputPath);
    console.log(`  ✅ Başarılı: ${inputPath}`);
  } catch (err) {
    console.error(`  ❌ Hata:`, err.message);
  }
}

async function main() {
  console.log('=== Jant Kolları Arası Temizlik (eşik: 50) ===\n');
  
  for (const img of jantImages) {
    const fullPath = path.join(__dirname, img);
    if (fs.existsSync(fullPath)) {
      await cleanJantSpokes(fullPath);
    }
  }
  
  console.log('\n=== Bitti! ===');
}

main();
