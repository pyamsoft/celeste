export class UserList {
  #id;
  #wishlists;

  constructor(data) {
    this.#id = data?.id || "";
    this.#wishlists = data?.wishlists ? Object.keys(data.wishlists) : [];
  }

  get id() {
    return this.#id;
  }

  get wishlists() {
    return this.#wishlists;
  }
}
