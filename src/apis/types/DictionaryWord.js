import { WordDefinition } from "./WordDefinition";

export class DictionaryWord {
  /**
   * @type {string}
   */
  word;

  /**
   * @type {WordDefinition[]}
   */
  definitions;

  /**
   * @type {{ all: string; noun: string; verb: string; adjective: string; } | string}
   */
  pronunciation;

  contexts;

  /**
   *
   * @param {{
   *    word: string,
   *    definitions: any[],
   *    pronunciation: { all: string }
   * }} wordOptions
   */
  constructor(wordOptions) {
    const { word, definitions = [], pronunciation, contexts } = wordOptions;
    this.word = word;
    this.pronunciation = pronunciation;
    this.contexts = contexts;
    this.definitions = definitions.map((def) => {
      const partOfSpeech = def.partOfSpeech;
      const defObj = {
        ...def,
        pronunciation:
          this.pronunciation?.[partOfSpeech] ??
          this.pronunciation?.all ??
          this.pronunciation ??
          null,
      };
      return new WordDefinition(defObj);
    });
  }
}
