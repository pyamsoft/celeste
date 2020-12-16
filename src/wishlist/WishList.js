import { WishListItem } from "./WishListItem";
import { asID } from "../common/util/id";
import { ACNHFish } from "../acnh/ACNHFish";
import { ACNHBug } from "../acnh/ACNHBug";
import { ACNHFossil } from "../acnh/ACNHFossil";
import { ACNHSea } from "../acnh/ACNHSea";
import { ACNHHouseware } from "../acnh/ACNHHouseware";
import { ACNHWallmount } from "../acnh/ACNHWallmount";

function parseItems(items, type) {
  if (!items) {
    return [];
  }

  const category = items[type];
  return category
    ? Object.keys(category)
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
        .flatMap((i) => i)
    : [];
}

export class WishList {
  #id;
  #name;
  #createdAt;
  #items;

  constructor(data) {
    this.#id = data?.id || "";
    this.#name = data?.name || "";
    this.#createdAt = data?.createdAt ? new Date(data.createdAt) : null;

    this.#items = [
      ...parseItems(data, ACNHFish.TYPE),
      ...parseItems(data, ACNHBug.TYPE),
      ...parseItems(data, ACNHFossil.TYPE),
      ...parseItems(data, ACNHSea.TYPE),
      ...parseItems(data, ACNHHouseware.TYPE),
      ...parseItems(data, ACNHWallmount.TYPE),
    ];
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
