import { asID } from "../common/util/id";

export class WishListItem {
  #id;
  #createdAt;
  #series;
  #type;
  #count;
  #note;
  #giftedBy;

  constructor(data) {
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

  static getGiftedByCount(giftedBy) {
    return Object.values(giftedBy).reduce((a, b) => a + b, 0);
  }

  updateNote(newNote) {
    this.#note = newNote;
    return this;
  }

  updateCount(newCount) {
    this.#count = newCount;
    return this;
  }

  replaceGiftedBy(giftedBy) {
    this.#giftedBy = giftedBy;
    return this;
  }

  updateGiftedBy(userID, newCount) {
    this.#giftedBy[userID] = newCount;
    return this;
  }

  clearGiftedBy(userID) {
    this.#giftedBy[userID] = 0;
    return this;
  }
}
