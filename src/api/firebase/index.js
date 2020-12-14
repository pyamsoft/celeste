import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Logger } from "../../util/logger";
import { IS_DEBUG_MODE } from "../../util/constants";

const logger = Logger.tag("Firebase");

const config = {};

try {
  logger.d("Initialize firebase with config: ", config);
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
  firebase.initializeApp(config);
} catch (e) {
  logger.e(e, "Error initializing Firebase");
}

export const FireAuth = firebase.auth();
export const FireDatabase = firebase.database();
