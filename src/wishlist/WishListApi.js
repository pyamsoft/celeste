import { Logger } from "../common/util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("WishListApi");

function wishListRef(id) {
  return FireDatabase.ref("/wishlists").child(id);
}

function itemsRef(wishListID, item) {
  return wishListRef(wishListID).child("items").child(item.type).child(item.id);
}

function groupItemsByType(items) {
  const groups = {};
  for (const item of items) {
    const type = item.type;
    if (!type) {
      continue;
    }

    const key = item.id;

    if (!groups[type]) {
      groups[type] = {};
    }

    if (item.count > 0) {
      groups[type][key] = {
        count: item.count,
        giftedBy: item.giftedBy,
      };
    } else {
      groups[type][key] = null;
    }
  }

  return groups;
}

export class WishListApi {
  static async create(wishListID, userID, name, items) {
    try {
      const payload = {
        name,
        owner: userID,
        items: groupItemsByType(items),
        createdAt: new Date().toUTCString(),
      };
      await wishListRef(wishListID).set(payload);
      return await WishListApi.get(wishListID);
    } catch (e) {
      logger.e(e, "Failed to create itemlist reference");
      throw e;
    }
  }

  static async update(wishListID, name, items) {
    try {
      await wishListRef(wishListID).transaction((payload) => {
        if (payload) {
          payload.name = name;
          payload.items = groupItemsByType(items);
        }
        return payload;
      });
      return await WishListApi.get(wishListID);
    } catch (e) {
      logger.e(e, "Failed to update itemlist reference");
      throw e;
    }
  }

  static async get(wishListID) {
    try {
      const snapshot = await wishListRef(wishListID).once("value");
      return {
        id: snapshot.key,
        data: snapshot.val(),
      };
    } catch (e) {
      logger.e(e, "Failed to get itemlist for id: ", wishListID);
      throw e;
    }
  }

  static async updateCount(wishListID, item) {
    const ref = itemsRef(wishListID, item);
    await ref.transaction((payload) => {
      logger.d("Attempt to update item count: ", item, payload);
      if (payload) {
        // If the requested count is now less than 0, this item is no longer requested.
        if (item.count <= 0) {
          return null;
        }

        // Update the requested count
        payload.count = item.count;
      }
      return payload;
    });
  }

  static async updateGiftedBy(wishListID, item) {
    const ref = itemsRef(wishListID, item);
    return await ref.transaction((payload) => {
      logger.d("Attempt to update item giftedBy: ", item, payload);
      // The payload must not be null (ref must exist)
      // The item.giftedBy field must exist, you did gift someone right?
      if (payload) {
        // If the giftedBy field has been removed, delete the giftedBy part from the server.
        if (!item.giftedBy || Object.keys(item.giftedBy).length <= 0) {
          payload.giftedBy = null;
          return payload;
        }

        // Init the giftedBy object if it does not exist since Firebase will ignore null objects in DB
        if (!payload.giftedBy) {
          payload.giftedBy = {};
        }

        // Write the gift counts to the giftedBy object, ignore if the user is 0
        for (const userKey of Object.keys(item.giftedBy)) {
          const userGiftCount = item.giftedBy[userKey];
          if (userGiftCount > 0) {
            payload.giftedBy[userKey] = userGiftCount;
          } else {
            payload.giftedBy[userKey] = null;
          }
        }
      }
      return payload;
    });
  }

  static watch(wishListID, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = wishListRef(wishListID);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
