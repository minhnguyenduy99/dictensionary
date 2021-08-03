export default {
  listeners: [],
  style: {
    opacity: 100,
    backgroundColor: "hsl(105, 85%, 35%)",
    color: "white",
  },
  highlightInfo: {
    foundWords: {},
  },
  updateHighlightInfo(highlightInfo) {
    const { foundWords } = highlightInfo;
    console.log(foundWords);
    this.highlightInfo.foundWords = {
      ...this.highlightInfo.foundWords,
      ...foundWords,
    };
  },
  removeWord(word) {
    const { foundWords } = this.highlightInfo;
    delete foundWords[word];
  },
  getHighlightInfo() {
    return this.highlightInfo;
  },
  addListener(id, listener) {
    this.listeners.push({ id, handler: listener });
  },
  removeAllListeners() {
    this.listeners.length = 0;
  },
  removeListenersByIds(listenerIds) {
    const idSet = new Set(listenerIds);
    this.listeners = this.listeners.filter(
      (listener) => !idSet.has(listener.id)
    );
  },
  updateStyle(newStyle) {
    this.style = newStyle;
    this.listeners.forEach((listener) => listener.handler?.(newStyle));
  },
};
