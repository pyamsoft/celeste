import { WishListItem } from "./WishListItem";

export class WishList {
  #id;
  #name;
  #items;

  constructor(data) {
    this.#id = data?.id || "";
    this.#name = data?.name || "";
    this.#items = data?.items
      ? Object.keys(data.items)
          .map((type) => {
            const category = data.items[type];
            return category.map((item) => {
              return new WishListItem({
                ...item,
                type,
              });
            });
          })
          .flatMap((i) => i)
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
