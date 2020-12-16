import { WishListItem } from "./WishListItem";
import { asID } from "../common/util/id";
import { WishListCategories } from "./WishListCategories";

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
            if (WishListCategories.hasSeries(type)) {
              return Object.keys(category)
                .map((seriesName) => {
                  const series = category[seriesName];
                  return Object.keys(series).map((itemID) => {
                    const itemData = series[itemID];
                    return new WishListItem({
                      ...itemData,
                      id: itemID,
                      series: seriesName,
                      type,
                    });
                  });
                })
                .flatMap((i) => i);
            } else {
              return Object.keys(category).map((itemID) => {
                const itemData = category[itemID];
                return new WishListItem({
                  ...itemData,
                  id: itemID,
                  type,
                });
              });
            }
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
