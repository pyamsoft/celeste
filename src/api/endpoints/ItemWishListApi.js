import { Logger } from "../../util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("ItemWishListApi");

function itemlistRef(id) {
  return FireDatabase.ref("/itemlists").child(id);
}

async function get(id) {
  try {
    const snapshot = await itemlistRef(id).once("value");
    return {
      key: snapshot.key,
      value: snapshot.val(),
    };
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

  static async markOwned(wishListID, itemID, owned) {
    await itemlistRef(wishListID).child(itemID).set(owned);
  }

  static watch(wishListID, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = itemlistRef(wishListID);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
