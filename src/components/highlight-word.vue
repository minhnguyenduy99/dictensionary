<template>
  <span
    @mouseup.capture.stop
    @click="$on_highlightWordClicked"
    class="highlight-word"
    :style="computedHighlightWordStyle"
    >{{ word }}</span
  >
</template>

<script>
import { openContextPopup, highlightStyleObserver } from "./utils";

export default {
  name: "HighlightWord",
  data: () => ({
    word: "",
    highlightWordStyle: {},
  }),
  mounted: function () {
    highlightStyleObserver.addListener((style) => {
      this.highlightWordStyle = style;
    });
  },
  computed: {
    computedHighlightWordStyle() {
      const { color, backgroundColor, opacity } = this.highlightWordStyle;
      return {
        color,
        backgroundColor,
        opacity: opacity / 100,
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
    opacity: 1 !important;
  }
}
</style>
