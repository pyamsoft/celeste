import { AuthApi } from "../auth/AuthApi";
import { Logger } from "../common/util/logger";
import { Storage } from "../common/util/storage";

const logger = Logger.tag("LoginInteractor");

const STORAGE_KEY_EMAIL = "store_email";

function promptForEmail() {
  return window.prompt("Email please");
}

async function handleProcessLogin(email, url, prompted) {
  const result = await AuthApi.processLoginEmail(email, url);

  if (result === AuthApi.LINK_NO_LOGIN) {
    logger.d("Not a firebase sign in link");
    return;
  }

  // Remove the stored data
  await Storage.remove(STORAGE_KEY_EMAIL);

  // Re-prompt for email
  if (result === AuthApi.LINK_LOGIN_NO_EMAIL && !prompted) {
    logger.d("Re-prompting for email");
    return await handleProcessLogin(promptForEmail(), url, true);
  }

  if (result === AuthApi.LINK_LOGIN_SUCCESS) {
    logger.d("Link login success!");
  } else if (result === AuthApi.LINK_LOGIN_ERROR) {
    logger.e("Link login failure!");
  } else {
    logger.w("Link login unhandled: ", result);
  }
}

export class LoginApi {
  static async login(email) {
    const result = await AuthApi.sendLoginEmail(email);
    if (result) {
      await Storage.set(STORAGE_KEY_EMAIL, email);
    } else {
      await Storage.remove(STORAGE_KEY_EMAIL);
    }

    return result;
  }

  static async processLogin() {
    const url = window.location.href;
    const storedEmail = await Storage.get(STORAGE_KEY_EMAIL);
    await handleProcessLogin(storedEmail, url, false);
  }
}
