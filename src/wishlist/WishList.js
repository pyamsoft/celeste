import { WishListItem } from "./WishListItem";
import { asID } from "../common/util/id";

export class WishList {
  #id;
  #name;
  #createdAt;
  #items;

  constructor(data) {
    this.#id = data?.id || "";
    this.#name = data?.name || "";
    this.#createdAt = data?.createdAt ? new Date(data.createdAt) : null;
    this.#items = data?.items
      ? Object.keys(data.items)
          .map((type) => {
            const category = data.items[type];
            return Object.keys(category).map((itemID) => {
              const itemData = category[itemID];
              return new WishListItem({
                ...itemData,
                id: itemID,
                type,
              });
            });
          })
          .flatMap((i) => i)
      : [];
  }

  get id() {
    return asID(this.#id);
  }

  get createdAt() {
    return this.#createdAt;
  }

  get name() {
    return this.#name;
  }

  get items() {
    return [...this.#items];
  }
}
