import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createSVGPlaceholder(title, subtitle, monthTag, bgColor, accentColor, icon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" />
      <stop offset="100%" stop-color="#fff8ee" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#49362d" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#bgGrad)" />
  <circle cx="120" cy="140" r="8" fill="${accentColor}" opacity="0.4"/>
  <circle cx="700" cy="180" r="12" fill="${accentColor}" opacity="0.3"/>
  <circle cx="160" cy="680" r="10" fill="${accentColor}" opacity="0.3"/>
  <circle cx="660" cy="650" r="7" fill="${accentColor}" opacity="0.4"/>

  <rect x="80" y="80" width="640" height="640" rx="36" fill="#ffffff" filter="url(#shadow)"/>
  
  <rect x="110" y="110" width="580" height="480" rx="24" fill="${bgColor}" opacity="0.35"/>
  <rect x="110" y="110" width="580" height="480" rx="24" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="12 12" opacity="0.6"/>

  <g transform="translate(400, 310)">
    <circle r="70" fill="#ffffff" filter="url(#shadow)"/>
    <text x="0" y="24" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="64" text-anchor="middle" fill="${accentColor}">${icon}</text>
  </g>

  ${monthTag ? `
  <g transform="translate(140, 140)">
    <rect width="110" height="46" rx="23" fill="${accentColor}"/>
    <text x="55" y="30" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff" text-anchor="middle">MONTH ${monthTag}</text>
  </g>
  ` : ''}

  <text x="400" y="635" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" fill="#49362d" text-anchor="middle">${title}</text>
  <text x="400" y="675" font-family="'Nunito', sans-serif" font-size="22" font-weight="600" fill="${accentColor}" text-anchor="middle">${subtitle}</text>
  
  <polygon points="90,70 160,70 140,110 70,110" fill="#f5c65d" opacity="0.65"/>
  <polygon points="710,70 640,70 660,110 730,110" fill="#f5c65d" opacity="0.65"/>
</svg>`;
}

const months = [
  { m: "01", title: "Hello, World", date: "September 2025", bg: "#f5d6d0", accent: "#f3a187", icon: "👶" },
  { m: "02", title: "The Sweetest Smile", date: "October 2025", bg: "#fff3d1", accent: "#f5c65d", icon: "😊" },
  { m: "03", title: "Little Giggles", date: "November 2025", bg: "#e2f0d9", accent: "#afc6a4", icon: "🎵" },
  { m: "04", title: "Curious Little Eyes", date: "December 2025", bg: "#dbebf2", accent: "#b9dde4", icon: "⭐" },
  { m: "05", title: "Reaching for the World", date: "January 2026", bg: "#f3e5f5", accent: "#ba68c8", icon: "💖" },
  { m: "06", title: "Halfway to One", date: "February 2026", bg: "#fff3e0", accent: "#ff8a65", icon: "🎂" },
  { m: "07", title: "Little Explorer", date: "March 2026", bg: "#e8f5e9", accent: "#66bb6a", icon: "🧭" },
  { m: "08", title: "Playtime Adventures", date: "April 2026", bg: "#e1f5fe", accent: "#29b6f6", icon: "🎁" },
  { m: "09", title: "Full of Wonder", date: "May 2026", bg: "#fce4ec", accent: "#ec407a", icon: "📷" },
  { m: "10", title: "Tiny Adventures", date: "June 2026", bg: "#fff8e1", accent: "#ffa726", icon: "🎈" },
  { m: "11", title: "Almost One", date: "July 2026", bg: "#f3e5f5", accent: "#ab47bc", icon: "👑" },
  { m: "12", title: "One Wonderful Year", date: "August 2026", bg: "#fff3d1", accent: "#f5c65d", icon: "✨" },
];

months.forEach(item => {
  const svg = createSVGPlaceholder(item.title, item.date, item.m, item.bg, item.accent, item.icon);
  fs.writeFileSync(path.join(outputDir, `month-${item.m}.jpg`), svg);
  fs.writeFileSync(path.join(outputDir, `month-${item.m}.png`), svg);
});

const heroSVG = createSVGPlaceholder("Hanvika's 1st Birthday", "Our Little Sunshine", null, "#fff3d1", "#f5c65d", "☀️");
fs.writeFileSync(path.join(outputDir, "hero.jpg"), heroSVG);

const newbornSVG = createSVGPlaceholder("Newborn Hanvika", "September 2025 • Tiny Miracle", "NEWBORN", "#f5d6d0", "#f3a187", "🍼");
fs.writeFileSync(path.join(outputDir, "newborn.jpg"), newbornSVG);

const birthdaySVG = createSVGPlaceholder("Hanvika Turns One!", "September 2026 • 1 Year Old", "TURNS ONE", "#fff3d1", "#f5c65d", "🎉");
fs.writeFileSync(path.join(outputDir, "birthday.jpg"), birthdaySVG);

const gallery = [
  { name: "gallery-01", title: "Our Sweetest Smile", bg: "#f5d6d0", accent: "#f3a187", icon: "🥰" },
  { name: "gallery-02", title: "Little Hands, Big Dreams", bg: "#fff3d1", accent: "#f5c65d", icon: "🌟" },
  { name: "gallery-03", title: "Growing So Beautifully", bg: "#e2f0d9", accent: "#afc6a4", icon: "🌿" },
  { name: "gallery-04", title: "Family Cuddles", bg: "#dbebf2", accent: "#b9dde4", icon: "🤗" },
  { name: "gallery-05", title: "Tiny Explorer", bg: "#f3e5f5", accent: "#ba68c8", icon: "🚀" },
  { name: "gallery-06", title: "Our Happy Place", bg: "#fff3e0", accent: "#ff8a65", icon: "🌈" },
];

gallery.forEach(item => {
  const svg = createSVGPlaceholder(item.title, "Hanvika's Memory", null, item.bg, item.accent, item.icon);
  fs.writeFileSync(path.join(outputDir, `${item.name}.jpg`), svg);
});

const family = [
  { name: "family-01", title: "My Favorite People", bg: "#f5d6d0", accent: "#f3a187", icon: "👨‍👩‍👧" },
  { name: "family-02", title: "Always Surrounded by Love", bg: "#fff3d1", accent: "#f5c65d", icon: "❤️" },
  { name: "family-03", title: "Our Little Family", bg: "#e2f0d9", accent: "#afc6a4", icon: "🏡" },
  { name: "family-04", title: "The Happiest Cuddles", bg: "#dbebf2", accent: "#b9dde4", icon: "✨" },
];

family.forEach(item => {
  const svg = createSVGPlaceholder(item.title, "Precious Memory", null, item.bg, item.accent, item.icon);
  fs.writeFileSync(path.join(outputDir, `${item.name}.jpg`), svg);
});

console.log("Successfully generated all placeholder assets!");
