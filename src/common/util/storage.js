export class Storage {
  static async get(key) {
    return window.localStorage.getItem(key);
  }

  static async set(key, value) {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      return await Storage.remove(key);
    }
  }

  static async remove(key) {
    return window.localStorage.removeItem(key);
  }
}
