/*
 * Digito — the theme switcher's config (the footer's "Theme" row; the
 * owner's rule of 9 November 2026: "colour palettes and light / dark themes
 * in the footer; a click changes the site's theme").
 *
 * The switcher itself is Layout-agnostic (components/theme-switcher/); this
 * file is everything Digito-specific: the palettes, which Digito and Kalio
 * variables each palette value feeds, the dark token set, and Vuetify's dark
 * surfaces. storefront.ts calls bootThemeSwitcher(DIGITO_THEME, vuetify)
 * before mounting, so the chosen theme paints first, with no flash.
 *
 * Contrast (WCAG 2.1, measured): white on each light primary — blue 6.97,
 * emerald 5.48, violet 7.10, teal 5.36, orange 5.18; white on each dark
 * primary — 5.17, 5.48, 5.70, 5.36, 5.18; each dark "text" colour on the
 * dark card #161d2e — 7.86, 11.03, 9.11, 11.60, 9.97. "pop" is the accent
 * word on the header colour (light primary in both modes): Digito's yellow
 * where it reads 4.5:1 or more (blue 5.05, violet 5.14), else a pale yellow.
 */
import type { ThemeSwitcherConfig } from "../theme-switcher/theme-switcher";

export const DIGITO_THEME: ThemeSwitcherConfig = {
  storageKey: "digito-theme",
  darkClass: "dg-dark",

  palettes: [
    {
      id: "blue",
      name: "Digito blue",
      light: { primary: "#0a4bd8", deep: "#0838a8", soft: "#e8efff", onPrimary: "#ffffff", text: "#0a4bd8", pop: "#ffd91a" },
      dark: { primary: "#2563eb", deep: "#1d4ed8", soft: "#16264d", onPrimary: "#ffffff", text: "#8fb0ff" },
    },
    {
      id: "emerald",
      name: "Emerald",
      light: { primary: "#047857", deep: "#065f46", soft: "#e3f6ee", onPrimary: "#ffffff", text: "#047857", pop: "#fff4b8" },
      dark: { primary: "#047857", deep: "#065f46", soft: "#123a30", onPrimary: "#ffffff", text: "#6ee7b7" },
    },
    {
      id: "violet",
      name: "Violet",
      light: { primary: "#6d28d9", deep: "#5b21b6", soft: "#efe8fd", onPrimary: "#ffffff", text: "#6d28d9", pop: "#ffd91a" },
      dark: { primary: "#7c3aed", deep: "#6d28d9", soft: "#2a1d4d", onPrimary: "#ffffff", text: "#c4b5fd" },
    },
    {
      id: "teal",
      name: "Ocean teal",
      light: { primary: "#0e7490", deep: "#155e75", soft: "#e0f4f8", onPrimary: "#ffffff", text: "#0e7490", pop: "#fff4b8" },
      dark: { primary: "#0e7490", deep: "#155e75", soft: "#123540", onPrimary: "#ffffff", text: "#67e8f9" },
    },
    {
      id: "orange",
      name: "Sunset orange",
      light: { primary: "#c2410c", deep: "#9a3412", soft: "#fdeee6", onPrimary: "#ffffff", text: "#c2410c", pop: "#fff4b8" },
      dark: { primary: "#c2410c", deep: "#9a3412", soft: "#3d2215", onPrimary: "#ffffff", text: "#fdba74" },
    },
  ],

  /* Palette value -> the variables that carry it. Digito's own (--dg-*) and
     the Kalio base's (--k-green* is Kalio's name for the action colour). */
  tokens: {
    "--dg-blue": "primary",
    "--dg-blue-d": "deep",
    "--dg-blue-l": "soft",
    "--dg-link": "text",
    "--dg-link-d": "deep",
    "--dg-head": "light.primary",
    "--dg-pop": "light.pop",
    "--dg-primary-rgb": "primary:rgb",
    "--k-green": "primary",
    "--k-green-deep": "primary",
    "--k-green-hover": "deep",
    "--k-green-lift": "primary",
    "--k-leaf": "primary",
    "--k-green-soft": "soft",
    "--k-on-green": "onPrimary",
  },

  /* While dark. Photo wells (--k-well, --k-tint) stay white so a white
     packshot keeps its edge hidden; the yellow accent and navy (text on the
     yellow) stay; the sale red lightens for text (--dg-red-solid stays
     #c4122f for badges with white words). */
  dark: {
    "--dg-link-d": "#e8ecf3",
    "--dg-page": "#0d1220",
    "--dg-card": "#161d2e",
    "--dg-line": "#2a3347",
    "--dg-ink": "#e8ecf3",
    "--dg-muted": "#a3adbd",
    "--dg-soft": "#94a0b4",
    "--dg-red": "#ff6b7d",
    "--dg-green": "#4ade80",
    "--dg-raise": "#1e2639",
    "--dg-ink-bg": "var(--dg-blue)",
    "--dg-navy-ink": "#c3cbd8",
    "--k-ink": "#e8ecf3",
    "--k-ink-2": "#d3d9e3",
    "--k-muted": "#a3adbd",
    "--k-paper": "#0d1220",
    "--k-wash": "#1e2639",
    "--k-card": "#161d2e",
    "--k-plain": "#1e2639",
    "--k-line": "#2a3347",
    "--k-line-strong": "#6b7690",
    "--k-line-soft": "#232b3d",
    "--k-coral": "#ff6b7d",
    "--k-coral-soft": "#3d1a22",
    "--k-amber": "#fbbf24",
    "--k-star-off": "#6b7690",
    "--k-shadow": "0 10px 28px -14px rgba(0, 0, 0, 0.7)",
  },

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary" },
    lightColors: { secondary: "#071634" },
    darkColors: {
      background: "#0d1220",
      surface: "#161d2e",
      "surface-bright": "#1e2639",
      "surface-variant": "#2a3347",
      "on-background": "#e8ecf3",
      "on-surface": "#e8ecf3",
      "on-surface-variant": "#c3cbd8",
      "on-primary": "#ffffff",
      secondary: "#e8ecf3",
      "on-secondary": "#0d1220",
      error: "#ff6b7d",
      info: "#7aa2ff",
      success: "#4ade80",
      warning: "#fbbf24",
    },
  },

  metaThemeColor: "light.primary",
  ui: { ink: "var(--dg-ink)", muted: "var(--dg-muted)", line: "var(--dg-line)", font: "var(--dg-font)" },
  labels: { theme: "Theme", palettes: "Colour", mode: "Light or dark", light: "Light", dark: "Dark" },
};
