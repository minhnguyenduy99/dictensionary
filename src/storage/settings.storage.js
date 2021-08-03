import { BaseStorage } from "./base-storage";

export class SettingsStorage extends BaseStorage {
  async init() {
    const settings = {
      app_info: {
        app_key: null,
        app_created_date: null,
      },
      settings: {
        useDarkTheme: true,
        highlightStyle: {
          backgroundColor: "hsl(105, 85%, 35%)",
          color: "white",
          opacity: 80,
        },
        language: "en",
      },
    };
    try {
      await this.set(settings);
      return true;
    } catch (err) {
      console.log("Init WordStorage: failed");
      return false;
    }
  }

  async saveAppSettings(settings) {
    const { app_key, created_date } = settings;
    try {
      await this.set({
        app_info: {
          app_key,
          created_date,
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getAppSettings() {
    try {
      const storage = await this.get(["settings"]);
      return storage.settings;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async useTheme(useDarkTheme) {
    try {
      const storage = await this.get(["settings"]);
      storage.settings.useDarkTheme = useDarkTheme;
      await this.set({ settings: storage.settings });
    } catch (err) {
      console.error(err);
    }
  }

  async updateHighlightStyle(style) {
    try {
      const storage = await this.get(["settings"]);
      storage.settings.highlightStyle = style;
      await this.set({ settings: storage.settings });
    } catch (err) {
      console.error(err);
    }
  }

  async getAppInfo() {
    try {
      const result = await this.get(["app_info"]);
      return result.app_info;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
