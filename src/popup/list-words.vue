<template>
  <div class="list-words">
    <slot v-if="!isListEmpty">
      <div class="list-words__container ext-content">
        <ext-tag
          v-for="(word, index) in words"
          :key="word.id"
          :tag="word"
          :active="actives(word, index)"
          :hasAction="true"
          actionIcon="fas fa-times"
          @actionClicked="$emit('remove', { index, word })"
        />
      </div>
    </slot>
    <slot v-else name="empty">
      <div class="list-words__empty ext-flex ext-flex-justify-content-center">
        <span class="ext-size-4">{{ emptyText }}</span>
      </div>
    </slot>
  </div>
</template>

<script>
import ExtTag from "../components/base/tag";

export default {
  name: "ListWords",
  components: {
    ExtTag,
  },
  props: {
    words: Array,
    actives: {
      type: Function,
      default: (word, index) => true,
    },
    emptyText: String,
  },
  computed: {
    isListEmpty() {
      return this.words?.length === 0;
    },
  },
};
</script>

<style lang="scss">
.list-words {
  & > &__container {
    display: flex;
    flex-wrap: wrap;

    > * {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  &__empty {
    padding: 10px;
  }
}
</style>
