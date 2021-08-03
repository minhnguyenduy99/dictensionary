<template>
  <span
    @mouseup.capture="$on_mouseUp"
    @click="$on_highlightWordClicked"
    class="highlight-word"
    :style="computedHighlightWordStyle"
    >{{ _word }}</span
  >
</template>

<script>
import { openContextPopup, highlightStyleObserver } from "./utils";

export default {
  name: "HighlightWord",
  data: () => ({
    word: null,
    highlightWordStyle: {},
  }),
  mounted: function () {
    const elementId = Date.now().toString();
    this.$el.setAttribute("highlight-word-id", elementId);
    this.highlightWordStyle = { ...highlightStyleObserver.style };
    highlightStyleObserver.addListener(elementId, (style) => {
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
    _word() {
      return this.word;
    },
  },
  methods: {
    $setWord(word) {
      if (word === " ") {
        return;
      }
      this.word = word;
    },
    $_isDestroyed() {
      return !this.$el.classList.contains("highlight-word");
    },
    $on_highlightWordClicked() {
      if (this.$_isDestroyed()) {
        return;
      }
      openContextPopup(this.word, this.$el.getBoundingClientRect());
    },
    $on_mouseUp(ev) {
      if (!this.$_isDestroyed()) {
        ev.stopPropagation();
      }
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
