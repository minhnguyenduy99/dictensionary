import Vue from "vue";
import { SettingsStorage } from "../storage";
import {
  injectComponent,
  setContextPopup,
  togglePopupTheme,
} from "../components/utils";
import { DictionaryPopup, ContextPopup } from "../components";
import {
  highlightSavedWords,
  autoHighlightWords,
  highlightStyleObserver,
} from "../components/utils";
import { MESSAGE_TYPES } from "../message-handlers";
import "./inject-scripts";

const dictionaryPopup = injectComponent(Vue, DictionaryPopup);
const contextPopup = injectComponent(Vue, ContextPopup);

setContextPopup(contextPopup);

chrome.runtime.onMessage.addListener(onTabMessagedReceived);

window.onload = (ev) => {
  autoHighlightWords(() => {
    const message = {
      type: MESSAGE_TYPES.GET_LIST_WORDS,
    };
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        const { data } = response;
        resolve(data);
      });
    });
  });
  setTimeout(() => {
    new SettingsStorage(chrome.storage.sync).getAppSettings((settings) => {
      console.log("load style");
      highlightStyleObserver.updateStyle(settings.highlightStyle);
    });
  }, 2000);
};

function onTabMessagedReceived(request) {
  const { type, data } = request;
  switch (type) {
    case MESSAGE_TYPES.GET_LIST_WORDS: {
      highlightSavedWords(data);
      break;
    }
    case MESSAGE_TYPES.TOGGLE_THEME: {
      togglePopupTheme([dictionaryPopup, contextPopup], data.useDarkTheme);
      break;
    }
    case MESSAGE_TYPES.UPDATE_HIGHLIGHT_STYLE: {
      highlightStyleObserver.updateStyle(data);
      break;
    }
  }
}

console.log("Hello from the content-script");
