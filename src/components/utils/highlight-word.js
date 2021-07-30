import Vue from "vue";
import { default as HighlightWord } from "../highlight-word";
import { createComponent } from "./create-component";

const highlightQuerySelector = "p, span, body:not(#dictionary-popup)";

/**
 *
 * @param {Vue} component
 * @param {string[]} listWords
 */
export function highlightSavedWords(listWords) {
  const elements = document.querySelectorAll(highlightQuerySelector);
  const textElements = [];
  elements.forEach((element) => {
    const child = element.childNodes[0];
    if (!child || child?.nodeType !== 3) {
      return;
    }
    textElements.push(element);
  });
  textElements.forEach((element, index) => {
    spliTextElement(element, listWords);
  });
}

/**
 *
 * @param {Element} textElement
 * @param {string[]} filterWords
 */
function spliTextElement(textElement, filterWords) {
  let textContent = textElement.textContent;
  textElement.textContent = "";
  let tempTextContent = textContent;
  filterWords.forEach((word, index) => {
    const regex = new RegExp(word + "\\b", "gi");
    let wordIndex = tempTextContent.search(regex);
    while (wordIndex !== -1) {
      const el = document.createElement("span");
      el.innerText = tempTextContent.slice(0, wordIndex);
      const highlight = createComponent(Vue, HighlightWord);
      highlight.$children[0].word = tempTextContent.substr(
        wordIndex,
        word.length
      );
      tempTextContent = tempTextContent.slice(wordIndex + word.length);
      textElement.appendChild(el);
      textElement.appendChild(highlight.$el);
      wordIndex = tempTextContent.indexOf(word);
    }
    if (tempTextContent === "") {
      return;
    }
  });
  const el = document.createElement("span");
  el.innerText = tempTextContent;
  textElement.appendChild(el);
}
