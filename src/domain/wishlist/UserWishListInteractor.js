import { Logger } from "../../util/logger";
import { UserWishListApi } from "../../api/endpoints/UserWishListApi";
import { UserWishList } from "./UserWishList";

const logger = Logger.tag("UserWishListInteractor");

export class UserWishListInteractor {
  static listenForWishListChanges({ userID, onWishListChanged }) {
    return UserWishListApi.watch(userID, (userID, userlist) => {
      logger.d("Wish list for user: ", userID, userlist);
      const list = UserWishList.fromFirebase(userID, userlist);
      onWishListChanged(list);
    });
  }
}
