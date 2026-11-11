<!-- Digito — an icon from Material Symbols Rounded (kalio-fonts.ts loads
     only the icons listed there; add a new one to ICONS). -->
<template>
  <span :class="{ '-fill': fill, '-dir': DIRECTIONAL.has(name) }" :style="size ? { fontSize: size + 'px' } : null" aria-hidden="true" class="dg-ms">{{ name }}</span>
</template>

<script>
/* Icons that point along the reading direction: mirrored in a right-to-left
   language (html[dir="rtl"] .dg-ms.-dir, style/digito-skin.scss). */
const DIRECTIONAL = new Set(["chevron_left", "chevron_right", "arrow_forward", "arrow_back", "east", "west", "navigate_next", "navigate_before", "arrow_right_alt", "keyboard_arrow_right", "keyboard_arrow_left"]);

export default {
  name: "DigitoIcon",
  data: () => ({ DIRECTIONAL }),
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: null },
    fill: Boolean,
  },
};
</script>
