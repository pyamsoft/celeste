import { Logger } from "../common/util/logger";
import { UserApi } from "./UserApi";
import { PartialUser } from "./PartialUser";

const logger = Logger.tag("UserRealtime");

export class UserRealtime {
  static watch(userID, onChange) {
    return UserApi.watch(userID, (id, user) => {
      if (id !== userID) {
        return;
      }

      logger.d("User changed: ", id, user);
      onChange(new PartialUser(user));
    });
  }
}
