import { wordStorage } from "../storage";

/**
 *
 * @param {Vue} component
 * @param {string[]} listWords
 */
export function highlightSavedWords(component, listWords) {
  const element = component.$el;
  console.log("highlight words");
  const words = ["tokyo", "friend"];
  const elements = document.querySelectorAll("body, body *");
  const textElements = [];
  elements.forEach((element) => {
    const child = element.childNodes[0];
    if (!child || child?.nodeType !== 3) {
      return;
    }
    textElements.push(element);
  });
  console.log(textElements);
  textElements
    .filter((el) => {
      const sentence = el.innerText;
      return (
        words.findIndex(
          (word) => sentence.toLowerCase().search(word) !== -1
        ) !== -1
      );
    })
    .forEach((el) => {
      el.style.backgroundColor = "red";
    });
}
