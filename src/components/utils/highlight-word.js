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
 * @param {() => string[] | Promise<string[]>} getListWordsHandler
 */
export async function autoHighlightWords(getListWordsHandler) {
  let lastBodyHeight = window.innerHeight;
  const resizeObserver = new ResizeObserver((entries) => {
    return new Promise((resolve) => {
      resolve(getListWordsHandler());
    }).then((words) => {
      const body = entries[0];
      // calculate the expanded size
      const expandedYPosition = lastBodyHeight;
      lastBodyHeight = body.contentRect.height;
      console.log("ScrollY: " + expandedYPosition);
      const current = Date.now();
      console.log("New element: " + current);
      // highlight words in expanded size
      highlightSavedWords(words, (el) => {
        const onExpanded =
          el.getBoundingClientRect().top + window.scrollY > expandedYPosition;
        onExpanded && console.log(el.getBoundingClientRect().top);
        return onExpanded;
      });
    });
  });

  resizeObserver.observe(document.body, { box: "content-box" });
}

/**
 *
 * @param {string[]} listWords
 * @param {(el: Element) => boolean} elementFilterCallback
 */
export async function highlightSavedWords(
  listWords,
  elementFilterCallback = (el) => true
) {
  const elements = Array.from(
    document.querySelectorAll(highlightQuerySelector).values()
  );
  await Promise.all(
    elements.map(async (element) => {
      if (!elementFilterCallback(element)) {
        return;
      }
      createHighlightFromElements(element, listWords);
    })
  );
}

/**
 *
 * @param {Element} element
 * @param {string[]} searchWords
 */
function createHighlightFromElements(element, searchWords) {
  const newChildren = [];
  element.childNodes.forEach((child) => {
    // a text-type element
    if (child.nodeType === 3) {
      newChildren.push(...splitTextElement(child, searchWords));
      return;
    }
    if (!child.classList?.contains("highlight-word")) {
      // recursively create highlight element from child
      createHighlightFromElements(child, searchWords);
    }

    newChildren.push(child);
  });
  element.textContent = "";
  element.append?.(...newChildren);
}

/**
 *
 * @param {ChildNode} textElement
 * @param {string[]} searchWords
 * @returns
 */
function splitTextElement(textElement, searchWords) {
  const newElements = [];
  let textContent = textElement.textContent;

  searchWords.every((word) => {
    const regex = new RegExp(word + "\\b", "gi");
    let wordIndex = textContent.search(regex);
    while (wordIndex !== -1) {
      const textFirstFragment = textContent.slice(0, wordIndex);
      const highlight = createComponent(Vue, HighlightWord);
      const searchWord = textContent.substr(wordIndex, word.length);
      textContent = textContent.slice(wordIndex + word.length);

      newElements.push(textFirstFragment, highlight.$el);
      highlight.$children[0].$setWord(searchWord);

      wordIndex = textContent.search(regex);
    }
    if (textContent === "") {
      // stop iterating through the rest of words
      return false;
    }
    return true;
  });

  if (textContent === "") {
    return newElements;
  }

  newElements.push(textContent);

  return newElements;
}
