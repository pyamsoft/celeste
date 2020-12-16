export class PartialUser {
  #real;
  #displayName;

  constructor(data) {
    this.#real = !!data;
    this.#displayName = data?.displayName || "";
  }

  get displayName() {
    return this.#displayName;
  }

  get exists() {
    return this.#real;
  }
}
