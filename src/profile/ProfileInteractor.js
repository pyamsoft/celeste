import { UserWishListRealtime } from "../user-wishlist/UserWishListRealtime";
import { WishListRealtime } from "../wishlist/WishListRealtime";
import { UserWishListApi } from "../user-wishlist/UserWishListApi";
import { WishListInteractor } from "../wishlist/WishListInteractor";
import { Logger } from "../common/util/logger";

export class ProfileInteractor {
  static watchUserWishList({ userID, onUserListChange }) {
    return UserWishListRealtime.watch(userID, onUserListChange);
  }

  static watchWishList({ itemID, onItemListChange }) {
    return WishListRealtime.watch(itemID, onItemListChange);
  }

  static async createDefaultUserWishList({ userID }) {
    const existingLists = await UserWishListApi.get(userID);
    Logger.d("Existing user wish lists: ", userID, existingLists);
    if (!existingLists.id || !existingLists.data) {
      await WishListInteractor.createNewWishList({
        userID,
        wishListName: "My Wish List",
        items: [],
      });
    }
  }
}
