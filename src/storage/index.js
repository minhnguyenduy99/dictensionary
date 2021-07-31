import { SettingsStorage } from "./settings.storage";
import { WordStorage } from "./word.storage";

export { WordStorage } from "./word.storage";
export { SettingsStorage } from "./settings.storage";

/**
 *
 * @param {BaseStorage[]} storages
 */
export function initStorages(storages) {
  return Promise.all(storages.map((storage) => storage.init()));
}

export function createAllStorages(storage) {
  return {
    wordStorage: new WordStorage(storage),
    settingsStorage: new SettingsStorage(storage),
  };
}
