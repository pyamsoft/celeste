export class Item {
  #data;
  #id;
  #type;
  #count;
  #giftedBy;

  constructor(data) {
    this.#data = data;
    this.#id = data?.id || "";
    this.#type = data?.type || "";
    this.#count = data?.count || 0;
    this.#giftedBy = data?.giftedBy ? Object.keys(data.giftedBy) : [] || [];
  }

  updateCount(newCount) {
    const newItem = new Item(this.#data);
    newItem.#count = newCount;
    return newItem;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return this.#type;
  }

  get count() {
    return this.#count;
  }

  get giftedBy() {
    return [...this.#giftedBy];
  }
}
