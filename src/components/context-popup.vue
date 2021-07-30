<template>
  <div
    id="context-popup"
    :class="{
      'ext-theme popup dict': true,
      'ext-popup-close': isClosed,
    }"
    @mouseup.stop
  >
    <div v-if="word" class="popup__container">
      <div class="dict__word">
        <h2 class="word">{{ word.word }}</h2>
      </div>
      <div class="dict__definitions">
        <ul>
          <li v-for="definition in contextualDefinition" :key="definition.id">
            <word-context :definition="definition" />
          </li>
        </ul>
      </div>
    </div>
    <button
      class="ext-btn ext-icon ext-small ext-danger popup__close-btn"
      @click="isClosed = true"
      @mouseup.stop
    >
      <span class="icon material-icons">close</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ContextPopup",
  components: {
    "word-context": () => import("./word-context.vue"),
  },
  data: () => ({
    word: {
      word: "",
      pronunciation: "",
      definitions: [],
      contexts: {
        word: null,
        items: [],
      },
    },
  }),
  computed: {
    contextualDefinition() {
      if (!this.word) {
        return [];
      }
      const { contexts } = this.word;
      return contexts.items
        .filter((context) => !!context)
        .map((context, index) => ({
          ...context,
          definition: this.definitions[index],
        }));
    },
    definitions() {
      return this.word?.definitions;
    },
  },
};
</script>
