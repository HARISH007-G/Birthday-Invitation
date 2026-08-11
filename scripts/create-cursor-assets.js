import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Chocolate Bar SVG (Transparent)
const chocolateSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <filter id="chocShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#49362d" flood-opacity="0.35"/>
  </filter>
  <rect x="20" y="15" width="60" height="70" rx="8" fill="#5d4037" filter="url(#chocShadow)"/>
  <rect x="25" y="20" width="22" height="18" rx="4" fill="#795548"/>
  <rect x="53" y="20" width="22" height="18" rx="4" fill="#795548"/>
  <rect x="25" y="42" width="22" height="18" rx="4" fill="#795548"/>
  <rect x="53" y="42" width="22" height="18" rx="4" fill="#795548"/>
  <!-- Gold Wrapper Tear -->
  <path d="M20 62 L80 62 L80 80 Q80 85 75 85 L25 85 Q20 85 20 80 Z" fill="#f5c65d"/>
  <path d="M20 62 L80 62 L75 66 L25 66 Z" fill="#fff3d1"/>
</svg>`;

// 2. Birthday Cake SVG (Transparent)
const cakeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <filter id="cakeShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#49362d" flood-opacity="0.3"/>
  </filter>
  <!-- Cake Base Layer -->
  <rect x="15" y="55" width="70" height="30" rx="6" fill="#f3a187" filter="url(#cakeShadow)"/>
  <rect x="15" y="55" width="70" height="10" fill="#fff3d1"/>
  <!-- Top Layer -->
  <rect x="25" y="35" width="50" height="22" rx="5" fill="#f5c65d"/>
  <rect x="25" y="35" width="50" height="8" fill="#ffffff"/>
  <!-- Frosting Drips -->
  <circle cx="25" cy="43" r="4" fill="#ffffff"/>
  <circle cx="40" cy="45" r="4" fill="#ffffff"/>
  <circle cx="60" cy="44" r="4" fill="#ffffff"/>
  <circle cx="75" cy="43" r="4" fill="#ffffff"/>
  <!-- Candle -->
  <rect x="47" y="18" width="6" height="18" rx="2" fill="#ba68c8"/>
  <!-- Candle Flame -->
  <path d="M50 8 Q55 14 50 19 Q45 14 50 8 Z" fill="#ff9800"/>
  <circle cx="50" cy="14" r="2.5" fill="#ffeb3b"/>
</svg>`;

// 3. Candy Lollipop SVG (Transparent)
const candySVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <filter id="candyShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#49362d" flood-opacity="0.3"/>
  </filter>
  <!-- Stick -->
  <rect x="47" y="50" width="6" height="42" rx="3" fill="#ffffff" filter="url(#candyShadow)"/>
  <!-- Spiral Swirl Candy -->
  <circle cx="50" cy="35" r="28" fill="#f3a187" filter="url(#candyShadow)"/>
  <path d="M50 35 M50 10 A25 25 0 0 1 75 35 A18 18 0 0 1 50 53 A12 12 0 0 1 32 35 A6 6 0 0 1 50 30" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none"/>
</svg>`;

// 4. Gold Birthday Crown SVG (Transparent)
const crownSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <filter id="crownShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#49362d" flood-opacity="0.3"/>
  </filter>
  <path d="M15 70 L22 30 L40 50 L50 20 L60 50 L78 30 L85 70 Z" fill="#f5c65d" filter="url(#crownShadow)"/>
  <rect x="15" y="68" width="70" height="12" rx="4" fill="#e5a823"/>
  <!-- Jewels -->
  <circle cx="50" cy="20" r="4" fill="#e53935"/>
  <circle cx="22" cy="30" r="3.5" fill="#29b6f6"/>
  <circle cx="78" cy="30" r="3.5" fill="#29b6f6"/>
  <circle cx="35" cy="74" r="3" fill="#ffffff"/>
  <circle cx="50" cy="74" r="3.5" fill="#e53935"/>
  <circle cx="65" cy="74" r="3" fill="#ffffff"/>
</svg>`;

// 5. Teddy Bear SVG (Transparent)
const teddySVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <filter id="teddyShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#49362d" flood-opacity="0.3"/>
  </filter>
  <!-- Ears -->
  <circle cx="28" cy="28" r="14" fill="#8d6e63" filter="url(#teddyShadow)"/>
  <circle cx="28" cy="28" r="8" fill="#d7ccc8"/>
  <circle cx="72" cy="28" r="14" fill="#8d6e63" filter="url(#teddyShadow)"/>
  <circle cx="72" cy="28" r="8" fill="#d7ccc8"/>
  <!-- Head -->
  <circle cx="50" cy="45" r="28" fill="#a1887f" filter="url(#teddyShadow)"/>
  <!-- Snout -->
  <ellipse cx="50" cy="52" rx="12" ry="9" fill="#d7ccc8"/>
  <ellipse cx="50" cy="48" rx="5" ry="3.5" fill="#4e342e"/>
  <!-- Eyes -->
  <circle cx="40" cy="40" r="3.5" fill="#3e2723"/>
  <circle cx="60" cy="40" r="3.5" fill="#3e2723"/>
  <!-- Pink Bowtie -->
  <polygon points="42,66 50,71 42,76" fill="#f3a187"/>
  <polygon points="58,66 50,71 58,76" fill="#f3a187"/>
  <circle cx="50" cy="71" r="3" fill="#e53935"/>
</svg>`;

// 6. Gift Box SVG (Transparent)
const giftSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <filter id="giftShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#49362d" flood-opacity="0.3"/>
  </filter>
  <!-- Box Base -->
  <rect x="20" y="42" width="60" height="45" rx="6" fill="#29b6f6" filter="url(#giftShadow)"/>
  <rect x="44" y="42" width="12" height="45" fill="#f3a187"/>
  <!-- Lid -->
  <rect x="15" y="32" width="70" height="14" rx="4" fill="#0288d1" filter="url(#giftShadow)"/>
  <rect x="44" y="32" width="12" height="14" fill="#f3a187"/>
  <!-- Bow -->
  <circle cx="38" cy="24" r="10" fill="#f3a187"/>
  <circle cx="62" cy="24" r="10" fill="#f3a187"/>
  <circle cx="50" cy="26" r="5" fill="#e53935"/>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'chocolate.svg'), chocolateSVG);
fs.writeFileSync(path.join(outputDir, 'cake.svg'), cakeSVG);
fs.writeFileSync(path.join(outputDir, 'candy.svg'), candySVG);
fs.writeFileSync(path.join(outputDir, 'crown.svg'), crownSVG);
fs.writeFileSync(path.join(outputDir, 'teddy.svg'), teddySVG);
fs.writeFileSync(path.join(outputDir, 'gift.svg'), giftSVG);

console.log('Successfully generated transparent chocolate, cake, candy, crown, teddy, and gift SVG assets!');
