export class WishListGiftInteractor {
  static async giftAdded({ userID, list, item }) {
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
    const currentCount = currentItem.giftedBy[userID] || 0;
    newList[updateIndex] = currentItem.updateGiftedBy(userID, currentCount + 1);

    return newList;
  }

  static async giftRemoved({ userID, list, item }) {
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
    const currentCount = currentItem.giftedBy[userID] || 0;
    if (currentCount <= 1) {
      newList[updateIndex] = currentItem.clearGiftedBy(userID);
    } else {
      newList[updateIndex] = currentItem.updateGiftedBy(
        userID,
        currentCount - 1
      );
    }
    return newList;
  }
}
