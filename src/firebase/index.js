import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Logger } from "../common/util/logger";
import { IS_DEBUG_MODE } from "../common/util/constants";
import { firebaseConfig } from "./config";

const logger = Logger.tag("Firebase");

try {
  logger.d("Initialize firebase with config: ", firebaseConfig);
  firebase.setLogLevel(IS_DEBUG_MODE ? "debug" : "silent");
  firebase.onLog(({ level, message, args }) => {
    switch (level) {
      case "error":
        logger.e(message, ...args);
        break;
      case "warn":
        logger.w(message, ...args);
        break;
      default:
        logger.d(message, ...args);
    }
  });
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  logger.e(e, "Error initializing Firebase");
}

export const FireAuth = firebase.auth();
export const FireDatabase = firebase.database();
export const FirePaths = {
  USERS: "/users",
  USER_WISHLISTS: "/user-wishlists",
  WISHLISTS: "/wishlists",
};
