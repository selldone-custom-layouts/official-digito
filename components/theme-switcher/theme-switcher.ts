/*
 * Theme switcher: the colour palettes and Light / Dark that a shopper picks
 * in the footer (the owner's rule, 9 November 2026: "put colour palettes and
 * light and dark themes in the footer; a click changes the site's theme").
 *
 * Layout-agnostic: nothing here knows a Layout's names. The Layout passes
 * one ThemeSwitcherConfig (storage key, palettes, the map from palette
 * values to its own CSS variables, its dark token set, Vuetify theme names)
 * to bootThemeSwitcher() before the app mounts, and puts
 * <theme-switcher-row /> in its footer. See PORTING.md in the kit.
 *
 * One call changes everything at once, with no reload:
 * - the Layout's tokens (inline on <html>, so they outrank its :root);
 * - Vuetify's theme (primary in both themes, and light <-> dark), so
 *   Selldone's own fields, menus, dialogs and sheets follow;
 * - a class on <html> while dark (config.darkClass) and data-ts-mode /
 *   data-ts-palette, for the Layout's own dark rules;
 * - <meta name="theme-color"> and color-scheme.
 * The choice is kept in localStorage (try/catch: private windows and blocked
 * storage keep it for the visit) and applied before the first paint.
 */
import { reactive } from "vue";

export type ThemeMode = "light" | "dark";

/** The colours one palette needs in one mode. */
export interface PaletteValues {
  /** The action colour: buttons, the header, chosen states. */
  primary: string;
  /** Its hover / pressed shade. */
  deep: string;
  /** A soft tint of it (chips, hovers, selected rows) on this mode's ground. */
  soft: string;
  /** Text and icons on primary (4.5:1 or more, measured). */
  onPrimary: string;
  /** The colour of links and accent words on this mode's cards (4.5:1+). */
  text: string;
  /** Anything else the Layout maps (e.g. "lift"). */
  [key: string]: string;
}

export interface ThemePalette {
  id: string;
  /** Shown as the swatch's tooltip and aria-label. */
  name: string;
  light: PaletteValues;
  dark: PaletteValues;
}

export interface ThemeSwitcherConfig {
  /** localStorage key, e.g. "digito-theme". */
  storageKey: string;
  /** The first is the default (the brand). */
  palettes: ThemePalette[];
  defaultMode?: ThemeMode;
  /**
   * CSS variable -> palette value, set on <html> for the current palette and
   * mode. "primary" takes palette[mode].primary; "primary:rgb" writes it as
   * "r, g, b" (for rgba(var(--x), .3) and Vuetify's --v-theme-*);
   * "light.primary" or "dark.text" pins a mode.
   */
  tokens: Record<string, string>;
  /** CSS variable -> value while dark (removed again on light). */
  dark: Record<string, string>;
  /** CSS variable -> value while light (removed on dark); usually empty. */
  light?: Record<string, string>;
  /** Class on <html> while dark (default "theme-dark"). */
  darkClass?: string;
  vuetify?: {
    /** Vuetify theme names (default "light" and "dark"). */
    light?: string;
    dark?: string;
    /** Vuetify colour -> palette value, per theme (default primary). */
    paletteColors?: Record<string, string>;
    /** Fixed Vuetify colours for each theme (the dark theme's surfaces). */
    lightColors?: Record<string, string>;
    darkColors?: Record<string, string>;
  };
  /** Palette value for <meta name="theme-color"> (default "light.primary"); false leaves it. */
  metaThemeColor?: string | false;
  /** Colours of the footer row itself (CSS values, usually the Layout's tokens). */
  ui?: { ink?: string; muted?: string; line?: string; font?: string };
  labels?: { theme?: string; palettes?: string; mode?: string; light?: string; dark?: string };
}

const DEFAULT_LABELS = { theme: "Theme", palettes: "Colour", mode: "Light or dark", light: "Light", dark: "Dark" };

let cfg: ThemeSwitcherConfig | null = null;
let vuetify: any = null;

/** The current choice (reactive: the footer row reads it). */
export const themeState = reactive<{ palette: string; mode: ThemeMode }>({ palette: "", mode: "light" });

const rgbOf = (hex: string): string => {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ");
};

function palette(): ThemePalette {
  const list = cfg!.palettes;
  return list.find((p) => p.id === themeState.palette) || list[0];
}

/** "primary", "primary:rgb", "dark.text" -> the colour for the current choice. */
function valueOf(p: ThemePalette, ref: string): string {
  const [path, format] = ref.split(":");
  const [a, b] = path.split(".");
  const values = b ? p[a as ThemeMode] : p[themeState.mode];
  const key = b || a;
  const v = values?.[key] ?? p.light[key] ?? "";
  return format === "rgb" && v ? rgbOf(v) : v;
}

function read(): { palette: string; mode: ThemeMode } {
  const fallback = { palette: cfg!.palettes[0].id, mode: cfg!.defaultMode || "light" };
  try {
    const raw = window.localStorage.getItem(cfg!.storageKey);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return {
      palette: cfg!.palettes.some((p) => p.id === v?.palette) ? v.palette : fallback.palette,
      mode: v?.mode === "dark" ? "dark" : v?.mode === "light" ? "light" : fallback.mode,
    };
  } catch {
    return fallback;
  }
}

function save(): void {
  try {
    window.localStorage.setItem(cfg!.storageKey, JSON.stringify({ palette: themeState.palette, mode: themeState.mode }));
  } catch {
    /* private window or blocked storage: the choice lasts for this visit */
  }
}

/** Paint the current choice on the whole page, now. */
export function applyTheme(): void {
  if (!cfg) return;
  const p = palette();
  const dark = themeState.mode === "dark";
  const root = document.documentElement;
  const style = root.style;

  for (const [name, ref] of Object.entries(cfg.tokens)) style.setProperty(name, valueOf(p, ref));

  const on = (dark ? cfg.dark : cfg.light) || {};
  const off = (dark ? cfg.light : cfg.dark) || {};
  for (const name of Object.keys(off)) if (!(name in on) && !(name in cfg.tokens)) style.removeProperty(name);
  for (const [name, v] of Object.entries(on)) style.setProperty(name, v);

  // The row's own colours.
  const v = p[themeState.mode];
  style.setProperty("--ts-accent", v.primary);
  style.setProperty("--ts-on-accent", v.onPrimary);
  style.setProperty("--ts-ring", v.text);
  if (cfg.ui?.ink) style.setProperty("--ts-ink", cfg.ui.ink);
  if (cfg.ui?.muted) style.setProperty("--ts-muted", cfg.ui.muted);
  if (cfg.ui?.line) style.setProperty("--ts-line", cfg.ui.line);
  if (cfg.ui?.font) style.setProperty("--ts-font", cfg.ui.font);

  root.classList.toggle(cfg.darkClass || "theme-dark", dark);
  root.dataset.tsMode = themeState.mode;
  root.dataset.tsPalette = p.id;
  style.colorScheme = dark ? "dark" : "light";

  if (cfg.metaThemeColor !== false) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", valueOf(p, cfg.metaThemeColor || "light.primary"));
  }

  if (vuetify?.theme) {
    try {
      const names = { light: cfg.vuetify?.light || "light", dark: cfg.vuetify?.dark || "dark" };
      const themes = vuetify.theme.themes.value;
      const map = cfg.vuetify?.paletteColors || { primary: "primary" };
      for (const mode of ["light", "dark"] as ThemeMode[]) {
        const t = themes[names[mode]];
        if (!t) continue;
        for (const [color, ref] of Object.entries(map)) {
          const [path, format] = ref.split(":");
          t.colors[color] = valueOf(p, `${mode}.${path.split(".").pop()}${format ? ":" + format : ""}`);
        }
      }
      vuetify.theme.global.name.value = names[themeState.mode];
    } catch {
      /* Vuetify not ready: the class and tokens are already set */
    }
  }
}

/** Change the palette and/or the mode (saved, applied at once). */
export function setTheme(next: { palette?: string; mode?: ThemeMode }): void {
  if (!cfg) return;
  if (next.palette && cfg.palettes.some((p) => p.id === next.palette)) themeState.palette = next.palette;
  if (next.mode === "light" || next.mode === "dark") themeState.mode = next.mode;
  applyTheme();
  save();
}

/** For the footer row. */
export function useThemeSwitcher() {
  return {
    state: themeState,
    palettes: cfg?.palettes || [],
    labels: { ...DEFAULT_LABELS, ...(cfg?.labels || {}) },
    setTheme,
  };
}

/**
 * Call once, after creating Vuetify and before app.mount(): reads the saved
 * choice and paints it, so the default never flashes.
 */
export function bootThemeSwitcher(config: ThemeSwitcherConfig, vuetifyInstance?: any): void {
  cfg = config;
  vuetify = vuetifyInstance || null;
  try {
    const themes = vuetify?.theme?.themes?.value;
    const names = { light: config.vuetify?.light || "light", dark: config.vuetify?.dark || "dark" };
    if (themes?.[names.dark] && config.vuetify?.darkColors) Object.assign(themes[names.dark].colors, config.vuetify.darkColors);
    if (themes?.[names.light] && config.vuetify?.lightColors) Object.assign(themes[names.light].colors, config.vuetify.lightColors);
  } catch {
    /* keep Vuetify's own colours */
  }
  Object.assign(themeState, read());
  applyTheme();
  // Another tab changed it: follow.
  try {
    window.addEventListener("storage", (e) => {
      if (e.key !== config.storageKey) return;
      Object.assign(themeState, read());
      applyTheme();
    });
  } catch {
    /* no window events (prerender) */
  }
}
