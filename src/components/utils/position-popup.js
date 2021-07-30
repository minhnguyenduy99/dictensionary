/**
 * Position a `popup` in coordinate to the position of the `word`
 * @param {DOMRect} wordPosition
 * @param {HTMLElement} popup
 */
export function positionPopup(wordPosition, popup) {
  popup.style.top = window.scrollY + wordPosition.top + "px";
  if (wordPosition.left > window.innerWidth / 2) {
    popup.style.left =
      (wordPosition.left - popup.clientWidth < 0
        ? 10
        : wordPosition.left - popup.clientWidth) + "px";
  } else {
    popup.style.left = wordPosition.left + "px";
  }
}
