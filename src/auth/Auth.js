export class Auth {
  #id;
  #email;
  #createdAt;
  #lastLogin;

  constructor(data) {
    this.#id = data?.uid || "";
    this.#email = data?.email || "";
    this.#createdAt = data?.metadata?.creationTime || "";
    this.#lastLogin = data?.metadata?.lastSignInTime || "";
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
}
