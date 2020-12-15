import { Logger } from "../../util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("ItemWishListApi");

function itemlistRef(id) {
  return FireDatabase.ref("/itemlists").child(id);
}

async function get(id) {
  try {
    const snapshot = await itemlistRef(id).once("value");
    const user = snapshot.val();
    return user;
  } catch (e) {
    logger.e(e, "Failed to get itemlist for id: ", id);
    return null;
  }
}

export class ItemWishListApi {
  static async create(wishListID, name, itemIDs) {
    try {
      const payload = {
        name,
        items: {},
      };
      itemIDs.forEach((i) => {
        payload.items[i] = false;
      });
      await itemlistRef(wishListID).set(payload);
      return await get(wishListID);
    } catch (e) {
      logger.e(e, "Failed to create itemlist reference");
      return null;
    }
  }

  static watch(userID, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = itemlistRef(userID);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
