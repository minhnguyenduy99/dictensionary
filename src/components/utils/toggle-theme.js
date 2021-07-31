/**
 * @param {any[]} components
 * @param {boolean} darkTheme
 */
export function togglePopupTheme(components, useDarkTheme) {
  components.forEach((component) => {
    component.$children[0].$setTheme(useDarkTheme);
  });
}
