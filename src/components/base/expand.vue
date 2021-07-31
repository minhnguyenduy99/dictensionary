<template>
  <div class="ext-expand">
    <slot name="trigger" v-bind="{ open: _open }">
      <div
        :class="[
          'ext-expand__trigger ext-card__header ext-clickable',
          headerClass,
        ]"
        @click="$_toggleOpen"
      >
        <p class="ext-card__title">{{ title }}</p>
        <span class="ext-card__icon material-icons">
          {{ _open ? openIcon : closeIcon }}
        </span>
      </div>
    </slot>
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      :duration="500"
    >
      <div v-show="_open" class="ext-expand__content">
        <slot class="ext-card__content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ExtExpand",
  props: {
    open: {
      type: Boolean,
      default: true,
    },
    headerClass: String,
    title: String,
    openIcon: {
      type: String,
      default: () => "expand_more",
    },
    closeIcon: {
      type: String,
      default: () => "chevron_left",
    },
  },
  model: {
    prop: "open",
    event: "opened",
  },
  computed: {
    _open: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("opened", val);
        this.$emit("update:open", val);
      },
    },
  },
  methods: {
    $_toggleOpen() {
      this._open = !this._open;
    },
  },
};
</script>
