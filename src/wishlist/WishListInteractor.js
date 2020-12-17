import { WishListApi } from "./WishListApi";
import { WishList } from "./WishList";

function validate(userID, items) {
  if (!userID) {
    throw new Error("Must provide wish list owner ID");
  }

  if (!items) {
    throw new Error("Must provide a list of items (can be empty)");
  }
}

export class WishListInteractor {
  static async ownerUpdateWishList({
    userID,
    wishListID,
    wishListName,
    items,
  }) {
    validate(userID, items);

    if (!wishListID) {
      throw new Error("Must provide existing wish list ID");
    }

    if (!wishListName) {
      throw new Error("Must provide wish list name");
    }

    const trimmed = wishListName.trim();
    if (!trimmed) {
      throw new Error("Must provide wish list name");
    }

    await WishListApi.ownerUpdate(wishListID, wishListName, items);
  }

  static async giftUpdateWishList({ userID, wishListID, items }) {
    validate(userID, items);

    if (!wishListID) {
      throw new Error("Must provide existing wish list ID");
    }

    if (!userID) {
      throw new Error("Must provide gifting user ID");
    }

    await WishListApi.gifterUpdate(userID, wishListID, items);
  }

  static async createNewWishList({ userID, wishListName, items }) {
    validate(userID, items);

    if (!wishListName) {
      throw new Error("Must provide wish list name");
    }

    const trimmed = wishListName.trim();
    if (!trimmed) {
      throw new Error("Must provide wish list name");
    }

    const validItems = items.filter((i) => i.count > 0);

    await WishListApi.create(userID, wishListName, validItems);
  }

  static async get({ itemID }) {
    const { id, data } = await WishListApi.get(itemID);

    // No data, does not exist
    if (!data) {
      throw new Error("Failed to get wishlist: " + itemID);
    }

    return new WishList({ ...data, id });
  }
}
