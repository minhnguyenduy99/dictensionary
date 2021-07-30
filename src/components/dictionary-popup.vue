<template>
  <div
    id="dictionary-popup"
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
import { MESSAGE_TYPES } from "../message-handlers";
import WordDefinition from "./word-definition.vue";
import { positionPopup, highlightSavedWords } from "./utils";

export default {
  name: "DictionaryPopup",
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
    isLoading: false,
    wordCollection: [],
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
          this.$_positionPopup();
          this.isClosed = false;
          return;
        }
        const { contexts, ...word } = data;
        this.word = word;
        this.contexts =
          contexts?.items ?? new Array(word.definitions.length).fill(false);
        this.isClosed = false;
        this.$_positionPopup();
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
        console.log("UPdate context");
        highlightSavedWords([this.word.word]);
      });
    },
    $_positionPopup() {
      if (!this.wordSelection) {
        return;
      }
      const wordPosition = this.wordSelection
        .getRangeAt(0)
        .getBoundingClientRect();
      positionPopup(wordPosition, this.$el);
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
@import "./scss/_button.scss";
@import "./scss/_popup.scss";

#dictionary-popup {
  max-width: 80%;
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
    }
  }

  & &__definitions {
    ul {
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
