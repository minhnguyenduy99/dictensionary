import { configApiHeader } from "./utils";
import { getAPIConfig } from "./config-key";
import { DictionaryWord } from "./types";

const apiHost = process.env.VUE_APP_API_ENDPOINT;

export const addDefinitionContext = (word, options) => {
  const { definition_index, textual_context, visual_context } = options;
  const fullRequestURL = `${apiHost}/words/${word}`;
  const headers = configApiHeader(getAPIConfig());
  console.log(options);

  return fetch(fullRequestURL, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({
      definition_index,
      textual_context,
      visual_context,
    }),
  })
    .then((response) => response.json())
    .then((body) => ({ success: true }))
    .catch((err) => {
      console.log(err);
      return { success: false };
    });
};

export const deleteDefinitionContext = (word, options = {}) => {
  const { definition_index } = options;
  const requestURL = new URL(`${apiHost}/words/${word}`);
  definition_index !== undefined &&
    requestURL.searchParams.append("definition_index", definition_index);
  const headers = configApiHeader(getAPIConfig());

  return fetch(requestURL, {
    method: "DELETE",
    headers: headers,
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });
};

export const getWordDefinition = (word) => {
  const fullRequestURL = `${apiHost}/words/${word}`;
  const headers = configApiHeader(getAPIConfig());

  return fetch(fullRequestURL, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return null;
      }
      return new DictionaryWord(data);
    });
};

/**
 * Get list of saved words
 * @returns {Promise<string[]>}
 */
export const getListSavedWords = () => {
  const fullRequestURL = `${apiHost}/words/list/saved`;
  const headers = configApiHeader(getAPIConfig());

  return fetch(fullRequestURL, {
    method: "GET",
    headers: headers,
  }).then((response) => response.json());
};
