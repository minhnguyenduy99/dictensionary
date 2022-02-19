import { DictionaryRepository, SettingsRepository, configApiKey } from "./apis";
import {
  MESSAGE_TYPES,
  getWordDefinitionHandler,
  createWordContextHandler,
  getListSavedWordsHandler,
  deleteWordContextHandler,
  toggleThemeHandler,
  styleHighlightHandler,
} from "./message-handlers";
import { createAllStorages, initStorages } from "./storage";

console.log("Background script is running");

chrome.runtime.onMessage.addListener(onMessageReceived);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.tabs.onUpdated.addListener(onTabUpdated);

const storages = createAllStorages(chrome.storage.sync);

function onMessageReceived(request, sender, sendResponse) {
  const { type } = request;
  switch (type) {
    case MESSAGE_TYPES.GET_WORD_DEFINITION:
      getWordDefinitionHandler(request, sender, sendResponse, {
        repository: DictionaryRepository,
      });
      break;
    case MESSAGE_TYPES.CREATE_WORD_CONTEXT:
      createWordContextHandler(request, sender, sendResponse, {
        repository: DictionaryRepository,
      });
      break;
    case MESSAGE_TYPES.GET_LIST_WORDS:
      getListSavedWordsHandler(request, sender, sendResponse, {
        repository: DictionaryRepository,
      });
      break;
    case MESSAGE_TYPES.DELETE_CONTEXT:
      deleteWordContextHandler(request, sender, sendResponse, {
        repository: DictionaryRepository,
      });
      break;
    case MESSAGE_TYPES.TOGGLE_THEME:
      toggleThemeHandler(request, sender, sendResponse);
      break;
    case MESSAGE_TYPES.UPDATE_HIGHLIGHT_STYLE:
      styleHighlightHandler(request, sender, sendResponse);
      break;
  }

  return true;
}

function onTabUpdated(tabId, changeInfo, tab) {
  const { status } = changeInfo;
  console.log(tab);
  // Only update on active tab when the extension is loaded
  if (status === "complete" && tab.url) {
    // test timeout
    setTimeout(() => {
      console.log("on tab updated");
      storages.settingsStorage.getAppInfo().then((appInfo) => {
        const { app_key, app_id } = appInfo ?? {};
        if (!app_key || !app_id) {
          console.log("[DEBUG] Cannot find app info");
          return;
        }
        configApiKey({ appKey: app_key, appId: app_id });
      });
    }, 1000);
  }
}

function onInstalled(details) {
  if (details.reason !== "install") {
    storages.settingsStorage.getAppInfo().then((appInfo) => {
      configApiKey({ appKey: appInfo.app_key, appId: chrome.runtime.id });
    });
    return;
  }
  initStorages(Object.values(storages)).then(() => {
    const appId = chrome.runtime.id;
    SettingsRepository.assignApp(appId).then((data) => {
      if (!data) {
        console.error("Cannot assign app");
        return;
      }
      // config key for reqpository
      configApiKey({ appKey: data.api_key, appId });
      return storages.settingsStorage
        .saveAppSettings({
          app_id: appId,
          app_key: data.api_key,
          created_date: data.created_date,
        })
        .then(() => {
          console.log("Dictensionary is installed");
        });
    });
  });
  return true;
}
