import _wordStorage from "./word.storage";
import _settingStorage from "./settings.storage";
import syncStorage from "./sync-storage";

export function syncAppStorage() {
  _wordStorage.useStorage(syncStorage);
  _settingStorage.useStorage(syncStorage);
}

export async function initStorage() {
  await Promise.all([_wordStorage.init(), _settingStorage.init()]);
}

export const wordStorage = _wordStorage;
export const settingStorage = _settingStorage;
