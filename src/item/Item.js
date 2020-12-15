export class Item {
  #id;
  #count;

  constructor(data) {
    this.#id = data?.id || "";
    this.#count = data?.count || 0;
  }

  get id() {
    return this.#id;
  }

  get count() {
    return this.#count;
  }
}
