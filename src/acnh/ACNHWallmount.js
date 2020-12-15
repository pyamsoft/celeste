import { ACNHItem } from "./ACNHItem";

export class ACNHWallmount extends ACNHItem {
  static TYPE = "wallmounted";

  #variant;

  constructor(series, data) {
    super({
      id: data ? data["internal-id"] || "" : "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      series,
    });

    this.#variant = data ? data["variant-id"] || "" : "";
  }

  get variant() {
    return this.#variant;
  }
}
