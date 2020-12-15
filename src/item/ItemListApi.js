import { Logger } from "../common/util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("ItemListApi");

function itemlistRef(id) {
  return FireDatabase.ref("/itemlists").child(id);
}

async function mutateGiftedBy(userID, wishListID, itemID, adjust) {
  const ref = itemlistRef(wishListID).child(itemID);
  await ref.transaction((payload) => {
    if (payload) {
      if (payload.giftedBy) {
        const giftedCount = payload.giftedBy[userID] || 0;
        if (giftedCount > 0 && giftedCount < payload.count) {
          payload.giftedBy[userID] = adjust(giftedCount);
        }
      }
    }
    return payload;
  });
}

export class ItemListApi {
  static async create(wishListID, name, items) {
    try {
      const payload = {
        name,
        items: {},
      };
      items.forEach((i) => {
        payload.items[i.id] = {
          count: i.count,
          giftedBy: i.giftedBy,
        };
      });
      await itemlistRef(wishListID).set(payload);
      return await ItemListApi.get(wishListID);
    } catch (e) {
      logger.e(e, "Failed to create itemlist reference");
      return {};
    }
  }

  static async get(wishListID) {
    try {
      const snapshot = await itemlistRef(wishListID).once("value");
      return {
        id: snapshot.key,
        data: snapshot.val(),
      };
    } catch (e) {
      logger.e(e, "Failed to get itemlist for id: ", wishListID);
      return {};
    }
  }

  static async updateCount(wishListID, itemID, count) {
    const ref = itemlistRef(wishListID).child(itemID);
    await ref.transaction((payload) => {
      if (payload) {
        if (payload.count > 0) {
          payload.count = count;
        }
      }
      return payload;
    });
  }

  static async revokeGift(userID, wishListID, itemID) {
    return await mutateGiftedBy(
      userID,
      wishListID,
      itemID,
      (count) => count - 1
    );
  }

  static async giveGift(userID, wishListID, itemID) {
    return await mutateGiftedBy(
      userID,
      wishListID,
      itemID,
      (count) => count + 1
    );
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
