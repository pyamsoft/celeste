import { UserWishListRealtime } from "../user-wishlist/UserWishListRealtime";
import { WishListRealtime } from "../wishlist/WishListRealtime";

export class ProfileInteractor {
  static watchUserList({ userID, onUserListChange }) {
    return UserWishListRealtime.watch(userID, onUserListChange);
  }

  static watchItemList({ itemID, onItemListChange }) {
    return WishListRealtime.watch(itemID, onItemListChange);
  }
}
