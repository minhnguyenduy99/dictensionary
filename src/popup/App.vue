<template>
  <div
    ext
    id="extension-popup"
    :class="{
      'ext-theme-dark': useDarkTheme,
    }"
    @mouseup.stop
  >
    <div class="ext-popup-groups">
      <div class="group">
        <p class="group__title">Info</p>
        <div class="group__content">
          <div class="group__info">
            <div>
              <p class="ext-size-6">Number of words</p>
              <p class="group__value ext-title">{{ words.length }}</p>
            </div>
            <div>
              <p class="ext-size-6">Found on this page</p>
              <p class="group__value ext-title">{{ foundWordsCount }}</p>
            </div>
          </div>
          <div class="ext-input no-animation" style="margin-top: 10px">
            <input type="text" v-model.lazy="wordSearch" />
            <label>Search for words</label>
          </div>
          <ext-expand
            v-model="listWordsExpanded"
            rounded
            :title="`List of words (${filteredWords.length})`"
            headerClass="ext-primary"
            style="margin-top: 10px"
          >
            <list-words
              :words="filteredWords"
              emptyText="No words found"
              :actives="(word, index) => foundWords[word] === 1"
              @remove="$_removeWord"
            />
          </ext-expand>
        </div>
      </div>
      <div class="group">
        <p class="group__title">Theme</p>
        <div class="group__content">
          <ext-switch
            :rounded="true"
            v-model="useDarkTheme"
            :label="switchThemeLabel"
          />
        </div>
      </div>
      <div class="group">
        <p class="group__title">Popup position</p>
        <div class="group__content">
          <div class="ext-radio-buttons">
            <label
              v-for="position in listPositions"
              :key="position.id"
              class="ext-radio"
            >
              <span class="ext-radio__input">
                <input
                  v-model="selectedPosition"
                  type="radio"
                  name="radio"
                  :value="position"
                />
                <span class="ext-radio__control"></span>
              </span>
              <span class="ext-radio__label">{{ position | capitalize }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="group">
        <p class="group__title">Adjust highlight style</p>
        <div class="group__content">
          <div class="field-group">
            <div class="field">
              <label>Text color</label>
              <input
                type="color"
                id="head"
                name="head"
                v-model.lazy="highlightStyle.color"
              />
            </div>
            <div class="field">
              <label>Background color</label>
              <input
                type="color"
                id="head"
                name="head"
                v-model.lazy="highlightStyle.backgroundColor"
              />
            </div>
            <div class="field vertical">
              <label>Opacity</label>
              <ext-slider v-model.lazy="highlightStyle.opacity">
                <template>
                  <div class="ext-flex ext-flex-justify-content-center">
                    <p class="ext-size-5">{{ highlightStyle.opacity }}</p>
                  </div>
                </template>
              </ext-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExtSwitch from "../components/base/switch.vue";
import ExtExpand from "../components/base/expand.vue";
import ExtSlider from "../components/base/slider.vue";
import ListWords from "./list-words.vue";
import { MESSAGE_TYPES } from "../message-handlers";
import { SettingsStorage } from "../storage";

/**
 * @type {SettingsStorage}
 */
let storage;

export default {
  name: "App",
  components: {
    ExtSwitch,
    ExtSlider,
    ListWords,
    ExtExpand,
  },
  data: () => ({
    listWordsExpanded: false,
    updating: false,
    wordSearch: "",
    wordContextCount: 0,
    useDarkTheme: null,
    words: [],
    foundWords: {},
    highlightStyle: {},
    selectedPosition: null,
    listPositions: ["left", "right"],
  }),
  computed: {
    switchThemeLabel() {
      return this.useDarkTheme ? "Dark theme" : "Light theme";
    },
    filteredWords() {
      if (!this.wordSearch) {
        return this.words;
      }
      return this.words.filter(
        (word) => word.indexOf(this.wordSearch.toLowerCase()) !== -1
      );
    },
    foundWordsCount() {
      return Object.values(this.foundWords).filter((found) => found === 1)
        .length;
    },
  },
  watch: {
    useDarkTheme(val, oldVal) {
      // Not toggle theme when updating the first time
      if (oldVal === null) {
        return;
      }
      this.$_toggleTheme();
    },
    highlightStyle: {
      deep: true,
      handler(val) {
        this.$_updateStyle();
      },
    },
    selectedPosition(val) {
      if (!val) {
        return;
      }
      this.$_changePopupPosition();
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  created: function () {
    if (!storage) {
      storage = new SettingsStorage(chrome.storage.sync);
    }
    this.$_syncConfig();
  },
  mounted: function () {
    this.$_getSavedWords();
    this.$_getFoundWordsOfTab();
  },
  methods: {
    $_toggleTheme() {
      const message = {
        type: MESSAGE_TYPES.TOGGLE_THEME,
        data: { useDarkTheme: this.useDarkTheme },
      };
      storage.useTheme(this.useDarkTheme).then(() => {
        chrome.runtime.sendMessage(message);
      });
    },
    $_getFoundWordsOfTab() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab) {
          return;
        }
        const message = {
          type: MESSAGE_TYPES.GET_FOUND_WORDS,
        };
        chrome.tabs.sendMessage(activeTab.id, message, (response) => {
          const { data: foundWords } = response;
          this.foundWords = foundWords;
        });
      });
    },
    $_changePopupPosition() {
      storage.updatePopupPosition(this.selectedPosition).then(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (!activeTab) {
            return;
          }
          const message = {
            type: MESSAGE_TYPES.CHANGE_POPUP_POSITION,
            data: { position: this.selectedPosition },
          };
          chrome.tabs.sendMessage(activeTab.id, message);
        });
      });
    },
    $_getSavedWords() {
      const message = {
        type: MESSAGE_TYPES.GET_LIST_WORDS,
      };
      chrome.runtime.sendMessage(message, (response) => {
        const { data: words } = response;
        this.words = words;
      });
    },
    $_removeWord(data) {
      const { word, index } = data;
      const message = {
        type: MESSAGE_TYPES.DELETE_CONTEXT,
        data: {
          word,
        },
      };
      chrome.runtime.sendMessage(message, (response) => {
        const { data } = response;
        if (!data.success) {
          return;
        }
        this.$delete(this.words, index);
        this.$on_contextDeleted(word);
      });
    },
    $_syncConfig() {
      storage.getAppSettings().then((settings) => {
        this.useDarkTheme = settings.useDarkTheme;
        this.highlightStyle = settings.highlightStyle;
        this.selectedPosition = settings.popupPosition;
      });
    },
    $_updateStyle() {
      storage.updateHighlightStyle(this.highlightStyle).then(() => {
        const message = {
          type: MESSAGE_TYPES.UPDATE_HIGHLIGHT_STYLE,
          data: this.highlightStyle,
        };
        chrome.runtime.sendMessage(message);
      });
    },
    $on_contextDeleted(word) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab) {
          return;
        }
        const message = {
          type: MESSAGE_TYPES.UNHIGHLIGHT_WROD,
          data: { word },
        };
        chrome.tabs.sendMessage(activeTab.id, message, (response) => {
          this.$delete(this.foundWords, word);
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "../components/scss/main.scss";

html {
  body {
    margin: 0;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
    border-radius: 7px;
  }
}

#extension-popup {
  padding: 8px;
  width: 400px;
  height: auto;
  position: relative;
  z-index: 2;
  background: var(--ext-background-color);
  color: var(--ext-text-color);

  .group {
    &__info {
      display: grid;
      grid-template-columns: auto auto auto;
      justify-content: flex-start;
      column-gap: 1rem;

      > * {
        width: fit-content;
        text-align: center;
      }
    }

    &__value {
      text-align: center;
    }
  }
}

.ext-popup-groups {
  > .group:not(:last-child) {
    margin-bottom: 1rem;
  }
  .group {
    &__title {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      padding-bottom: 5px;
      border-bottom: 1px solid grey;
      font-weight: bold;
      opacity: 0.8;
    }
    &__content {
      margin: 0;
    }
  }
}

.field-group {
  > .field:not(:last-child) {
    margin-bottom: 0.75rem;
  }
}

.field {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  &.vertical {
    flex-direction: column;
    align-items: stretch;

    label {
      margin-bottom: 10px;
    }
  }

  label {
    font-size: 1rem;
  }
}

.list-words__popup {
  position: fixed;
  left: -100px;
  top: 0;
  max-width: 300px;
  z-index: 99;
}
</style>
