import { WishListItem } from "./WishListItem";
import { WishListCategories } from "./WishListCategories";

export class WishListManageInteractor {
  static async itemAdded({ list, item }) {
    // Operate on a copy of the list
    const newList = list.map((i) => i);
    const hasSeries = WishListCategories.hasSeries(item.type);
    const updateIndex = newList.findIndex(
      (i) =>
        i.id === item.id &&
        i.type === item.type &&
        (hasSeries ? i.series === item.series : true)
    );
    if (updateIndex >= 0) {
      const currentItem = newList[updateIndex];
      const currentCount = currentItem.count;
      newList[updateIndex] = currentItem.updateCount(
        Math.min(99, currentCount + 1)
      );
    } else {
      const newItem = new WishListItem({
        id: item.id,
        type: item.type,
        series: hasSeries ? item.series : null,
        count: 1,
        giftedBy: {},
      });
      newList.push(newItem);
    }
    return newList;
  }

  static async itemRemoved({ list, item }) {
    // Do lookup operations without list copy
    const hasSeries = WishListCategories.hasSeries(item.type);
    const updateIndex = list.findIndex(
      (i) =>
        i.id === item.id &&
        i.type === item.type &&
        (hasSeries ? i.series === item.series : true)
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
