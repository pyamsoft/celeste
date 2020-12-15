import { Logger } from "../../util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("ItemApi");

function itemRef(id) {
  return FireDatabase.ref("/items").child(id);
}

async function get(id) {
  try {
    const snapshot = await itemRef(id).once("value");
    const user = snapshot.val();
    return user;
  } catch (e) {
    logger.e(e, "Failed to get item for id: ", id);
    return null;
  }
}

export class ItemApi {
  static async create(id, type) {
    try {
      await itemRef(id).set({ type });
      return await get(id);
    } catch (e) {
      logger.e(e, "Failed to create item reference");
      return null;
    }
  }

  static async update(item) {
    try {
      await itemRef(item.id).set({ type: item.type });
    } catch (e) {
      logger.e(e, "Failed to update item reference");
      return false;
    }
  }

  static watch(id, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = itemRef(id);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
