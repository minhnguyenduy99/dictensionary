<template>
  <div
    ext
    id="context-popup"
    :class="{
      'ext-theme popup dict': true,
      'ext-theme-dark': useDarkTheme,
      'ext-popup-close': isClosed,
    }"
    @mouseup.stop
  >
    <div v-if="word" class="popup__container">
      <div class="dict__word">
        <h2 class="word ext-size-3">{{ word.word }}</h2>
      </div>
      <div class="dict__definitions">
        <ul>
          <li v-for="definition in contextualDefinition" :key="definition.id">
            <word-context
              :definition="definition"
              @delete="$_deleteContext(definition.definition_index)"
            />
          </li>
        </ul>
      </div>
      <section id="definition-area">
        <div style="display: flex; justify-content: center">
          <button
            class="ext-btn ext-primary-dark"
            @click="openDefinition = !openDefinition"
            @mouseup.stop
          >
            {{ loadDefinitionButtonText }}
          </button>
        </div>
        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div v-show="openDefinition" class="definition-list">
            <word-definition
              v-for="(definition, index) in definitions"
              :key="definition.id"
              :definition="definition"
              :context.sync="contexts[index]"
              @contextChanged="$_updateWordContext(index, $event)"
            />
          </div>
        </transition>
      </section>
    </div>
    <div class="popup__actions ext-groups">
      <!-- <div class="ext-tooltip ext-bottom ext-danger">
        <button
          class="
            ext-btn
            ext-danger
            ext-small
            ext-icon
            ext-small
            ext-rounded
            ext-outlined
            context__close
          "
          @click="$emit('delete')"
        >
          <span class="icon material-icons">delete</span>
        </button>
        <p class="ext-tooltip__text">Delete all contexts</p>
      </div> -->
      <button
        class="ext-btn ext-icon ext-small ext-danger popup__close-btn"
        @click="isClosed = true"
        @mouseup.stop
      >
        <span class="icon">
          <i class="fas fa-times"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { positionPopup, highlightSavedWords } from "./utils";
import { ThemeMixin } from "./mixins";
import { MESSAGE_TYPES } from "../message-handlers";
import WordDefinition from "./word-definition.vue";
import WordContext from "./word-context";
import { unhighlightWord } from "./utils/highlight-word";

export default {
  name: "ContextPopup",
  mixins: [ThemeMixin],
  components: {
    WordContext,
    WordDefinition,
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
    contexts: [],
    isClosed: true,
    openDefinition: false,
  }),
  computed: {
    contextualDefinition() {
      if (!this.word) {
        return [];
      }
      return this.word?.definitions
        ?.map((def, index) => {
          def.context = this.contexts[index];
          def.definition_index = index;
          return def;
        })
        .filter((def) => !!def.context);
    },
    definitions() {
      return this.word?.definitions;
    },
    loadDefinitionButtonText() {
      return this.openDefinition ? "Close definitions" : "See definitions";
    },
    loadDefinitionButtonIcon() {
      return this.openDefinition ? "expand_less" : "expand_more";
    },
  },
  methods: {
    $open(searchWord, position) {
      const message = {
        type: MESSAGE_TYPES.GET_WORD_DEFINITION,
        data: { word: searchWord },
      };
      chrome.runtime.sendMessage(message, (response) => {
        const { data } = response;
        if (!data) {
          this.word = null;
          this.isClosed = false;
          return;
        }
        const { contexts, ...word } = data;
        this.word = word;
        this.contexts =
          contexts?.items ?? new Array(word.definitions.length).fill(false);
        this.isClosed = false;
      });
    },
    $_updateWordContext(index, context) {
      this.isLoading = true;
      const message = {
        type: MESSAGE_TYPES.CREATE_WORD_CONTEXT,
        data: {
          word: this.word.word,
          definition_index: index,
          ...context,
        },
      };
      chrome.runtime.sendMessage(message, (response) => {
        this.isLoading = false;
        highlightSavedWords([this.word.word]);
      });
    },
    $_deleteContext(index) {
      const message = {
        type: MESSAGE_TYPES.DELETE_CONTEXT,
        data: {
          word: this.word.word,
          definition_index: index,
        },
      };
      chrome.runtime.sendMessage(message, (response) => {
        const { data } = response;
        if (!data.success) {
          return;
        }
        this.$set(this.contexts, index, null);
        // the context is deleted
        if (data.deleted) {
          this.isClosed = true;
          unhighlightWord(this.word.word);
        }
      });
    },
  },
};
</script>

<style lang="scss">
#context-popup {
  width: 400px;
}

#definition-area {
  margin-top: 20px;

  button:first-of-type {
    margin-bottom: 10px;
  }
}

.definition-list {
  > :not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
