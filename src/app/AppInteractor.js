import { AuthRealtime } from "../auth/AuthRealtime";
import { UserRealtime } from "../user/UserRealtime";
import { LoginApi } from "../login/LoginApi";
import { User } from "../user/User";
import { Logger } from "../common/util/logger";
import { UserApi } from "../user/UserApi";
import { newRandomName } from "../common/util/name";

const logger = Logger.tag("AppInteractor");

export class AppInteractor {
  static watchAuth({ onAuthChanged }) {
    return AuthRealtime.watch(onAuthChanged);
  }

  static watchUser({ authUID, onUserChanged }) {
    return UserRealtime.watch(authUID, onUserChanged);
  }

  static async startSessionForUser({ auth, user }) {
    if (!user.exists) {
      const name = newRandomName();
      logger.d("User does not exist, create it in the DB", auth.id, name);
      user = await UserApi.create(auth.id, name);
    }

    return new User({
      id: auth.id,
      email: auth.email,
      createdAt: auth.createdAt,
      lastLogin: auth.lastLogin,
      displayName: user.displayName,
    });
  }

  static startSession() {
    return LoginApi.processLogin();
  }
}
