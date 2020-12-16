import { WishListApi } from "./WishListApi";
import { WishList } from "./WishList";

export class WishListRealtime {
  static watch(id, onChange) {
    return WishListApi.watch(id, (itemID, wishList) => {
      if (id !== itemID) {
        return;
      }

      const list = new WishList({
        id: itemID,
        name: wishList.name,
        items: wishList.items,
      });
      onChange(list);
    });
  }
}
