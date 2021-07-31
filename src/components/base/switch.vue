<template>
  <div class="ext-switch ext-small">
    <label class="ext-switch__container">
      <input type="checkbox" v-model="_active" />
      <span
        :class="{
          slider: true,
          round: rounded,
        }"
      ></span>
    </label>
    <span v-if="label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "ExtSwitch",
  props: {
    rounded: {
      type: Boolean,
      default: () => false,
    },
    label: String,
    active: Boolean,
  },
  model: {
    prop: "active",
    event: "active-changed",
  },
  data: () => ({}),
  computed: {
    _active: {
      get() {
        return this.active;
      },
      set(val) {
        this.$emit("active-changed", val);
      },
    },
  },
};
</script>

<style lang="scss">
.ext-switch {
  --switch-width: 60px;
  --switch-height: 34px;
  --switch-background-color: var(--ext-primary);
  --switch-slider-size: 26px;
  --switch-label-font-size: 1rem;
  --switch-text-color: var(--ext-text-color);

  display: flex;
  align-items: center;
}

.ext-switch > span {
  margin-left: 10px;
  font-size: var(--switch-label-font-size);
}

.ext-switch__container {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: var(--switch-background-color);
    }

    &:focus + .slider {
      box-shadow: 0 0 1px var(--switch-background-color);
    }

    &:checked + .slider:before {
      -webkit-transform: translateX(
        calc(var(--switch-width) - 8px - var(--switch-slider-size))
      );
      -ms-transform: translateX(
        calc(var(--switch-width) - 8px - var(--switch-slider-size))
      );
      transform: translateX(
        calc(var(--switch-width) - 8px - var(--switch-slider-size))
      );
    }
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;

    &::before {
      position: absolute;
      content: "";
      height: var(--switch-slider-size);
      width: var(--switch-slider-size);
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    /* Rounded sliders */
    &.round {
      border-radius: 34px;
      &::before {
        border-radius: 50%;
      }
    }
  }
}

.ext-switch {
  &.ext-small {
    --switch-width: 40px;
    --switch-height: 24px;
    --switch-slider-size: 16px;
    --switch-label-font-size: 0.75rem;
  }
}
</style>
