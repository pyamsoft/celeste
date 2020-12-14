export class User {
  static UNDEFINED = undefined;
  static NOT_LOGGED_IN = null;

  constructor(auth, user) {
    // Private
    this.id = auth.uid;
    this.email = auth.email;
    this.createdAt = auth.metadata?.creationTime || null;
    this.lastLoginAt = auth.metadata?.lastSignInTime || null;

    // Public
    this.displayName = user?.displayName || null;
    this.shareLink = user?.shareLink || null;
  }

  static fromFirebaseUser(auth, user) {
    return new User(auth, user);
  }
}
