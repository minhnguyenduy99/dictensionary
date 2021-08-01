import { MESSAGE_TYPES } from "./message-types";

export default (request, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      return;
    }
    const { data } = request;
    const message = {
      type: MESSAGE_TYPES.UPDATE_HIGHLIGHT_STYLE,
      data,
    };
    chrome.tabs.sendMessage(activeTab.id, message);
  });
};
