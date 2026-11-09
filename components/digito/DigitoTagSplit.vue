<!--
  Digito — two of the shop's tags side by side ("4K Items" | "Gaming
  Items"), three cards each, so tag rows never stand one under the other.
  Used when the shop has more tags than the home has places between other
  sections. On a phone each half is a row that swipes.
-->
<template>
  <section v-if="rows.length" :style="{ '--halves': rows.length }" class="dg-split">
    <div v-for="r in rows" :key="r.tag" class="dg-sec dg-split__half">
      <header class="dg-head"><h2>{{ r.title }}</h2></header>
      <div class="dg-split__grid">
        <digito-card v-for="p in r.products.slice(0, 3)" :key="p.id" :product="p" no-foot />
      </div>
    </div>
  </section>
</template>

<script>
import DigitoCard from "./DigitoCard.vue";

export default {
  name: "DigitoTagSplit",
  components: { DigitoCard },
  props: { rows: { type: Array, default: () => [] } },
};
</script>
