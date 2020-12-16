import { sentenceCase } from "../common/util/string";

export class ACNHItem {
  #id;
  #name;
  #price;
  #image;
  #series;
  #type;

  constructor({ id, name, price, image, series, type }) {
    this.#id = id || "";
    this.#name = name || "";
    this.#price = price || 0;
    this.#image = image || "";
    this.#series = series || "";
    this.#type = type || "";
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

  get series() {
    return this.#series;
  }

  get type() {
    return this.#type;
  }
}
