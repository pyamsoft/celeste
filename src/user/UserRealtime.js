import { UserApi } from "./UserApi";
import { PartialUser } from "./PartialUser";

export class UserRealtime {
  static watch(userID, onChange) {
    return UserApi.watch(userID, (id, user) => {
      if (id !== userID) {
        return;
      }

      onChange(new PartialUser(user));
    });
  }
}
