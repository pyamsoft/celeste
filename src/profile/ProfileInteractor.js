import { UserListRealtime } from "../user/UserListRealtime";
import { ItemListRealtime } from "../item/ItemListRealtime";

export class ProfileInteractor {
  static watchUserList({ userID, onUserListChange }) {
    return UserListRealtime.watch(userID, onUserListChange);
  }

  static watchItemList({ itemID, onItemListChange }) {
    return ItemListRealtime.watch(itemID, onItemListChange);
  }
}
