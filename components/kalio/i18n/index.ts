/*
 * Digito's words, per language: the shared Kalio base (base/<lang>.ts, a copy
 * of new-shop-kits/i18n/kalio-base), Digito's own (digito.<lang>.ts, built from
 * the digito.* t() calls) and a few base keys Digito says differently
 * (digito-overrides.ts). English is bundled; every other language is its own
 * small chunk, fetched only when a visitor picks it (lang-<code>.ts).
 * The Digini shop enables ar, hi and da. A language the owner enables later:
 * copy base/<code>.ts, write digito.<code>.ts and its overrides, add
 * lang-<code>.ts and one line below.
 */
import baseEn from "./base/en";
import digitoEn from "./digito.en";
import { OVERRIDES } from "./digito-overrides";

export const EN: Record<string, string> = { ...baseEn, ...digitoEn, ...OVERRIDES.en };

export const LOADERS: Record<string, () => Promise<any>> = {
  ar: () => import("./lang-ar"),
  hi: () => import("./lang-hi"),
  da: () => import("./lang-da"),
};
