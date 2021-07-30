import Vue from "vue";
import { default as HighlightWord } from "../highlight-word";
import { createComponent } from "./create-component";

const highlightQuerySelector = `
    p:not(#dictionary-popup *, #context-popup *),
    h1:not(#dictionary-popup *, #context-popup *),
    h2:not(#dictionary-popup *, #context-popup *),
    h3:not(#dictionary-popup *, #context-popup *),
    h4:not(#dictionary-popup *, #context-popup *),
    h5:not(#dictionary-popup *, #context-popup *),
    h6:not(#dictionary-popup *, #context-popup *),
    span:not(#dictionary-popup *, #context-popup *, .highlight-word)
  `;

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
      const searchWord = tempTextContent.substr(wordIndex, word.length);
      tempTextContent = tempTextContent.slice(wordIndex + word.length);
      textElement.appendChild(el);
      textElement.appendChild(highlight.$el);
      highlight.$children[0].$setWord(searchWord);
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

/**
 * 
 * @param {Element} textElement 
 * @param {string[]} filterWords 
 */
function separateTextElement(textElement, filterWords) {
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
      const searchWord = tempTextContent.substr(wordIndex, word.length);
      tempTextContent = tempTextContent.slice(wordIndex + word.length);
      textElement.appendChild(el);
      textElement.appendChild(highlight.$el);
      highlight.$children[0].$setWord(searchWord);
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
