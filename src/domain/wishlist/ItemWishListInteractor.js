import { Logger } from "../../util/logger";
import { ItemWishListApi } from "../../api/endpoints/ItemWishListApi";
import { ItemWishList } from "./ItemWishList";

const logger = Logger.tag("ItemWishListInteractor");

export class ItemWishListInteractor {
  static listenForWishListChanges({ itemID, onWishListChanged }) {
    return ItemWishListApi.watch(itemID, (itemID, wishList) => {
      logger.d("Wish list for item: ", itemID, wishList);
      const list = ItemWishList.fromFirebase(itemID, wishList);
      onWishListChanged(list);
    });
  }
}
