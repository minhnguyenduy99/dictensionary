import { SettingsStorage } from "../../storage";

/**
 * @type {SettingsStorage}
 */
let storage;

export default {
  data: () => ({
    useDarkTheme: false,
  }),
  created: function () {
    if (!storage) {
      storage = new SettingsStorage(chrome.storage.sync);
    }
    storage.getAppSettings().then((settings) => {
      const { useDarkTheme } = settings;
      this.useDarkTheme = useDarkTheme;
    });
  },
  methods: {
    $setTheme(useDarkTheme) {
      this.useDarkTheme = useDarkTheme;
    },
  },
};
