import { ACNHItem } from "./ACNHItem";

export class ACNHHouseware extends ACNHItem {
  static TYPE = "houseware";

  #variant;

  constructor(series, data) {
    super({
      id: data ? data["internal-id"] || "" : "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      type: ACNHHouseware.TYPE,
      series,
    });

    this.#variant = data ? data["variant-id"] || "" : "";
  }

  get variant() {
    return this.#variant;
  }
}
