<template>
  <div
    ext
    id="dictionary-popup"
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
          <li v-for="(definition, index) in definitions" :key="definition.id">
            <word-definition
              :definition="definition"
              :context.sync="contexts[index]"
              @contextChanged="$_updateWordContext(index, $event)"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="popup__container">
      <div class="dict__word"></div>
      <div class="dict__definitions">
        <h3>Cannot found definition of this word</h3>
      </div>
    </div>
    <div class="popup__actions ext-groups">
      <button
        class="ext-btn ext-icon ext-small ext-danger"
        @click="isClosed = true"
        @mouseup.stop
      >
        <span class="icon ext-small">
          <i class="fas fa-times"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { MESSAGE_TYPES } from "../message-handlers";
import WordDefinition from "./word-definition.vue";
import { ThemeMixin } from "./mixins";
import { highlightSavedWords } from "./utils";

export default {
  name: "DictionaryPopup",
  mixins: [ThemeMixin],
  components: {
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
    wordSelection: null,
    isClosed: true,
  }),
  mounted: function () {
    document.body.addEventListener("mouseup", this.$_onMouseUpped);
  },
  computed: {
    definitions() {
      return this.word?.definitions;
    },
  },
  methods: {
    $setTheme(useDarkTheme) {
      this.useDarkTheme = useDarkTheme;
    },
    $_onMouseUpped() {
      const selectedWord = this.$_getSelectionWord();
      if (selectedWord.length === 0) {
        return;
      }
      const message = {
        type: MESSAGE_TYPES.GET_WORD_DEFINITION,
        data: { word: selectedWord },
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
          contexts?.items ?? new Array(word.definitions.length).fill(null);
        this.isClosed = false;
      });
    },
    $_updateWordContext(index, context) {
      const message = {
        type: MESSAGE_TYPES.CREATE_WORD_CONTEXT,
        data: {
          word: this.word.word,
          definition_index: index,
          ...context,
        },
      };
      chrome.runtime.sendMessage(message, (response) => {
        const { data } = response;
        if (!data.success) {
          return;
        }
        highlightSavedWords([this.word.word]);
      });
    },
    $_getSelectionWord() {
      this.wordSelection = window.getSelection();
      let selections = this.wordSelection.toString().split(/[1-9\W]/);
      return selections[0];
    },
  },
};
</script>

<style lang="scss">
#dictionary-popup {
  width: 400px;
}

.dict {
  & &__word {
    display: flex;
    align-items: baseline;
    padding: 0 0 1rem 0;
    min-height: 50px;

    > .word {
      border: none;
      padding: 0;
      padding-right: 5px;
      margin: 0;
    }
  }

  & &__definitions {
    > ul {
      list-style: none;
      margin: 0;
      padding: 0;

      > li:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
