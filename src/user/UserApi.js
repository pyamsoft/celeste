import { FireDatabase } from "../firebase";
import { Logger } from "../common/util/logger";
import { newRandomID } from "../common/util/id";

const logger = Logger.tag("UserApi");

function userRef(id) {
  return FireDatabase.ref("/users").child(id);
}

async function get(id) {
  try {
    const snapshot = await userRef(id).once("value");
    return {
      id: snapshot.key,
      data: snapshot.val(),
    };
  } catch (e) {
    logger.e(e, "Failed to get user for id: ", id);
    return {};
  }
}

export class UserApi {
  static async create(id) {
    try {
      await userRef(id).set({ displayName: newRandomID() });
      return await get(id);
    } catch (e) {
      logger.e(e, "Failed to create user");
      return {};
    }
  }

  static async update(user) {
    try {
      await userRef(user.id).set({ displayName: user.displayName });
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