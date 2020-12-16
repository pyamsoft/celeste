import { Logger } from "../common/util/logger";
import { UserWishListApi } from "../user-wishlist/UserWishListApi";
import { WishListApi } from "./WishListApi";
import { WishList } from "./WishList";

const logger = Logger.tag("WishListInteractor");

function validate(userID, wishListName, items) {
  if (!userID) {
    throw new Error("Must provide wish list owner ID");
  }
  if (!wishListName) {
    throw new Error("Must provide wish list name");
  }

  if (!items) {
    throw new Error("Must provide a list of items (can be empty)");
  }
}

export class WishListInteractor {
  static async updateWishList({ userID, wishListID, wishListName, items }) {
    validate(userID, wishListName, items);

    if (!wishListID) {
      throw new Error("Must provide existing wish list ID");
    }

    const trimmed = wishListName.trim();
    if (!trimmed) {
      throw new Error("Must provide wish list name");
    }

    const { id, data } = await WishListApi.update(
      wishListID,
      wishListName,
      items
    );

    // No data, we failed to create
    if (!data) {
      throw new Error("Failed to update existing wishlist: " + wishListID);
    }

    return new WishList({
      id,
      name: data.name,
      items: data.items,
    });
  }
  static async createNewWishList({ userID, wishListName, items }) {
    validate(userID, wishListName, items);

    const trimmed = wishListName.trim();
    if (!trimmed) {
      throw new Error("Must provide wish list name");
    }

    const userListID = await UserWishListApi.create(userID);
    const validItems = items.filter((i) => i.count > 0);

    logger.d("Create new wishlist: ", userID, trimmed, validItems);
    const { id, data } = await WishListApi.create(
      userListID,
      userID,
      wishListName,
      validItems
    );

    // No data, we failed to create
    if (!data) {
      throw new Error("Failed to create new wishlist: " + userListID);
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
