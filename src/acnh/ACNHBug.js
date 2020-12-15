import { ACNHItem } from "./ACNHItem";

export class ACNHBug extends ACNHItem {
  static TYPE = "bugs";

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
