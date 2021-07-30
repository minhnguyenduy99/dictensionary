export default {
  storage: null,

  useStorage(storage) {
    this.storage = storage;
    return this;
  },
  async init() {
    const settings = {
      app_info: {
        app_key: null,
        app_created_date: null,
      },
      settings: {
        language: "en",
      },
    };
    try {
      await this.storage.set(settings);
      return true;
    } catch (err) {
      console.log("Init WordStorage: failed");
      return false;
    }
  },
  async saveAppSettings(settings) {
    const { app_key, created_date } = settings;
    try {
      await this.storage.set({
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
  },
  async getAppInfo() {
    try {
      const result = await this.storage.get(["app_info"]);
      return result.app_info;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
