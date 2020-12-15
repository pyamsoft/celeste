import { ItemWishListApi } from "../../api/endpoints/ItemWishListApi";
import { ItemWishList } from "./ItemWishList";

export class ItemWishListInteractor {
  static watch({ wishListID, onWishListChanged }) {
    return ItemWishListApi.watch(wishListID, (itemID, wishList) => {
      const list = ItemWishList.fromFirebase(itemID, wishList);
      onWishListChanged(list);
    });
  }
}
