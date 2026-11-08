/* The compare page's words and choices in Tario (8 November 2026).
   KalioCompare.vue is the same in every molino Layout; this file and
   style/kalio-compare.scss are what make it this Layout's own. */
export const SKIN = {
  /** The page's heading (and the tab's title). */
  title: "Compare items",
  /** A small line over the heading, or none. */
  eyebrow: null as string | null,
  /** Under "Your picks", beside the pinned cards. */
  hint: "They stay here while you scroll. Remove one with ×.",
  /** "switch": one Only differences switch; "segmented": Everything / Only differences. */
  toggle: "switch" as "switch" | "segmented",
  emptyTitle: "Nothing to compare yet",
  browse: "Shop all categories",
  shareTitle: "Share this comparison",
  /** The Layout's mark in the share card and on the empty page (else an icon). */
  mark: false,
  /** Number the groups 01, 02, … */
  numbered: false,
};
