export default (request, sender, sendResponse, options) => {
  const { repository } = options;
  const {
    data: { word, visual_context, textual_context, definition_index },
  } = request;
  repository
    .addDefinitionContext(word, {
      visual_context,
      textual_context,
      definition_index,
    })
    .then((result) => {
      sendResponse({ data: result });
    });
};
