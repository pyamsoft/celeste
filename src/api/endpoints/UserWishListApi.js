import { Logger } from "../../util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("UserWishListApi");

function userlistRef(id) {
  return FireDatabase.ref("/userlists").child(id);
}

async function get(id) {
  try {
    const snapshot = await userlistRef(id).once("value");
    return snapshot.val();
  } catch (e) {
    logger.e(e, "Failed to get userlist for id: ", id);
    return null;
  }
}

export class UserWishListApi {
  static async create(userID, wishListID) {
    try {
      const ref = userlistRef(userID);
      await ref.child(wishListID).set(true);
      return await get(userID);
    } catch (e) {
      logger.e(e, "Failed to create userlist reference");
      return null;
    }
  }

  static async update(userlist) {
    try {
      const payload = {};
      userlist.wishlists.forEach((w) => {
        payload[w] = true;
      });
      await userlistRef(userlist.userID).set(payload);
    } catch (e) {
      logger.e(e, "Failed to update userlist reference");
      return false;
    }
  }

  static watch(userID, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = userlistRef(userID);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
