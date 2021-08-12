import { BaseStorage } from "./base-storage";

export class SettingsStorage extends BaseStorage {
  async init() {
    const settings = {
      app_info: {
        app_id: null,
        app_key: null,
        app_created_date: null,
      },
      settings: {
        useDarkTheme: true,
        highlightStyle: {
          backgroundColor: "#0f9d58",
          color: "#ffffff",
          opacity: 80,
        },
        popupPosition: "left",
        language: "en",
      },
    };
    try {
      await this.set(settings);
      return true;
    } catch (err) {
      console.error("Init WordStorage: failed");
      return false;
    }
  }

  async saveAppSettings(settings) {
    const { app_id, app_key, created_date } = settings;
    try {
      await this.set({
        app_info: {
          app_id,
          app_key,
          created_date,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async getAppSettings() {
    try {
      const storage = await this.get(["settings"]);
      return storage.settings;
    } catch (err) {
      console.error(err);
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

  /**
   * @param {"left" | "right"} position
   */
  async updatePopupPosition(position) {
    try {
      const storage = await this.get(["settings"]);
      storage.settings.popupPosition = position;
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
      console.error(err);
      return null;
    }
  }
}
