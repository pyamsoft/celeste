import { AuthApi } from "../../api/endpoints/AuthApi";

export class AuthInteractor {
  static listenForAuthChanges(callback) {
    return AuthApi.watchUser(callback);
  }
}
