import { asID } from "../common/util/id";

export class Auth {
  #id;
  #email;
  #createdAt;
  #lastLogin;

  constructor(data) {
    this.#id = data?.uid || "";
    this.#email = data?.email || "";
    this.#createdAt = data?.metadata?.creationTime
      ? new Date(data.metadata.creationTime)
      : null;
    this.#lastLogin = data?.metadata?.lastSignInTime
      ? new Date(data.metadata.lastSignInTime)
      : null;
  }

  get id() {
    return asID(this.#id);
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
