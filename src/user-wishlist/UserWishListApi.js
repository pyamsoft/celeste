import { Logger } from "../common/util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("UserWishListApi");

function userlistRef(id) {
  return FireDatabase.ref("/user-wishlists").child(id);
}

export class UserWishListApi {
  static async create(userID) {
    try {
      const ref = userlistRef(userID);
      const newRef = await ref.push(true);
      return newRef.key;
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
      return true;
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
