<template>
  <span
    @mouseup.capture.stop="$on_mouseUp"
    class="highlight-word ext-background-primary ext-color-light"
    :style="highlightWordStyle"
    >{{ word }}</span
  >
</template>

<script>
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
    $on_mouseUp(ev) {},
  },
};
</script>

<style lang="scss">
.highlight-word {
  padding: 3px;
  margin: 0 3px;
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
