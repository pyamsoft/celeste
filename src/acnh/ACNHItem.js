import { sentenceCase } from "../common/util/string";

export class ACNHItem {
  #id;
  #name;
  #price;
  #image;

  constructor({ id, name, price, image }) {
    this.#id = id || "";
    this.#name = name || "";
    this.#price = price || 0;
    this.#image = image || "";
  }

  get id() {
    return this.#id;
  }

  get name() {
    return sentenceCase(this.#name);
  }

  get price() {
    return this.#price;
  }

  get image() {
    return this.#image;
  }
}
