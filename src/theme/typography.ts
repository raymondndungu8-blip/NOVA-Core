/**
 * NOVA Core — Typography System
 * Anti-vibe: Serif (headings) + Sans-serif (UI), 8px baseline grid
 */

// 8px baseline grid — all spacing & line-heights snap to multiples of 8
export const baselineGrid = 8;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.25,   // 24px at 20px = snaps to 8
    normal: 1.5,   // 24px at 16px = snaps to 8
    relaxed: 1.75,
    loose: 2,
  },
} as const;

/** Font pairing — Serif for headings, Sans for UI */
export const fontFamilies = {
  heading: 'Georgia, "Times New Roman", serif',  // Serif — authority
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',  // UI legibility
  mono: 'ui-monospace, "Cascadia Code", monospace',
};

/** For Expo/RN: use expo-font to load Source Serif 4 + Source Sans 3 if desired */
export const customFonts = {
  heading: 'SourceSerif4_400Regular',
  headingBold: 'SourceSerif4_700Bold',
  body: 'SourceSans3_400Regular',
  bodySemi: 'SourceSans3_600SemiBold',
};

// Semantic presets — align to baseline grid
export const textPresets = {
  heading1: {
    fontSize: typography.fontSize['4xl'],   // 32px
    lineHeight: 40,                         // 8px grid
    fontWeight: typography.fontWeight.bold,
    fontFamily: fontFamilies.heading,
  },
  heading2: {
    fontSize: typography.fontSize['3xl'],
    lineHeight: 36,
    fontWeight: typography.fontWeight.bold,
    fontFamily: fontFamilies.heading,
  },
  heading3: {
    fontSize: typography.fontSize['2xl'],
    lineHeight: 32,
    fontWeight: typography.fontWeight.bold,
    fontFamily: fontFamilies.heading,
  },
  heading4: {
    fontSize: typography.fontSize.xl,
    lineHeight: 28,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: fontFamilies.heading,
  },
  body: {
    fontSize: typography.fontSize.base,
    lineHeight: 24,
    fontWeight: typography.fontWeight.regular,
    fontFamily: fontFamilies.body,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    fontWeight: typography.fontWeight.regular,
    fontFamily: fontFamilies.body,
  },
  caption: {
    fontSize: typography.fontSize.sm,       // Never below 14px for UI
    lineHeight: 20,
    fontWeight: typography.fontWeight.regular,
    fontFamily: fontFamilies.body,
  },
  button: {
    fontSize: typography.fontSize.base,
    lineHeight: 24,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: fontFamilies.body,
  },
  label: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    fontWeight: typography.fontWeight.medium,
    fontFamily: fontFamilies.body,
  },
} as const;
