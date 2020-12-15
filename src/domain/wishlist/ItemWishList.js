import { Item } from "../item/Item";

export class ItemWishList {
  constructor(id, data) {
    this.id = id || null;
    this.name = data?.name || null;
    this.items = data?.items
      ? Object.keys(data.items).map((key) => {
          const count = data.items[key];
          return new Item(key, count);
        })
      : [];
  }

  static fromFirebase(id, data) {
    return new ItemWishList(id, data);
  }
}