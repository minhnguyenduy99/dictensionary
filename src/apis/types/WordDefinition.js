export class WordDefinition {
  /**
   * @type {string}
   */
  definition;

  /**
   * @type {string}
   */
  partOfSpeech;

  /**
   * @type {string[]}
   */
  examples;

  /**
   * @type {string[]}
   */
  synonyms;

  /**
   * @type {string}
   */
  pronunciation;

  /**
   *
   * @param {{ definition: string, partOfSpeech: string, synonyms: string[], examples: string[], pronunciation }} options
   */
  constructor(options) {
    const {
      definition,
      partOfSpeech,
      synonyms = [],
      examples = [],
      pronunciation,
    } = options;
    this.definition = definition;
    this.partOfSpeech = partOfSpeech;
    this.synonyms = synonyms;
    this.examples = examples;
    this.pronunciation = `/${pronunciation}/`;
  }
}
