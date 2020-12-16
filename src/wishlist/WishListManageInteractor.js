import { WishListItem } from "./WishListItem";

export class WishListManageInteractor {
  static async itemAdded({ list, item }) {
    // Operate on a copy of the list
    const newList = list.map((i) => i);
    const updateIndex = newList.findIndex(
      (i) =>
        i.id === item.id && i.type === item.type && i.series === item.series
    );
    if (updateIndex >= 0) {
      const currentItem = newList[updateIndex];
      const currentCount = currentItem.count;
      newList[updateIndex] = currentItem.updateCount(
        Math.min(99, currentCount + 1)
      );
    } else {
      const newItem = new WishListItem({
        // Cannot spread ...item here because fields are private
        id: item.id,
        type: item.type,
        series: item.series,
        count: 1,
        createdAt: new Date().toUTCString(),
        giftedBy: {},
      });
      newList.push(newItem);
    }
    return newList;
  }

  static async itemRemoved({ list, item }) {
    // Do lookup operations without list copy
    const updateIndex = list.findIndex(
      (i) =>
        i.id === item.id && i.type === item.type && i.series === item.series
    );
    if (updateIndex < 0) {
      return list;
    }

    // Operate on a copy of the list
    const newList = list.map((i) => i);
    const currentItem = newList[updateIndex];
    const currentCount = currentItem.count;
    if (currentCount > 0) {
      newList[updateIndex] = currentItem.updateCount(
        Math.max(0, currentCount - 1)
      );
    }
    return newList;
  }
}
