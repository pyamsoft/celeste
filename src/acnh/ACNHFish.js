import { ACNHItem } from "./ACNHItem";

export class ACNHFish extends ACNHItem {
  static TYPE = "fish";

  constructor(series, data) {
    super({
      id: data?.id || "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      type: ACNHFish.TYPE,
      series,
    });
  }
}
