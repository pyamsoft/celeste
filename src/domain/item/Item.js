export class Item {
  constructor(key, data) {
    this.id = key || null;
    this.type = data.type || null;
  }

  static fromFirebase(itemID, val) {
    return new Item(key, val);
  }
}
