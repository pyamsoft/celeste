import { asID } from "../common/util/id";

export class WishListItem {
  #data;
  #id;
  #createdAt;
  #series;
  #type;
  #count;
  #giftedBy;

  constructor(data) {
    this.#data = data;
    this.#id = data?.id || "";
    this.#createdAt = data?.createdAt ? new Date(data.createdAt) : null;
    this.#type = data?.type || "";
    this.#series = data?.series || "";
    this.#count = data?.count || 0;
    this.#giftedBy = data?.giftedBy || {};
  }

  get id() {
    return asID(this.#id);
  }

  get createdAt() {
    return this.#createdAt;
  }

  get type() {
    return this.#type;
  }

  get count() {
    return this.#count;
  }

  get giftedBy() {
    return { ...this.#giftedBy };
  }

  get series() {
    return this.#series;
  }

  updateCount(newCount) {
    const newItem = new WishListItem(this.#data);
    newItem.#count = newCount;
    return newItem;
  }

  updateGiftedBy(user, newCount) {
    const newItem = new WishListItem(this.#data);
    newItem.#giftedBy[user.id] = newCount;
    return newItem;
  }
}
