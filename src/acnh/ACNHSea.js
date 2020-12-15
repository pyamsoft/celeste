import { ACNHItem } from "./ACNHItem";

export class ACNHSea extends ACNHItem {
  static TYPE = "sea";

  constructor(series, data) {
    super({
      id: data?.id || "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      series,
    });
  }
}
