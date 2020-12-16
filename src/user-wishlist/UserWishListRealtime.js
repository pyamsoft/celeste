import { UserWishListApi } from "./UserWishListApi";
import { UserWishList } from "./UserWishList";

export class UserWishListRealtime {
  static watch(id, onChange) {
    return UserWishListApi.watch(id, (userID, userlist) => {
      if (userID !== id) {
        return;
      }
      const list = new UserWishList({
        id: userID,
        wishlists: userlist,
      });
      onChange(list);
    });
  }
}
