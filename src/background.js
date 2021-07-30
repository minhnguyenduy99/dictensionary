import { DictionaryRepository, SettingsRepository, configApiKey } from "./apis";
import {
  MESSAGE_TYPES,
  getWordDefinitionHandler,
  createWordContextHandler,
  getListSavedWordsHandler,
  deleteWordContextHandler,
} from "./message-handlers";
import { syncAppStorage, initStorage, settingStorage } from "./storage";

console.log("Background script is running");

chrome.runtime.onMessage.addListener(onMessageReceived);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.tabs.onUpdated.addListener(onTabUpdated);

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
  }

  return true;
}

function onTabUpdated(tabId, changeInfo) {
  const { status } = changeInfo;
  if (status === "complete") {
    DictionaryRepository.getListSavedWords().then((words) => {
      const message = {
        type: MESSAGE_TYPES.GET_LIST_WORDS,
        data: words,
      };
      console.log("send tab message");
      chrome.tabs.sendMessage(tabId, message, null);
    });
  }
}

function onInstalled(details) {
  syncAppStorage();
  if (details.reason !== "install") {
    settingStorage.getAppInfo().then((appInfo) => {
      console.log(appInfo);
      configApiKey({ appKey: appInfo.app_key, appId: chrome.runtime.id });
    });
    return;
  }
  initStorage().then(() => {
    const appId = chrome.runtime.id;
    SettingsRepository.assignApp(appId).then((data) => {
      if (!data) {
        console.error("Cannot assign app");
        return;
      }
      return settingStorage
        .saveAppSettings({
          app_key: data.api_key,
          created_date: data.created_date,
        })
        .then(() => {
          // config key for reqpository
          configApiKey({ appKey: data.api_key, appId });
          console.log("Dictensionary is installed");
        });
    });
  });
  return true;
}
