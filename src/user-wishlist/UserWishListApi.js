import { Logger } from "../common/util/logger";
import { FireDatabase } from "../firebase";

const logger = Logger.tag("UserWishListApi");

function userlistRef(id) {
  return FireDatabase.ref("/user-wishlists").child(id);
}

export class UserWishListApi {
  static async get(userID) {
    try {
      const ref = userlistRef(userID);
      const snapshot = await ref.once("value");
      return {
        id: snapshot.key,
        data: snapshot.val(),
      };
    } catch (e) {
      logger.e(e, "Failed to get userlist reference");
      throw e;
    }
  }

  static async create(userID) {
    try {
      const ref = userlistRef(userID);
      const newRef = await ref.push(new Date().toUTCString());
      return newRef.key;
    } catch (e) {
      logger.e(e, "Failed to create userlist reference");
      throw e;
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
