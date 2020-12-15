import { UserWishListApi } from "../../api/endpoints/UserWishListApi";
import { UserWishList } from "./UserWishList";

export class UserWishListInteractor {
  static watch({ userID, onWishListChanged }) {
    return UserWishListApi.watch(userID, (userID, userlist) => {
      const list = UserWishList.fromFirebase(userID, userlist);
      onWishListChanged(list);
    });
  }
}
