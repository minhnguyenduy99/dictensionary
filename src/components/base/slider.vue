<template>
  <div class="ext-slider">
    <input
      type="range"
      :min="minValue"
      :max="maxValue"
      v-model.number="_value"
      class="ext-slider__input"
    />
    <slot v-bind="{ value: _value }"></slot>
  </div>
</template>

<script>
export default {
  name: "ExtSlider",
  props: {
    maxValue: {
      type: Number,
      default: () => 100,
    },
    minValue: {
      type: Number,
      default: () => 0,
    },
    value: {
      type: Number,
      default: () => 0,
    },
  },
  model: {
    prop: "value",
    event: "value-changed",
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("value-changed", val);
      },
    },
  },
  setup() {},
};
</script>

<style lang="scss">
.ext-slider__input {
  --slider-background-color: #cdcdcd;
  --slider-thumb-background-color: var(--ext-primary);

  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: var(--slider-background-color);
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--slider-thumb-background-color);
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--slider-thumb-background-color);
    cursor: pointer;
  }
}
</style>
