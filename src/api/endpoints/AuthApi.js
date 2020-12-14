import { User } from "../../domain/user/User";
import { FireAuth } from "../firebase";

export class AuthApi {
  static watchUser(callback) {
    const unsub = FireAuth.onAuthStateChanged((u) => {
      callback(User.fromFirebaseUser(u));
    });
    return function stopWatchUser() {
      unsub();
    };
  }
}
