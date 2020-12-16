import { Logger } from "../common/util/logger";
import { FireDatabase, FirePaths } from "../firebase";

const logger = Logger.tag("WishListApi");

function wishListRef(id) {
  return FireDatabase.ref(FirePaths.WISHLISTS).child(id);
}

function itemsRef(wishListID, item) {
  return wishListRef(wishListID).child(item.type).child(item.id);
}

function groupItemsByType(items) {
  const groups = {};
  for (const item of items) {
    const type = item.type;
    if (!type) {
      continue;
    }

    if (!groups[type]) {
      groups[type] = {};
    }

    if (item.count > 0) {
      const payload = {
        count: item.count,
        giftedBy: item.giftedBy,
        createdAt: item.createdAt ? item.createdAt.toUTCString() : null,
        note: item.note ? item.note : null,
      };

      if (item.series) {
        if (!groups[type][item.series]) {
          groups[type][item.series] = {};
        }
        groups[type][item.series][item.id] = payload;
      } else {
        groups[type][item.id] = payload;
      }
    } else {
      if (item.series) {
        if (!groups[type][item.series]) {
          groups[type][item.series] = {};
        }

        groups[type][item.series][item.id] = null;
      } else {
        groups[type][item.id] = null;
      }
    }
  }

  return groups;
}

function createWishListID(userID) {
  return FireDatabase.ref(FirePaths.USER_WISHLISTS).child(userID).push().key;
}

export class WishListApi {
  static async create(userID, name, items) {
    try {
      const now = new Date().toUTCString();
      const wishListID = createWishListID(userID);
      const payload = {
        name,
        owner: userID,
        createdAt: now,
        ...groupItemsByType(items),
      };
      const updates = {};
      updates[`${FirePaths.USER_WISHLISTS}/${userID}/${wishListID}`] = now;
      updates[`${FirePaths.WISHLISTS}/${wishListID}`] = payload;
      await FireDatabase.ref().update(updates);
      return await WishListApi.get(wishListID);
    } catch (e) {
      logger.e(e, "Failed to create itemlist reference");
      throw e;
    }
  }

  static async ownerUpdate(wishListID, name, items) {
    try {
      const grouped = groupItemsByType(items);
      await wishListRef(wishListID).transaction((payload) => {
        if (payload) {
          payload.name = name;

          // Do this to make sure we only touch the keys of items we know about
          // we only touch the count and note of items
          // we do not touch the giftedBy array since that is not guaranteed to be in sync
          for (const group of Object.keys(grouped)) {
            const groupData = grouped[group];
            for (const series of Object.keys(groupData)) {
              const seriesData = groupData[series];
              for (const id of Object.keys(seriesData)) {
                const data = seriesData[id];
                if (!payload[group]) {
                  payload[group] = {};
                }

                let target = payload[group];
                if (!target[series]) {
                  target[series] = {};
                }

                target = target[series];
                if (!target[id]) {
                  target[id] = {};
                }

                if (data) {
                  const { count, note, createdAt } = data;
                  if (count > 0) {
                    target[id].count = count;
                    target[id].note = note;

                    if (!target[id].createdAt) {
                      target[id].createdAt = (createdAt
                        ? createdAt
                        : new Date()
                      ).toUTCString();
                    }
                  } else {
                    target[id] = null;
                  }
                } else {
                  target[id] = null;
                }
              }
            }
          }
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
