import { asID } from "../common/util/id";

export class WishListItem {
  #data;
  #id;
  #createdAt;
  #series;
  #type;
  #count;
  #note;
  #giftedBy;

  constructor(data) {
    this.#data = data;
    this.#id = data?.id || "";
    this.#createdAt = data?.createdAt ? new Date(data.createdAt) : null;
    this.#type = data?.type || "";
    this.#series = data?.series || "";
    this.#count = data?.count || 0;
    this.#note = data?.note || "";
    this.#giftedBy = data?.giftedBy || {};
  }

  get id() {
    return asID(this.#id);
  }

  get createdAt() {
    return this.#createdAt;
  }

  get note() {
    return this.#note.trim();
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

  updateNote(newNote) {
    return new WishListItem({ ...this.#data, note: newNote.trim() });
  }

  updateCount(newCount) {
    return new WishListItem({ ...this.#data, count: newCount });
  }

  replaceGiftedBy(giftedBy) {
    return new WishListItem({ ...this.#data, giftedBy });
  }

  updateGiftedBy(userID, newCount) {
    const giftedBy = this.#giftedBy;
    giftedBy[userID] = newCount;
    return new WishListItem({ ...this.#data, giftedBy });
  }

  clearGiftedBy(userID) {
    const newGiftedBy = {};
    for (const key of Object.keys(this.#giftedBy)) {
      if (key === userID) {
        continue;
      }
      newGiftedBy[key] = this.#giftedBy[key];
    }
    return new WishListItem({ ...this.#data, giftedBy: newGiftedBy });
  }

  static getGiftedByCount(giftedBy) {
    return Object.values(giftedBy).reduce((a, b) => a + b, 0);
  }
}
