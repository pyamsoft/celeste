import { ACItem } from "./ACItem";

export class Item extends ACItem {
  constructor(id, acnhData, dbData) {
    super(acnhData);
    this.id = id || null;
    this.owned = dbData.owned || false;
  }

  static create(dbID, acnhData, dbData) {
    return new Item(dbID, acnhData, dbData);
  }
}
