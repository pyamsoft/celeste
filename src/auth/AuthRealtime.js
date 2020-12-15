import { AuthApi } from "./AuthApi";
import { Logger } from "../common/util/logger";
import { Auth } from "./Auth";

const logger = Logger.tag("AuthRealtime");

export class AuthRealtime {
  static watch(onChange) {
    return AuthApi.watch((auth) => {
      logger.d("Auth changed: ", auth);
      onChange(new Auth(auth));
    });
  }
}
