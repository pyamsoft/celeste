export class User {
  static UNDEFINED = undefined;
  static NOT_LOGGED_IN = null;

  #id;
  #email;
  #createdAt;
  #lastLogin;
  #displayName;

  constructor(data) {
    this.#id = data?.id || "";
    this.#email = data?.email || "";
    this.#createdAt = data?.creationTime || "";
    this.#lastLogin = data?.lastLoginAt || "";
    this.#displayName = data?.displayName || "";
  }

  get id() {
    return this.#id;
  }

  get email() {
    return this.#email;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get lastLogin() {
    return this.#lastLogin;
  }

  get displayName() {
    return this.#displayName;
  }
}
