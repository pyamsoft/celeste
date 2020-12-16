import { Logger } from "../common/util/logger";
import { UserWishListApi } from "../user-wishlist/UserWishListApi";
import { WishListApi } from "./WishListApi";
import { WishList } from "./WishList";

const logger = Logger.tag("WishListInteractor");

export class WishListInteractor {
  static async createNewWishList({ userID, wishListName, items }) {
    if (!wishListName) {
      throw new Error("Must provide wish list name");
    }

    if (!items) {
      throw new Error("Must provide a list of items (can be empty)");
    }

    const trimmed = wishListName.trim();
    if (!trimmed) {
      throw new Error("Must provide wish list name");
    }

    const userList = await UserWishListApi.create(userID);
    const validItems = items.filter((i) => i.count > 0);

    logger.d("Create new wishlist: ", userID, trimmed, validItems);
    const { id, data } = await WishListApi.create(
      userList,
      wishListName,
      validItems
    );

    // No data, we failed to create
    if (!data) {
      throw new Error("Failed to create new wishlist: " + id);
    }

    return new WishList({
      id,
      name: data.name,
      items: data.items,
    });
  }

  static async get({ itemID }) {
    const { id, data } = await WishListApi.get(itemID);

    // No data, does not exist
    if (!data) {
      throw new Error("Failed to get wishlist: " + itemID);
    }

    return new WishList({
      id,
      name: data.name,
      items: data.items,
    });
  }
}
