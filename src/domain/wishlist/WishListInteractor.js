import { Logger } from "../../util/logger";
import { UserWishListApi } from "../../api/endpoints/UserWishListApi";
import { ItemWishListApi } from "../../api/endpoints/ItemWishListApi";
import { ItemApi } from "../../api/endpoints/ItemApi";
import { ItemWishList } from "./ItemWishList";

const logger = Logger.tag("WishListInteractor");

export class WishListInteractor {
  static async createNewWishList({ userID, wishListName, items }) {
    if (!items || items.length <= 0) {
      const msg = "Cannot create empty wish list";
      logger.e(msg);
      throw new Error(msg);
    }

    if (!wishListName) {
      const msg = "Must provide wish list name";
      logger.e(msg);
      throw new Error(msg);
    }

    const trimmed = wishListName.trim();
    if (!trimmed) {
      const msg = "Must provide wish list name";
      logger.e(msg);
      throw new Error(msg);
    }

    const userListPromise = UserWishListApi.create(userID).then((result) => {
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
          };
        })
      );

    const [userList, dbItems] = await Promise.all([
      userListPromise,
      Promise.all(dbItemPromise),
    ]);

    logger.d("Create new wishlist: ", trimmed, dbItems);
    const { key, value } = await ItemWishListApi.create(
      userList,
      wishListName,
      dbItems
    );

    return ItemWishList.fromFirebase(key, value);
  }
}
