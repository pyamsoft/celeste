import { Logger } from "../common/util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("ItemApi");

function itemRef(id) {
  return FireDatabase.ref("/items").child(id);
}

export class ItemApi {
  static async create(acID, type) {
    try {
      const newRef = await FireDatabase.ref("/items").push({
        id: acID,
        type,
      });
      return newRef.key;
    } catch (e) {
      logger.e(e, "Failed to create item reference");
      return null;
    }
  }

  static async update(item) {
    try {
      await itemRef(item.id).set({
        id: item.id,
        type: item.type,
      });
    } catch (e) {
      logger.e(e, "Failed to update item reference");
      return false;
    }
  }
}
