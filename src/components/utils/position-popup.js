/**
 * Position a `popup` in coordinate to the position of the `word`
 * @param {HTMLElement} popup
 * @param {{ position: "left" | "right" }} positionOptions
 */
export function positionPopup(popup, positionOptions) {
  const { position } = positionOptions;
  let realPosition = null;
  switch (position) {
    case "right":
      realPosition = { right: "10px", top: "10px" };
      break;
    case "left":
    default:
      realPosition = { left: "10px", top: "10px" };
  }
  popup.style.left = realPosition.left ?? "";
  popup.style.right = realPosition.right ?? "";
  popup.style.top = realPosition.top;
}
