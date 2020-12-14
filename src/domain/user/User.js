export class User {
  static UNDEFINED = undefined;
  static NOT_LOGGED_IN = null;

  constructor(user) {
    this.id = user.id;
  }

  static fromFirebaseUser(user) {
    if (user instanceof User) {
      return user;
    } else if (!user) {
      return User.NOT_LOGGED_IN;
    } else {
      return new User(user);
    }
  }
}
