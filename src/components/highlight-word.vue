<template>
  <span
    @mouseup.capture.stop
    @click="$on_highlightWordClicked"
    class="highlight-word ext-background-primary ext-color-light"
    :style="highlightWordStyle"
    >{{ word }}</span
  >
</template>

<script>
import { openContextPopup } from "./utils";

export default {
  name: "HighlightWord",
  props: {
    color: String,
    backgroundColor: String,
  },
  data: () => ({
    word: "",
  }),
  computed: {
    highlightWordStyle() {
      return {
        background: this.backgroundColor,
        color: this.color,
      };
    },
  },
  methods: {
    $on_highlightWordClicked() {
      openContextPopup(this.word, this.$el.getBoundingClientRect());
    },
    $setWord(word) {
      this.word = word;
    },
  },
};
</script>

<style lang="scss">
.highlight-word {
  padding: 3px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  opacity: 0.9;
  transition: 0.15s ease-in;

  &:hover {
    opacity: 1;
  }
}
</style>
