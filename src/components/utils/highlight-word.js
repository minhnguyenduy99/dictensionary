import Vue from "vue";
import { default as HighlightWord } from "../highlight-word";
import { createComponent } from "./create-component";
import highlightStyleObserver from "./highlight-style-observer";

const highlightQuerySelector = `
    p:not(#dictionary-popup *, #context-popup *),
    h1:not(#dictionary-popup *, #context-popup *),
    h2:not(#dictionary-popup *, #context-popup *),
    h3:not(#dictionary-popup *, #context-popup *),
    h4:not(#dictionary-popup *, #context-popup *),
    h5:not(#dictionary-popup *, #context-popup *),
    h6:not(#dictionary-popup *, #context-popup *),
    dd:not(#dictionary-popup *, #context-popup *),
    div > span
  `;

/**
 *
 * @param {() => string[] | Promise<string[]>} getListWordsHandler
 * @param {(highlightInfo) => void} highlightUpdateCallback
 */
export function autoHighlightWords(
  getListWordsHandler,
  highlightStyle = highlightStyleObserver.style
) {
  let lastBodyHeight = window.innerHeight;
  let lastUpdatedTime = 0;
  let defaultTimeSpan = 5000; // 10 seconds

  const resizeObserver = new ResizeObserver((entries) => {
    if (!bounce()) {
      return Promise.resolve();
    }
    return Promise.resolve(getListWordsHandler()).then((words) => {
      const body = entries[0];
      // calculate the expanded size
      const expandedYPosition = lastBodyHeight;
      lastBodyHeight = body.contentRect.height;
      // highlight words in expanded size
      highlightSavedWords(
        words,
        (el) => {
          const onExpanded =
            el.getBoundingClientRect().top + window.scrollY > expandedYPosition;
          return onExpanded;
        },
        highlightStyle
      );
    });
  });
  resizeObserver.observe(document.body, { box: "content-box" });

  function bounce() {
    const current = Date.now();
    if (current - lastUpdatedTime < defaultTimeSpan) {
      return false;
    }
    lastUpdatedTime = current;
    return true;
  }
}

/**
 *
 * @param {string[]} listWords
 * @param {(el: Element) => boolean} elementFilterCallback
 */
export async function highlightSavedWords(
  listWords,
  elementFilterCallback = (el) => true,
  highlightStyle = null
) {
  const foundWords = {};
  const elements = Array.from(
    document.querySelectorAll(highlightQuerySelector).values()
  );
  try {
    await Promise.all(
      elements.map(async (element) => {
        if (!elementFilterCallback(element)) {
          throw Error("Stop finding elements");
        }
        createHighlightFromElements(element, listWords, foundWords);
      })
    );
  } catch (err) {
    console.log("Stop finding elements");

    highlightStyle && highlightStyleObserver.updateStyle(highlightStyle);
    highlightStyleObserver.updateHighlightInfo({ foundWords });
  }
}

/**
 * @param {string} word
 */
export function unhighlightWord(word) {
  const highlightEls = Array.from(
    document.getElementsByClassName("highlight-word")
  );
  const elementIds = [];
  highlightEls.forEach((highlightEl) => {
    if (highlightEl.textContent.toLowerCase() === word) {
      const elementId = highlightEl.getAttribute("highlight-word-id");
      highlightEl.classList.remove("highlight-word");
      highlightEl.removeAttribute("style");
      elementIds.push(elementId);
    }
  });
  highlightStyleObserver.removeWord(word);
  highlightStyleObserver.removeListenersByIds(elementIds);
}

/**
 *
 * @param {Element} element
 * @param {string[]} searchWords
 */
function createHighlightFromElements(element, searchWords, foundWords) {
  const newChildren = [];
  element.childNodes.forEach((child) => {
    // a text-type element
    if (child.nodeType === 3) {
      newChildren.push(...splitTextElement(child, searchWords, foundWords));
      return;
    }
    const childTextContent = child.textContent;
    if (
      child.classList?.contains("highlight-word") &&
      childTextContent !== ""
    ) {
      foundWords[childTextContent.toLowerCase()] = 1;
    } else {
      // recursively create highlight element from child
      createHighlightFromElements(child, searchWords, foundWords);
    }

    newChildren.push(child);
  });
  element.textContent = "";
  element.append && element.append(...newChildren);
}

/**
 *
 * @param {ChildNode} textElement
 * @param {string[]} searchWords
 * @returns
 */
function splitTextElement(textElement, searchWords, foundWords) {
  let textContent = textElement.textContent;
  const newElements = [textContent];

  searchWords.forEach((word) => {
    let elementCount = newElements.length;
    while (elementCount > 0) {
      const currentElement = newElements.shift();
      // is highlight element
      if (typeof currentElement !== "string") {
        newElements.push(currentElement);
        elementCount--;
        continue;
      }
      let splitTextElements = splitTextToWords(currentElement, word);
      // word is not found
      if (splitTextElements.length > 1) {
        foundWords[word] = 1;
      }
      newElements.push(...splitTextElements);
      elementCount--;
    }
  });

  return newElements;

  /**
   *
   * @param {Element} textElement
   * @param {string} word
   */
  function splitTextToWords(textContent, word) {
    let newElements = [];
    let tempTextContent = textContent;
    const regex = new RegExp(word + "\\b", "gi");
    let wordIndex = tempTextContent.search(regex);
    while (wordIndex !== -1) {
      const textFirstFragment = tempTextContent.slice(0, wordIndex);
      const highlight = createComponent(Vue, HighlightWord);
      const searchWord = tempTextContent.substr(wordIndex, word.length);
      tempTextContent = tempTextContent.slice(wordIndex + word.length);

      textFirstFragment !== "" && newElements.push(textFirstFragment);
      newElements.push(highlight.$el);
      highlight.$children[0].$setWord(searchWord);

      wordIndex = tempTextContent.search(regex);
    }
    tempTextContent !== "" && newElements.push(tempTextContent);
    return newElements;
  }
}
