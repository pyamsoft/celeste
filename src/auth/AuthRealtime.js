import { AuthApi } from "./AuthApi";
import { Auth } from "./Auth";

export class AuthRealtime {
  static watch(onChange) {
    return AuthApi.watch((auth) => {
      onChange(new Auth(auth));
    });
  }
}
