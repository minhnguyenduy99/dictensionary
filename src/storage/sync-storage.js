const storage = chrome.storage.sync;

export default {
  get(keys) {
    return new Promise((resolve) => {
      storage.get(keys, function (result) {
        resolve(result);
      });
    });
  },
  set(object) {
    return new Promise((resolve) => {
      storage.set(object, function () {
        resolve();
      });
    });
  },
};
