import { ItemListApi } from "./ItemListApi";
import { ItemList } from "./ItemList";

export class ItemListRealtime {
  static watch(id, onChange) {
    return ItemListApi.watch(id, (itemID, wishList) => {
      if (id !== itemID) {
        return;
      }

      const list = new ItemList({
        id: itemID,
        name: wishList.name,
        items: wishList.items,
      });
      onChange(list);
    });
  }
}
