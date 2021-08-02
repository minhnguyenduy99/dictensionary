<template>
  <div class="ext-tag">
    <span class="ext-size-5">{{ tag }}</span>
    <slot v-if="hasAction" name="action" v-bind="{ tag }">
      <button
        class="ext-btn ext-icon ext-extra-small ext-danger ext-rounded"
        @click="$emit('actionClicked')"
      >
        <span class="icon material-icons md-18">{{ actionIcon }}</span>
      </button>
    </slot>
  </div>
</template>

<script>
export default {
  name: "ExtTag",
  props: {
    tag: String,
    hasAction: {
      type: Boolean,
      default: () => false,
    },
    actionIcon: String,
  },
  setup() {},
};
</script>

<style lang="scss">
.ext-tag {
  --tag-color: var(--ext-text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--tag-color);
  padding: 2px 2px 2px 10px;
  border-radius: 20px;
  border: 1px solid var(--ext-primary);
  background: transparent;
  cursor: pointer;
  transition: 0.15s ease-in;

  &:hover {
    background: var(--ext-primary);
    color: white;
  }

  > span:first-child {
    margin-right: 5px;
    margin-top: -2px;
  }
}
</style>
