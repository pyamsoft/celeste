export class UserWishList {
  constructor(userID, wishlists) {
    this.userID = userID || null;
    this.wishlists = wishlists ? Object.keys(wishlists) : [];
  }

  static fromFirebase(userID, wishlists) {
    return new UserWishList(userID, wishlists);
  }
}
