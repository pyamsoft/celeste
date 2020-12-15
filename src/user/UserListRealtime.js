import { WishListApi } from "../wishlist/WishListApi";
import { UserList } from "./UserList";

export class UserListRealtime {
  static watch(id, onChange) {
    return WishListApi.watch(id, (userID, userlist) => {
      if (userID !== id) {
        return;
      }
      const list = new UserList({
        id: userID,
        wishlists: userlist,
      });
      onChange(list);
    });
  }
}
