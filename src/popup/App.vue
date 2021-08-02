<template>
  <div
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
          <div
            class="
              ext-flex
              ext-flex-justify-content-space-between
              ext-flex-align-items-center
            "
          >
            <div>
              <p>Number of words</p>
              <p class="ext-title">{{ words.length }}</p>
            </div>
            <div class="ext-groups ext-vertical">
              <div class="ext-input no-animation">
                <input type="text" v-model.lazy="wordSearch" />
                <label>Search for words</label>
              </div>
            </div>
          </div>
          <ext-expand
            :open.sync="listWordsExpanded"
            rounded
            :title="`List of words (${filteredWords.length})`"
            headerClass="ext-primary"
            style="margin-top: 10px"
          >
            <list-words
              :words="filteredWords"
              emptyText="No words found"
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
        <p class="group__title">Highlight component</p>
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
                  <p class="ext-size-3">{{ highlightStyle.opacity }}</p>
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
    highlightStyle: {},
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
        console.log("style changed");
        this.$_updateStyle();
      },
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
      });
    },
    $_syncConfig() {
      storage.getAppSettings().then((settings) => {
        this.useDarkTheme = settings.useDarkTheme;
        this.highlightStyle = settings.highlightStyle;
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
  },
};
</script>

<style lang="scss">
@import "../components/scss/main.scss";

html {
  width: 400px;
  height: auto;

  body {
    margin: 0;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
    border-radius: 7px;
  }
}

#extension-popup {
  padding: 8px;
  position: relative;
  z-index: 2;
  background: var(--ext-background-color);
  color: var(--ext-text-color);
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
