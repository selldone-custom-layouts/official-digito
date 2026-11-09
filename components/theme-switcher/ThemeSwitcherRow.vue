<!--
  Theme switcher: the footer's "Theme" row. A colour swatch per palette
  (a 32px button; the colour is a disc drawn inside it, the chosen one gets
  a ring drawn inside the button too, never outside), the chosen palette's
  name, and a Light / Dark switch. Buttons with aria-pressed, a name on each
  (aria-label and tooltip), arrow keys move along the swatches.
  Layout-agnostic: its words and colours come from the config passed to
  bootThemeSwitcher(); see theme-switcher.ts.
-->
<template>
  <div :aria-label="labels.theme" class="ts-row" role="group">
    <span aria-hidden="true" class="ts-row__label">{{ labels.theme }}</span>

    <div :aria-label="labels.palettes" class="ts-row__palettes" role="group" @keydown="onArrows">
      <button
        v-for="p in palettes"
        :key="p.id"
        :aria-label="p.name"
        :aria-pressed="p.id === state.palette ? 'true' : 'false'"
        :class="{ '-on': p.id === state.palette }"
        :style="{ '--sw': p[state.mode].primary }"
        :title="p.name"
        class="ts-swatch"
        type="button"
        @click="setTheme({ palette: p.id })"
      ></button>
    </div>
    <span aria-live="polite" class="ts-row__name">{{ currentName }}</span>

    <div :aria-label="labels.mode" class="ts-mode" role="group">
      <button
        :aria-pressed="state.mode === 'light' ? 'true' : 'false'"
        :class="{ '-on': state.mode === 'light' }"
        class="ts-mode__btn"
        type="button"
        @click="setTheme({ mode: 'light' })"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4.2" />
          <path
            d="M12 1.8v2.6M12 19.6v2.6M4.8 4.8l1.8 1.8M17.4 17.4l1.8 1.8M1.8 12h2.6M19.6 12h2.6M4.8 19.2l1.8-1.8M17.4 6.6l1.8-1.8"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
          />
        </svg>
        {{ labels.light }}
      </button>
      <button
        :aria-pressed="state.mode === 'dark' ? 'true' : 'false'"
        :class="{ '-on': state.mode === 'dark' }"
        class="ts-mode__btn"
        type="button"
        @click="setTheme({ mode: 'dark' })"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20.6 14.6A8.6 8.6 0 0 1 9.4 3.4a8.6 8.6 0 1 0 11.2 11.2z" />
        </svg>
        {{ labels.dark }}
      </button>
    </div>
  </div>
</template>

<script>
import { setTheme, themeState, useThemeSwitcher } from "./theme-switcher";

export default {
  name: "ThemeSwitcherRow",

  data() {
    const { palettes, labels } = useThemeSwitcher();
    return { state: themeState, palettes, labels };
  },

  computed: {
    currentName() {
      return (this.palettes.find((p) => p.id === this.state.palette) || this.palettes[0])?.name || "";
    },
  },

  methods: {
    setTheme,
    /* Left / Right (and Home / End) move the focus along the swatches. */
    onArrows(e) {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(e.key)) return;
      const buttons = [...e.currentTarget.querySelectorAll("button")];
      const i = buttons.indexOf(document.activeElement);
      if (i < 0) return;
      const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
      const step = (e.key === "ArrowRight") !== rtl ? 1 : -1;
      const next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : (i + step + buttons.length) % buttons.length;
      buttons[next].focus();
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss" src="./theme-switcher.scss"></style>
