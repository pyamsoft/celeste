import { UserWishListRealtime } from "../user-wishlist/UserWishListRealtime";
import { WishListRealtime } from "../wishlist/WishListRealtime";
import { UserWishListApi } from "../user-wishlist/UserWishListApi";
import { WishListInteractor } from "../wishlist/WishListInteractor";

export class ProfileInteractor {
  static watchUserWishList({ userID, onUserListChange }) {
    return UserWishListRealtime.watch(userID, onUserListChange);
  }

  static watchWishList({ itemID, onInsertOrUpdate, onDelete }) {
    return WishListRealtime.watch(itemID, onInsertOrUpdate, onDelete);
  }

  static async createDefaultUserWishList({ userID }) {
    const existingLists = await UserWishListApi.get(userID);
    if (!existingLists.id || !existingLists.data) {
      await WishListInteractor.createNewWishList({
        userID,
        wishListName: "My Wish List",
        items: [],
      });
    }
  }
}
