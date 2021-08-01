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
        <p class="group__title">Number of words</p>
        <p class="group__content">{{ wordContextCount }}</p>
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
                v-model="highlightColors.textColor"
              />
            </div>
            <div class="field">
              <label>Background color</label>
              <input
                type="color"
                id="head"
                name="head"
                v-model="highlightColors.backgroundColor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExtSwitch from "../components/base/switch.vue";
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
  },
  data: () => ({
    updating: false,
    wordContextCount: 0,
    useDarkTheme: null,
    highlightColors: {
      textColor: "",
      backgroundColor: "",
    },
  }),
  computed: {
    switchThemeLabel() {
      return this.useDarkTheme ? "Dark theme" : "Light theme";
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
      console.log("toggle theme");
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
        const { data } = response;
        this.wordContextCount = data?.length ?? 0;
      });
    },
    $_syncConfig() {
      storage.getAppSettings().then((settings) => {
        console.log(settings);
        this.useDarkTheme = settings.useDarkTheme;
      });
    },
  },
};
</script>

<style lang="scss">
@import "../components/scss/main.scss";

html {
  width: 300px;
  height: auto;

  body {
    margin: 0;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
    border-radius: 7px;

    * {
      color: var(--ext-text-color);
      background: var(--ext-background-color);
    }
  }
}

#extension-popup {
  padding: 8px;
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
      font-size: 1.5rem;
    }
  }
}

.field-group {
  > .field:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}

.field {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  label {
    font-size: 1rem;
  }
}
</style>
