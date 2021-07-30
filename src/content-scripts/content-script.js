import Vue from "vue";
import { injectComponent } from "../components/utils";
import DictionaryPopup from "../components/dictionary-popup.vue";
import { highlightSavedWords } from "../components/utils";
import { MESSAGE_TYPES } from "../message-handlers";
import "./inject-scripts";

injectComponent(Vue, DictionaryPopup);

chrome.runtime.onMessage.addListener(onTabMessagedReceived);

function onTabMessagedReceived(request, sender, sendResponse) {
  const { type, data } = request;
  switch (type) {
    case MESSAGE_TYPES.GET_LIST_WORDS: {
      highlightSavedWords(data);
      break;
    }
  }
}

console.log("Hello from the content-script");
