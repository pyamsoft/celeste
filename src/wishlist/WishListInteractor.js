import { Logger } from "../common/util/logger";
import { WishListApi } from "./WishListApi";
import { ItemListApi } from "../item/ItemListApi";
import { ItemApi } from "../item/ItemApi";
import { ItemList } from "../item/ItemList";

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

    const userListPromise = WishListApi.create(userID).then((result) => {
      logger.d("Created new user list: ", result);
      return result;
    });

    const dbItemPromise = items
      .filter((i) => i.count > 0)
      .map((i) =>
        ItemApi.create(i.id, i.type).then((result) => {
          logger.d("Created new AC Item: ", result);
          return {
            id: result,
            count: i.count,
            giftedBy: {},
          };
        })
      );

    const [userList, dbItems] = await Promise.all([
      userListPromise,
      Promise.all(dbItemPromise),
    ]);

    logger.d("Create new wishlist: ", trimmed, dbItems);
    const { id, data } = await ItemListApi.create(
      userList,
      wishListName,
      dbItems
    );

    // No data, we failed to create
    if (!data) {
      throw new Error("Failed to create new wishlist: " + id);
    }

    return new ItemList({
      id,
      name: data.name,
      items: data.items,
    });
  }

  static async get({ itemID }) {
    const { id, data } = await ItemListApi.get(itemID);

    // No data, does not exist
    if (!data) {
      throw new Error("Failed to get wishlist: " + itemID);
    }

    return new ItemList({
      id,
      name: data.name,
      items: data.items,
    });
  }
}
