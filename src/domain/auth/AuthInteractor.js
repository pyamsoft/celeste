import { AuthApi } from "../../api/endpoints/AuthApi";
import { UserApi } from "../../api/endpoints/UserApi";
import { stopListening } from "../../util/listener";
import { Logger } from "../../util/logger";
import { User } from "../user/User";
import { Storage } from "../../util/storage";
import _ from "lodash";

const logger = Logger.tag("AuthInteractor");

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

function isUserInitialized(user) {
  return user.displayName && user.shareLink;
}

async function resolveUser(auth, user) {
  const resolved = User.fromFirebase(auth, user);
  if (isUserInitialized(resolved)) {
    return resolved;
  } else {
    logger.d("Create new user: ", resolved.id);
    const newUser = await UserApi.create(resolved.id);
    if (newUser) {
      logger.d("New user created: ", newUser);
      return User.fromFirebase(auth, newUser);
    } else {
      logger.e("User could not be created");
      return User.NOT_LOGGED_IN;
    }
  }
}

export class AuthInteractor {
  static listenForAuthChanges({ onAuthChanged }) {
    let latestAuth = User.UNDEFINED;
    let userWatcher = null;

    const resolverDebouncer = _.debounce(
      async (user) => {
        return await resolveUser(latestAuth, user);
      },
      5000,
      {
        leading: true,
        trailing: true,
      }
    );

    const authWatcher = AuthApi.watch(async (auth) => {
      logger.d("Auth changed: ", auth);
      latestAuth = auth;

      if (!auth) {
        logger.d("User has no auth");
        if (stopListening(userWatcher)) {
          userWatcher = null;
        }
        onAuthChanged(User.NOT_LOGGED_IN);
        return;
      }

      const userID = auth.uid;
      if (!userWatcher) {
        logger.d("Begin watching user");
        userWatcher = UserApi.watch(userID, async (key, user) => {
          logger.d("User changed: ", key, user);
          const resolved = await resolverDebouncer(user);
          onAuthChanged(resolved);

          if (!resolved) {
            logger.w("User is null, stop watching user and force re-auth");
            resolverDebouncer.cancel();
            if (stopListening(userWatcher)) {
              userWatcher = null;
            }
          }
        });
      }
    });

    return function stopWatching() {
      stopListening(authWatcher);
      stopListening(userWatcher);
      resolverDebouncer.cancel();
    };
  }

  static async login({ email }) {
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
