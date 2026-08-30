/**
 * Portfolio Dashboard Exact Color Palette Tokens
 */
export const THEME_TOKENS = {
  // Page / Base Background
  bgBase: "#EDF0F7",

  // Surface / Card Background
  surface: "#FFFFFF",

  // Card Border (1px, subtle)
  cardBorder: "#E2E6EF",

  // Primary Text
  textPrimary: "#101828",

  // Secondary / Muted Text
  textSecondary: "#6B7A99",

  // Primary Accent (active tabs, primary buttons, main chart line, links)
  accent: "#3730E0",
  accentRgb: "55, 48, 224",

  // Highlight / Emphasis (active state background, badges - used sparingly)
  highlight: "#F4D03F",
  highlightText: "#101828",

  // Positive / Gain (P&L green, checkmarks, PASS style indicators)
  positive: "#1E8E5A",
  positiveLight: "#E8F5EE",

  // Negative / Loss (P&L red)
  negative: "#D64545",
  negativeLight: "#FCEBEB",

  // Neutral Icon Badges (Sharpe Ratio, Sortino Ratio, etc. cards)
  badgeBg: "#F3F4F8",
  badgeIcon: "#6B7A99",
} as const
