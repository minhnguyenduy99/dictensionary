export default {
  listeners: [],
  style: {
    opacity: 100,
    backgroundColor: "hsl(105, 85%, 35%)",
    color: "white",
  },
  addListener(listener) {
    this.listeners.push(listener);
  },
  removeAllListeners() {
    this.listeners.length = 0;
  },
  updateStyle(newStyle) {
    this.style = newStyle;
    this.listeners.forEach((listener) => listener?.(newStyle));
  },
};
