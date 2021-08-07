export default (request, sender, sendResponse, options) => {
  const { repository } = options;
  const { data } = request;
  repository.getWordDefinition(data.word).then((result) => {
    sendResponse({ data: result });
  });
};
