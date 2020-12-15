export class ACItem {
  constructor(data) {
    this.id = data.id || null;
    this.type = data.type || null;
  }

  static from(data) {
    return new ACItem(data);
  }
}
