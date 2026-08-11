import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createBalloonSVG(mainColor, highlightColor, stringColor = "#49362d") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="220" viewBox="0 0 140 220" fill="none">
  <defs>
    <radialGradient id="balloonGlow_${mainColor.replace('#', '')}" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65"/>
      <stop offset="30%" stop-color="${highlightColor}"/>
      <stop offset="100%" stop-color="${mainColor}"/>
    </radialGradient>
    <filter id="balloonShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Balloon Main Oval Body -->
  <ellipse cx="70" cy="70" rx="55" ry="65" fill="url(#balloonGlow_${mainColor.replace('#', '')})" filter="url(#balloonShadow)" />

  <!-- Soft Specular Reflection Highlight -->
  <ellipse cx="48" cy="45" rx="16" ry="24" fill="#ffffff" opacity="0.45" transform="rotate(-25 48 45)"/>

  <!-- Knot -->
  <polygon points="62,133 78,133 70,143" fill="${mainColor}" />

  <!-- Trailing String -->
  <path d="M70 143 C60 165, 80 185, 68 215" stroke="${stringColor}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" />
</svg>`;
}

const balloons = [
  { name: 'balloon-red', main: '#e53935', highlight: '#ff6e40' },
  { name: 'balloon-gold', main: '#f5c65d', highlight: '#fff3d1' },
  { name: 'balloon-pink', main: '#f3a187', highlight: '#f5d6d0' },
  { name: 'balloon-blue', main: '#29b6f6', highlight: '#b9dde4' },
  { name: 'balloon-purple', main: '#ba68c8', highlight: '#f3e5f5' },
  { name: 'balloon-teal', main: '#26a69a', highlight: '#e2f0d9' },
];

balloons.forEach(b => {
  const svg = createBalloonSVG(b.main, b.highlight);
  fs.writeFileSync(path.join(outputDir, `${b.name}.svg`), svg);
  fs.writeFileSync(path.join(outputDir, `${b.name}.png`), svg); // Browsers render SVG data directly
});

console.log('Successfully generated all colorful balloon PNG/SVG assets!');
