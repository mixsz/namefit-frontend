const BASE = "#0e0b09";

const GLOW_BR =
  "radial-gradient(ellipse at 120% 120%, rgba(200,60,10,0.45) 0%, rgba(140,35,5,0.22) 30%, #161210 60%, " +
  BASE +
  " 100%)";
const GLOW_BL =
  "radial-gradient(ellipse at -20% 120%, rgba(200,60,10,0.38) 0%, rgba(140,35,5,0.18) 32%, #161210 62%, " +
  BASE +
  " 100%)";
const GLOW_TR =
  "radial-gradient(ellipse at 120% -20%, rgba(200,60,10,0.34) 0%, rgba(140,35,5,0.16) 34%, #161210 64%, " +
  BASE +
  " 100%)";

const STRIPE_D =
  "repeating-linear-gradient(-45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.024) 1px, transparent 1px, transparent 2px)";
const STRIPE_H =
  "repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 3px)";
const DOTS =
  "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px) 0 0 / 8px 8px";
const GRID = [
  "repeating-linear-gradient(0deg,  rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 3px)",
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 3px)",
].join(", ");
const CROSS = [
  "repeating-linear-gradient(45deg,  rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 3px)",
  "repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 3px)",
].join(", ");

export const CARD_VARIANTS = [
  { background: [STRIPE_D, GLOW_BR].join(", ") },
  { background: [DOTS, GLOW_BL].join(", ") },
  { background: [GRID, GLOW_BR].join(", ") },
  { background: [STRIPE_H, GLOW_TR].join(", ") },
  { background: [CROSS, GLOW_BL].join(", ") },
];

export function hashId(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

