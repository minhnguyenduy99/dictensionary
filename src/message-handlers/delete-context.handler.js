export default (request, sender, sendResponse, options) => {
  const { repository } = options;
  const {
    data: { word, definition_index },
  } = request;
  repository
    .deleteDefinitionContext(word, { definition_index })
    .then((result) => {
      const { error, data } = result;
      if (error) {
        sendResponse({ data: { success: false } });
        return;
      }
      sendResponse({ data });
    });
};
