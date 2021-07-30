export default (request, sender, sendResponse, options) => {
  const { repository } = options;
  const { data } = request;
  repository.getWordDefinition(data.word).then((result) => {
    console.log(result);
    sendResponse({ data: result });
  });
};
