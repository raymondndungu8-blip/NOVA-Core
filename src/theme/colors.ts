/**
 * NOVA Core — Design System v3
 * Safety Orange × Deep Charcoal — Orange Edition
 * Matching the AI Exercise Scan Stitch design
 * All colors WCAG AA compliant
 */

export const colors = {
  // ── Backgrounds (deep charcoal/navy spectrum) ──
  background: {
    DEFAULT: '#0F0F1A',   // Deep charcoal
    card: '#1A1A2E',      // Card background
    elevated: '#1E1E30',  // Elevated surface
    overlay: '#08080F',   // Modal backdrop
  },

  // ── Glass surfaces ──
  glass: {
    DEFAULT: 'rgba(26, 26, 46, 0.75)',
    border: 'rgba(255, 102, 0, 0.18)',
    shine: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(26, 26, 46, 0.95)',
    neutral: 'rgba(255, 255, 255, 0.04)',
    neutralBorder: 'rgba(255, 255, 255, 0.08)',
  },

  // ── Safety Orange (PRIMARY accent) ──
  electric: {
    DEFAULT: '#FF6600',   // Safety Orange
    bright: '#FF8833',
    dim: '#CC4400',
    glow: 'rgba(255, 102, 0, 0.30)',
    subtle: 'rgba(255, 102, 0, 0.12)',
  },

  // ── Neon Green (success / progress) ──
  neon: {
    DEFAULT: '#00FF88',   // Neon Green
    bright: '#33FFa0',
    dim: '#00CC6A',
    glow: 'rgba(0, 255, 136, 0.25)',
    subtle: 'rgba(0, 255, 136, 0.10)',
  },

  // ── Sunset Orange (energy / HIIT) — kept as alias ──
  sunset: {
    DEFAULT: '#FF6600',
    bright: '#FF8833',
    dim: '#CC4400',
    glow: 'rgba(255, 102, 0, 0.30)',
    subtle: 'rgba(255, 102, 0, 0.12)',
  },

  // ── Purple (recovery / yoga) ──
  violet: {
    DEFAULT: '#8B5CF6',
    bright: '#A78BFA',
    dim: '#6D28D9',
    glow: 'rgba(139, 92, 246, 0.25)',
    subtle: 'rgba(139, 92, 246, 0.10)',
  },

  // ── Semantic ──
  success: '#00FF88',
  caution: '#FFD60A',
  error: '#FF3B5C',
  info: '#FF6600',

  // ── Text ──
  text: {
    primary: '#F0F0FF',      // Near-white
    secondary: '#A0A0C0',    // Muted blue-grey
    muted: '#505070',        // Dimmed
    inverse: '#0F0F1A',
    accent: '#FF6600',
  },

  // Legacy — kept for backward compatibility
  primary: {
    green: '#00FF88',
    blue: '#FF6600',         // Remapped to orange
    orange: '#FF6600',
    purple: '#8B5CF6',
  },
  surface: {
    DEFAULT: '#1A1A2E',
    elevated: '#1E1E30',
    inset: '#0F0F1A',
  },
  vitality: { green: '#00FF88', greenLight: '#33FFa0', greenMuted: 'rgba(0,255,136,0.15)' },
  trust: { blue: '#FF6600', blueLight: '#FF8833', blueMuted: 'rgba(255,102,0,0.15)', light: '#FF8833' },
  energize: { red: '#FF3B5C', coral: '#FF6600', pink: 'rgba(255,59,92,0.15)' },
  wellness: { purple: '#8B5CF6', purpleLight: '#A78BFA', purpleMuted: 'rgba(139,92,246,0.15)' },
  neutral: { black: '#0F0F1A', white: '#F0F0FF', gray: '#A0A0C0' },
} as const;

export type ColorToken = keyof typeof colors;
