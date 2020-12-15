export class PartialUser {
  #id;
  #displayName;

  constructor(data) {
    this.#id = data?.id || "";
    this.#displayName = data?.displayName || "";
  }

  get id() {
    return this.#id;
  }

  get displayName() {
    return this.#displayName;
  }
}
