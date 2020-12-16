import { Logger } from "../common/util/logger";
import { FireDatabase, FirePaths } from "../firebase";

const logger = Logger.tag("WishListApi");

function wishListRef(id) {
  return FireDatabase.ref(FirePaths.WISHLISTS).child(id);
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

function editItems(payload, items, onEdit) {
  const grouped = groupItemsByType(items);
  for (const group of Object.keys(grouped)) {
    const groupData = grouped[group];
    for (const series of Object.keys(groupData)) {
      const seriesData = groupData[series];
      for (const id of Object.keys(seriesData)) {
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

        const data = seriesData[id];
        if (data) {
          target[id] = onEdit(target[id], data);
        } else {
          target[id] = null;
        }
      }
    }
  }

  return payload;
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
    } catch (e) {
      logger.e(e, "Failed to create itemlist reference");
      throw e;
    }
  }

  static async ownerUpdate(wishListID, name, items) {
    try {
      await wishListRef(wishListID).transaction((payload) => {
        if (payload) {
          payload.name = name;

          // Do this to make sure we only touch the keys of items we know about
          // we only touch the count and note of items
          // we do not touch the giftedBy array since that is not guaranteed to be in sync
          editItems(payload, items, (target, data) => {
            const { count, note, createdAt } = data;

            // If zero count, delete the item
            if (count <= 0) {
              return null;
            }

            target.count = count;
            target.note = note;

            // Create the time if it does not exist
            if (!target.createdAt) {
              target.createdAt = (createdAt
                ? new Date(createdAt)
                : new Date()
              ).toUTCString();
            }

            return target;
          });
        }
        return payload;
      });
    } catch (e) {
      logger.e(e, "Failed to update itemlist reference");
      throw e;
    }
  }

  static async gifterUpdate(userID, wishListID, items) {
    try {
      await wishListRef(wishListID).transaction((payload) => {
        if (payload) {
          // Do this to make sure we only touch the keys of items we know about
          // we only touch the giftedBy field for our user
          // we do not touch the anything else since it is not guaranteed to be in sync
          editItems(payload, items, (target, data) => {
            const { giftedBy, createdAt } = data;

            // Create the time if it does not exist
            if (!target.createdAt) {
              target.createdAt = (createdAt
                ? new Date(createdAt)
                : new Date()
              ).toUTCString();
            }

            // If we changed a gift
            if (giftedBy) {
              const ourGiftCount = giftedBy[userID];

              // Make sure it exists
              if (!target.giftedBy) {
                target.giftedBy = {};
              }

              if (ourGiftCount > 0) {
                target.giftedBy[userID] = ourGiftCount;
              } else {
                target.giftedBy[userID] = null;
              }
            }

            return target;
          });
        }

        return payload;
      });
    } catch (e) {
      logger.e(e, "Failed to update wishlist reference");
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

  static watch(wishListID, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = wishListRef(wishListID);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
