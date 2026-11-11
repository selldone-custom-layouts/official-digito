/* The compare page's words and choices in Digito (9 November 2026).
   KalioCompare.vue is the same page in every Layout built from Molino; this
   file and the Digito dress at the end of style/digito-pages.scss make it
   this Layout's own: picks pinned at the top as white cards, differing rows
   on a light yellow ground in bold, one Only differences switch, a blue
   share card.
   The words are getters, so they follow the visitor's language. */
import { t } from "../i18n/kalio-i18n";

export const SKIN = {
  /** The page's heading (and the tab's title). */
  get title(): string {
    return t("digito.compare.title", "Compare products");
  },
  /** A small line over the heading, or none. */
  get eyebrow(): string | null {
    return t("digito.compare.pageName", "Side by side");
  },
  /** Under "Your picks", beside the pinned cards. */
  get hint(): string {
    return t("digito.compare.hint", "They stay at the top while you scroll. Remove one with ×.");
  },
  /** "switch": one Only differences switch; "segmented": Everything / Only differences. */
  toggle: "switch" as "switch" | "segmented",
  get emptyTitle(): string {
    return t("compare.empty.title", "Nothing to compare yet");
  },
  get browse(): string {
    return t("digito.compare.empty.browse", "Shop all categories");
  },
  get shareTitle(): string {
    return t("compare.shareTitle", "Share this comparison");
  },
  /** The Layout's mark in the share card and on the empty page (else an icon). */
  mark: true,
  /** Number the groups 01, 02, … */
  numbered: false,
};
