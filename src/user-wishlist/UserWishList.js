import { asID } from "../common/util/id";

export class UserWishList {
  #id;
  #wishlists;

  constructor(data) {
    this.#id = data?.id || "";
    this.#wishlists = data?.wishlists
      ? Object.keys(data.wishlists).map((wishListID) => {
          const createdTime = data.wishlists[wishListID];
          return {
            id: wishListID,
            createdTime,
          };
        })
      : [];
  }

  get id() {
    return asID(this.#id);
  }

  get wishlists() {
    return this.#wishlists;
  }
}
