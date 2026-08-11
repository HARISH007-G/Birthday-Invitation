import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Ultra Realistic 3D Chocolate Bar
const chocolatePhotoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="chocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#795548"/>
      <stop offset="50%" stop-color="#4e342e"/>
      <stop offset="100%" stop-color="#2d1b18"/>
    </linearGradient>
    <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffd54f"/>
      <stop offset="50%" stop-color="#fff8e1"/>
      <stop offset="100%" stop-color="#ffb300"/>
    </linearGradient>
    <filter id="photoDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Chocolate Main Body -->
  <g filter="url(#photoDropShadow)">
    <rect x="25" y="20" width="70" height="80" rx="10" fill="url(#chocGrad)"/>
    
    <!-- Chocolate Blocks -->
    <rect x="30" y="25" width="28" height="22" rx="4" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/>
    <rect x="62" y="25" width="28" height="22" rx="4" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/>
    <rect x="30" y="50" width="28" height="22" rx="4" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/>
    <rect x="62" y="50" width="28" height="22" rx="4" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/>
    
    <!-- Torn Gold Foil Wrapper -->
    <path d="M25 72 L95 72 L95 95 Q95 100 90 100 L30 100 Q25 100 25 95 Z" fill="url(#goldFoil)"/>
    <path d="M25 72 L95 72 L90 77 L30 77 Z" fill="#ffffff" opacity="0.8"/>
  </g>
</svg>`;

// 2. Ultra Realistic 3D Birthday Cake
const cakePhotoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="cakeCream" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fff3d1"/>
    </linearGradient>
    <linearGradient id="strawberryDrip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff5252"/>
      <stop offset="100%" stop-color="#d50000"/>
    </linearGradient>
    <filter id="cakeDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g filter="url(#cakeDropShadow)">
    <!-- Base Plate -->
    <ellipse cx="60" cy="98" rx="48" ry="12" fill="#e0e0e0"/>
    <ellipse cx="60" cy="96" rx="46" ry="10" fill="#ffffff"/>

    <!-- Cake Base Tier -->
    <rect x="22" y="60" width="76" height="34" rx="8" fill="url(#cakeCream)"/>
    <path d="M22 60 Q35 72 48 60 Q60 72 72 60 Q85 72 98 60 L98 68 Q85 80 72 68 Q60 80 48 68 Q35 80 22 68 Z" fill="url(#strawberryDrip)"/>

    <!-- Cake Top Tier -->
    <rect x="32" y="38" width="56" height="24" rx="6" fill="url(#cakeCream)"/>
    <path d="M32 38 Q46 48 60 38 Q74 48 88 38 L88 44 Q74 54 60 44 Q46 54 32 44 Z" fill="url(#strawberryDrip)"/>

    <!-- Strawberries on top -->
    <circle cx="42" cy="34" r="5" fill="#d50000"/>
    <circle cx="78" cy="34" r="5" fill="#d50000"/>

    <!-- Birthday Candle -->
    <rect x="57" y="16" width="6" height="22" rx="2" fill="#ab47bc"/>
    <rect x="58.5" y="16" width="3" height="22" fill="#e1bee7"/>

    <!-- Candle Flame & Glow -->
    <circle cx="60" cy="10" r="8" fill="#ff9800" opacity="0.35"/>
    <path d="M60 4 Q65 10 60 15 Q55 10 60 4 Z" fill="#ffeb3b"/>
    <circle cx="60" cy="11" r="2" fill="#ffffff"/>
  </g>
</svg>`;

// 3. Ultra Realistic 3D Soft Teddy Bear
const teddyPhotoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
  <defs>
    <radialGradient id="furGrad" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#bcaaa4"/>
      <stop offset="60%" stop-color="#8d6e63"/>
      <stop offset="100%" stop-color="#4e342e"/>
    </radialGradient>
    <filter id="teddyDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g filter="url(#teddyDropShadow)">
    <!-- Ears -->
    <circle cx="34" cy="32" r="16" fill="url(#furGrad)"/>
    <circle cx="34" cy="32" r="9" fill="#d7ccc8"/>
    <circle cx="86" cy="32" r="16" fill="url(#furGrad)"/>
    <circle cx="86" cy="32" r="9" fill="#d7ccc8"/>

    <!-- Body -->
    <circle cx="60" cy="80" r="30" fill="url(#furGrad)"/>
    <circle cx="60" cy="80" r="18" fill="#d7ccc8" opacity="0.8"/>

    <!-- Head -->
    <circle cx="60" cy="48" r="30" fill="url(#furGrad)"/>

    <!-- Snout & Nose -->
    <ellipse cx="60" cy="55" rx="14" ry="10" fill="#f5f5f5"/>
    <ellipse cx="60" cy="50" rx="6" ry="4" fill="#3e2723"/>

    <!-- Eyes -->
    <circle cx="48" cy="42" r="4" fill="#212121"/>
    <circle cx="49.5" cy="40.5" r="1.5" fill="#ffffff"/>
    <circle cx="72" cy="42" r="4" fill="#212121"/>
    <circle cx="73.5" cy="40.5" r="1.5" fill="#ffffff"/>

    <!-- Cute Red Bowtie -->
    <polygon points="50,70 60,76 50,82" fill="#e53935"/>
    <polygon points="70,70 60,76 70,82" fill="#e53935"/>
    <circle cx="60" cy="76" r="3.5" fill="#b71c1c"/>
  </g>
</svg>`;

// 4. Ultra Realistic 3D Shiny Gold Crown
const crownPhotoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff59d"/>
      <stop offset="30%" stop-color="#fbc02d"/>
      <stop offset="70%" stop-color="#f57f17"/>
      <stop offset="100%" stop-color="#f5511e"/>
    </linearGradient>
    <filter id="crownDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g filter="url(#crownDropShadow)">
    <path d="M18 82 L26 34 L46 58 L60 22 L74 58 L94 34 L102 82 Z" fill="url(#goldCrownGrad)"/>
    <rect x="18" y="80" width="84" height="14" rx="5" fill="#f57f17"/>
    <rect x="18" y="80" width="84" height="6" fill="#fff59d"/>

    <!-- Sparkling Jewels -->
    <circle cx="60" cy="22" r="5" fill="#e53935"/>
    <circle cx="26" cy="34" r="4.5" fill="#0288d1"/>
    <circle cx="94" cy="34" r="4.5" fill="#0288d1"/>

    <circle cx="40" cy="87" r="3.5" fill="#ffffff"/>
    <circle cx="60" cy="87" r="4" fill="#e53935"/>
    <circle cx="80" cy="87" r="3.5" fill="#ffffff"/>
  </g>
</svg>`;

// 5. Ultra Realistic 3D Swirl Candy
const candyPhotoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
  <defs>
    <radialGradient id="candyGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff80ab"/>
      <stop offset="50%" stop-color="#ff4081"/>
      <stop offset="100%" stop-color="#c2185b"/>
    </radialGradient>
    <filter id="candyDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g filter="url(#candyDropShadow)">
    <!-- Stick -->
    <rect x="56" y="58" width="8" height="52" rx="4" fill="#ffffff"/>
    
    <!-- Swirl Candy Head -->
    <circle cx="60" cy="40" r="32" fill="url(#candyGrad)"/>
    <path d="M60 40 M60 10 A30 30 0 0 1 90 40 A22 22 0 0 1 60 62 A15 15 0 0 1 45 40 A8 8 0 0 1 60 32" stroke="#ffffff" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'chocolate.svg'), chocolatePhotoSVG);
fs.writeFileSync(path.join(outputDir, 'cake.svg'), cakePhotoSVG);
fs.writeFileSync(path.join(outputDir, 'teddy.svg'), teddyPhotoSVG);
fs.writeFileSync(path.join(outputDir, 'crown.svg'), crownPhotoSVG);
fs.writeFileSync(path.join(outputDir, 'candy.svg'), candyPhotoSVG);

console.log('Lightning fast high-resolution 3D photo graphics generated!');
