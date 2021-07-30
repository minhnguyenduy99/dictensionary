<template>
  <div class="context">
    <div class="ext-content">
      <figure v-if="context.visual_context" class="context__image">
        <img class="image" :src="context.visual_context" />
      </figure>
      <p class="context__text">{{ context.textual_context }}</p>
    </div>
    <transition>
      <ext-expand
        v-model="open"
        title="Definition"
        headerClass="ext-color-light ext-background-primary"
      >
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
    <button
      class="
        ext-btn ext-danger ext-small ext-icon ext-small ext-rounded
        context__close
      "
      @click="$emit('delete')"
    >
      <span class="icon material-icons">delete</span>
    </button>
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
      console.log(this.definition);
      return this.definition?.context;
    },
    hasExample() {
      const count = this.definition.examples?.length;
      return count && count > 0;
    },
  },
};
</script>

<style lang="scss">
.context {
  border: 3px solid var(--ext-primary-dark);
  position: relative;

  .ext-content {
    padding: 5px 3rem 5px 3rem;
    min-height: 50px;
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

  &__close {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
</style>
