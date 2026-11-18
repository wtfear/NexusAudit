import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy img assets
const imgSrc = path.join(__dirname, 'img');
const imgDest = path.join(distDir, 'img');
if (fs.existsSync(imgSrc)) {
  if (!fs.existsSync(imgDest)) {
    fs.mkdirSync(imgDest, { recursive: true });
  }
  const files = fs.readdirSync(imgSrc);
  for (const file of files) {
    fs.copyFileSync(path.join(imgSrc, file), path.join(imgDest, file));
  }
}

// Copy index.html to dist/index.html
const indexSrc = path.join(__dirname, 'index.html');
const indexDest = path.join(distDir, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, indexDest);
}

console.log('✅ NexusAudit landing distribution successfully built into dist/index.html');
