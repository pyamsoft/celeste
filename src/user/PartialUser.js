import { asID } from "../common/util/id";

export class PartialUser {
  #id;
  #displayName;

  constructor(data) {
    this.#id = data?.id || "";
    this.#displayName = data?.displayName || "";
  }

  get id() {
    return asID(this.#id);
  }

  get displayName() {
    return this.#displayName;
  }
}
