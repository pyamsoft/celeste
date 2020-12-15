import { AuthRealtime } from "../auth/AuthRealtime";
import { UserRealtime } from "../user/UserRealtime";
import { LoginApi } from "../login/LoginApi";
import { User } from "../user/User";

export class AppInteractor {
  static watchAuth({ onAuthChanged }) {
    return AuthRealtime.watch(onAuthChanged);
  }

  static watchUser({ authUID, onUserChanged }) {
    return UserRealtime.watch(authUID, onUserChanged);
  }

  static async startSessionForUser({ auth, user }) {
    return new User({
      id: auth.id,
      email: auth.email,
      createdAt: auth.createdAt,
      lastLoginAt: auth.lastLogin,
      displayName: user.displayName,
    });
  }

  static startSession() {
    return LoginApi.processLogin();
  }
}
