import { ACNHItem } from "./ACNHItem";

export class ACNHWallmount extends ACNHItem {
  static TYPE = "wallmounted";

  #baseID;

  constructor(series, data) {
    super({
      id: data ? data["variant-id"] || "" : "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      type: ACNHWallmount.TYPE,
      series,
    });

    this.#baseID = data ? data["internal-id"] || "" : "";
  }

  get baseID() {
    return this.#baseID;
  }
}
