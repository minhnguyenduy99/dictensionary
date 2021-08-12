<template>
  <div class="context">
    <div class="context__actions">
      <button
        class="
          ext-btn ext-danger ext-small ext-icon ext-small ext-rounded
          context__close
        "
        @click="$emit('delete')"
      >
        <span class="icon ext-small">
          <i class="fas fa-trash"></i>
        </span>
      </button>
    </div>
    <div class="context__info ext-content">
      <figure v-if="context.visual_context" class="context__image">
        <img class="image" :src="context.visual_context" />
      </figure>
      <p class="context__text">{{ context.textual_context }}</p>
    </div>
    <transition>
      <ext-expand v-model="open" title="Definition" headerClass="ext-primary">
        <div class="ext-content">
          <p>
            <span class="part-of-speech ext-text-weight-bold"
              >({{ definition.partOfSpeech }})</span
            >
            <span>{{ definition.pronunciation }}</span>
          </p>
          <p class="definition">{{ definition.definition }}</p>
          <div v-if="hasExample" class="examples">
            <p>Examples:</p>
            <ul>
              <li v-for="example in definition.examples" :key="example.id">
                {{ example }}
              </li>
            </ul>
          </div>
        </div>
      </ext-expand>
    </transition>
  </div>
</template>

<script>
import { ExtExpand } from "./base";

export default {
  name: "WordContext",
  components: {
    ExtExpand,
  },
  props: {
    definition: Object,
  },
  data: () => ({
    open: false,
  }),
  computed: {
    context() {
      return this.definition?.context;
    },
    hasExample() {
      const count = this.definition.examples?.length;
      return count && count > 0;
    },
  },
  watch: {
    definition() {
      this.open = false;
      this.$nextTick();
    },
  },
};
</script>

<style lang="scss">
.context {
  border: 3px solid var(--ext-primary-dark);
  position: relative;

  & > &__actions {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
  }

  &__info {
    min-height: 50px;
  }

  .ext-content {
    > *:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  &__image {
    display: flex;
    justify-content: center;
    img {
      max-width: 50%;
      filter: none;
    }
  }

  &__text {
    text-align: center;
  }

  .part-of-speech {
    margin-right: 7px;
  }

  .examples {
    > p:first-child {
      width: fit-content;
      border-bottom: 5px solid var(--ext-primary);
      margin-bottom: 10px;
    }
  }
}
</style>
