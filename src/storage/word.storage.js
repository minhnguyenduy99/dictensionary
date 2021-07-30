export default {
  storage: null,

  useStorage(storage) {
    this.storage = storage;
    return this;
  },
  async init() {
    const wordStorageSetting = {
      en: {},
      jp: {},
    };
    try {
      await this.storage.set(wordStorageSetting);
      return true;
    } catch (err) {
      console.log("Init WordStorage: failed");
      return false;
    }
  },
  async addWordDefinition(data) {
    const { word, definitionIndex, context } = data;
    try {
      const result = await this.storage.get(["settings"]);
      const language = result.settings.language;
      let setOfWords = await this.storage.get([language]);
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
      await this.storage.set({ [language]: setOfWords });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  async getAllWords(language = "en") {
    const words = await this.storage.get([language]);
    return words;
  },
};
