export class BaseStorage {
  _storage;

  constructor(storage = null) {
    this.useStorage(storage);
  }

  useStorage(storage) {
    this._storage = storage;
  }

  get(keys) {
    return new Promise((resolve) => {
      this._storage.get(keys, function (result) {
        resolve(result);
      });
    });
  }

  set(object) {
    return new Promise((resolve) => {
      this._storage.set(object, function () {
        resolve();
      });
    });
  }

  init() {}
}
