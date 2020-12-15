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
    const { itemID, list } = await ItemListApi.create(
      userList,
      wishListName,
      dbItems
    );

    return new ItemList({
      id: itemID,
      name: list.name,
      items: list.items,
    });
  }
}
