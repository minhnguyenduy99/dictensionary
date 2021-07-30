export default (request, sender, sendResponse, options) => {
  const { repository } = options;
  const { data } = request;
  repository.getListSavedWords().then((result) => {
    sendResponse({ data: result });
  });
};
