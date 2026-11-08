<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->

<!--
  The compare page is KalioCompare (8 November 2026) — the picks pinned
  side by side, the details grouped with the differences marked — in place
  of Selldone's SComparisonList table. The address keeps Selldone's ?list=
  format, so its old links still open here.
-->
<template>
  <kalio-compare />
</template>

<script lang="ts">
import KalioCompare from "../../components/kalio/compare/KalioCompare.vue";

export default {
  name: "StorefrontPageComparison",
  components: { KalioCompare },
};
</script>
