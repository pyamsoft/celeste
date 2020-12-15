export class Item {
  static INVALID_COUNT = -1;

  constructor(id, count) {
    this.id = id || null;
    this.count = count ?? Item.INVALID_COUNT;
  }

  static create(id, count) {
    return new Item(id, count);
  }
}
