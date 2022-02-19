import Vue from "vue";
import "../components/scss/main.scss";
import { SettingsStorage } from "../storage";
import {
  injectComponent,
  positionPopup,
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
import { unhighlightWord } from "../components/utils/highlight-word";

const dictionaryPopup = injectComponent(Vue, DictionaryPopup);
const contextPopup = injectComponent(Vue, ContextPopup);

setContextPopup(contextPopup);

chrome.runtime.onMessage.addListener(onTabMessagedReceived);

let storage = new SettingsStorage(chrome.storage.sync);

window.onload = () => {
  storage.getAppSettings().then((settings) => {
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
    }, settings.highlightStyle);
    positionPopup(dictionaryPopup.$el, { position: settings.popupPosition });
    positionPopup(contextPopup.$el, { position: settings.popupPosition });
  });
};

function onTabMessagedReceived(request, sender, sendResponse) {
  const { type, data } = request;
  switch (type) {
    case MESSAGE_TYPES.GET_LIST_WORDS: {
      storage.getAppSettings().then((settings) => {
        highlightSavedWords(data, () => true, settings.highlightStyle);
      });
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
    case MESSAGE_TYPES.GET_FOUND_WORDS: {
      sendResponse({
        data: highlightStyleObserver.getHighlightInfo()?.foundWords,
      });
      break;
    }
    case MESSAGE_TYPES.UNHIGHLIGHT_WROD: {
      unhighlightWord(data.word);
      sendResponse({
        data: highlightStyleObserver.getHighlightInfo()?.foundWords,
      });
      break;
    }
    case MESSAGE_TYPES.CHANGE_POPUP_POSITION: {
      positionPopup(dictionaryPopup.$el, { position: data.position });
      positionPopup(contextPopup.$el, { position: data.position });
      break;
    }
  }
}

console.log("Dictensionary is executed on this page");
