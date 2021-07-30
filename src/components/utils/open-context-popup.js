var _contextPopup;

export function setContextPopup(contextPopup) {
  _contextPopup = contextPopup;
}

export function openContextPopup(word, position) {
  _contextPopup.$children[0].$open(word, position);
}
