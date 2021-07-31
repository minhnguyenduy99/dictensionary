import { BaseStorage } from "./base-storage";

export class WordStorage extends BaseStorage {
  async init() {
    const wordStorageSetting = {
      en: {},
      jp: {},
    };
    try {
      await this.set(wordStorageSetting);
      return true;
    } catch (err) {
      console.log("Init WordStorage: failed");
      return false;
    }
  }

  async addWordDefinition(data) {
    const { word, definitionIndex, context } = data;
    try {
      const result = await this.get(["settings"]);
      const language = result.settings.language;
      let setOfWords = await this.get([language]);
      let wordDefinition = setOfWords[language][word];
      if (!wordDefinition) {
        wordDefinition = {
          definitions: {},
        };
      }
      const { textualContext, visualContext } = context;
      wordDefinition.definitions[definitionIndex] = {
        textualContext,
        visualContext,
      };
      setOfWords[word] = wordDefinition;
      await this.set({ [language]: setOfWords });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getAllWords(language = "en") {
    const words = await this.get([language]);
    return words;
  }
}
