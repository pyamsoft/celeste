import { WishListApi } from "./WishListApi";
import { WishList } from "./WishList";

export class WishListRealtime {
  static watch(id, onInsertOrUpdate, onDelete) {
    return WishListApi.watch(id, (itemID, wishList) => {
      if (id !== itemID) {
        return;
      }

      if (wishList) {
        const list = new WishList({ ...wishList, id: itemID });
        onInsertOrUpdate(list);
      } else {
        onDelete(itemID);
      }
    });
  }
}
