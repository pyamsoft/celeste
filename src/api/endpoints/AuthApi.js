import { Logger } from "../../util/logger";
import { FireAuth } from "../firebase";
import { APP_URL } from "../../util/constants";

const logger = Logger.tag("AuthApi");

export class AuthApi {
  static LINK_NO_LOGIN = 0;
  static LINK_LOGIN_NO_EMAIL = 1;
  static LINK_LOGIN_SUCCESS = 2;
  static LINK_LOGIN_ERROR = 3;

  static watch(callback) {
    const unsub = FireAuth.onIdTokenChanged((u) => callback(u));
    return function stopWatchUser() {
      unsub();
    };
  }

  static async processLoginEmail(email, url) {
    logger.d("Check url: ", url);
    if (!FireAuth.isSignInWithEmailLink(url)) {
      return AuthApi.LINK_NO_LOGIN;
    }

    if (!email) {
      return AuthApi.LINK_LOGIN_NO_EMAIL;
    }

    try {
      await FireAuth.signInWithEmailLink(email, url);
      return AuthApi.LINK_LOGIN_SUCCESS;
    } catch (e) {
      logger.e(e, "Failed to process login email link", url);
      return AuthApi.LINK_LOGIN_ERROR;
    }
  }

  static async sendLoginEmail(email) {
    try {
      const config = {
        handleCodeInApp: true,
        url: APP_URL,
      };
      await FireAuth.sendSignInLinkToEmail(email, config);
      return true;
    } catch (e) {
      logger.e(e, "Failed to send sign in link");
      return false;
    }
  }
}
