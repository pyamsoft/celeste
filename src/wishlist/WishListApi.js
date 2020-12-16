import { Logger } from "../common/util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("WishListApi");

function itemlistRef(id) {
  return FireDatabase.ref("/wishlists").child(id);
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

function groupItemsByType(items) {
  const groups = {};
  for (const item of items) {
    const type = item.type;
    if (!type) {
      continue;
    }

    const networkItem = {
      id: item.id,
      count: item.count,
      giftedBy: item.giftedBy,
    };

    if (!groups[type]) {
      groups[type] = [networkItem];
    } else {
      groups[type].push(networkItem);
    }
  }

  return groups;
}

export class WishListApi {
  static async create(wishListID, name, items) {
    try {
      const payload = {
        name,
        items: groupItemsByType(items),
      };
      await itemlistRef(wishListID).set(payload);
      return await WishListApi.get(wishListID);
    } catch (e) {
      logger.e(e, "Failed to create itemlist reference");
      throw e;
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
      throw e;
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
