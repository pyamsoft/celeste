import { FireDatabase } from "../firebase";
import { Logger } from "../../util/logger";
import { newRandomID } from "../../util/id";

const logger = Logger.tag("UserApi");

function userRef(id) {
  return FireDatabase.ref("/users").child(id);
}

async function get(id) {
  try {
    const snapshot = await userRef(id).once("value");
    const user = snapshot.val();
    return user;
  } catch (e) {
    logger.e(e, "Failed to get user for id: ", id);
    return null;
  }
}

export class UserApi {
  static async create(id) {
    try {
      await userRef(id).set({
        displayName: newRandomID(),
        shareLink: newRandomID(),
      });
      return await get(id);
    } catch (e) {
      logger.e(e, "Failed to create user");
      return null;
    }
  }

  static async update(user) {
    try {
      await userRef(user.id).set({
        displayName: user.displayName,
        shareLink: user.shareLink,
      });
      return true;
    } catch (e) {
      logger.e(e, "Failed to update user");
      return false;
    }
  }

  static watch(id, callback) {
    const listener = (snapshot) => callback(snapshot.key, snapshot.val());

    const ref = userRef(id);
    ref.on("value", listener);
    return function stopWatching() {
      ref.off("value", listener);
    };
  }
}
