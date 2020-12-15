export class ACNHHouseware {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name
      ? data.name["name-USen"]
          .split(/\s+/)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")
      : null;
    this.price = data.price || 0;
    this.image = data.image_uri || "";
    this.icon = data.icon_uri || "";
  }

  static from(data) {
    return new ACNHHouseware(data);
  }
}
