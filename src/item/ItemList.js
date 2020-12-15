import { Item } from "./Item";

export class ItemList {
  #id;
  #name;
  #items;

  constructor(data) {
    this.#id = data?.id || "";
    this.#name = data?.name || "";
    this.#items = data?.items
      ? Object.keys(data.items).map((key) => {
          const values = data.items[key];
          return new Item({
            id: key,
            ...values,
          });
        })
      : [];
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get items() {
    return [...this.#items];
  }
}
