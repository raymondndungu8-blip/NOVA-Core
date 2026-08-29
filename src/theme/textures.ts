/**
 * NOVA Core — Tactile Textures
 * Subtle grain/noise overlays — signals hand-crafted design
 * Apply as overlay with 2–4% opacity
 */

/** Base64 SVG grain pattern — use as background-image with low opacity */
export const grainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

/** CSS opacity for grain overlay — apply to overlay element */
export const grainOverlayOpacity = 0.03;

/** React Native: use a semi-transparent overlay with noise texture image, or skip on RN */
export const textureOpacity = 0.025;
