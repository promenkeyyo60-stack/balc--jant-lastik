const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function cleanTireBackground() {
  const inputPath = path.join(__dirname, 'tire.png');
  console.log(`Strict Black Flood-Fill Processing: ${inputPath}...`);
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    const rawBuffer = await image.ensureAlpha().raw().toBuffer();
    const pixels = new Uint8Array(rawBuffer);
    const visited = new Uint8Array(width * height);

    const queue = [];
    function addSeed(x, y) {
      const idx = y * width + x;
      if (!visited[idx]) {
        visited[idx] = 1;
        queue.push(idx);
      }
    }

    for (let x = 0; x < width; x++) {
      addSeed(x, 0);
      addSeed(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      addSeed(0, y);
      addSeed(width - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const idx = queue[head++];
      const x = idx % width;
      const y = Math.floor(idx / width);
      const pixOffset = idx * 4;

      const r = pixels[pixOffset];
      const g = pixels[pixOffset + 1];
      const b = pixels[pixOffset + 2];

      // Strict black background check (pure black background pixels)
      if (r < 25 && g < 25 && b < 25) {
        pixels[pixOffset] = 255;
        pixels[pixOffset + 1] = 255;
        pixels[pixOffset + 2] = 255;
        pixels[pixOffset + 3] = 255;

        const neighbors = [
          { nx: x + 1, ny: y },
          { nx: x - 1, ny: y },
          { nx: x, ny: y + 1 },
          { nx: x, ny: y - 1 }
        ];

        for (const { nx, ny } of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (!visited[nIdx]) {
              visited[nIdx] = 1;
              queue.push(nIdx);
            }
          }
        }
      }
    }

    const tmpPath = inputPath + '.tmp';
    await sharp(Buffer.from(pixels.buffer), {
      raw: { width, height, channels: 4 }
    })
      .png({ quality: 95 })
      .toFile(tmpPath);

    fs.renameSync(tmpPath, inputPath);
    console.log(`  ✅ Successfully cleaned tire.png with strict threshold!`);
  } catch (err) {
    console.error(`  ❌ Error processing tire.png:`, err.message);
  }
}

cleanTireBackground();
