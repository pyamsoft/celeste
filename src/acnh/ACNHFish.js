import { ACNHItem } from "./ACNHItem";

export class ACNHFish extends ACNHItem {
  static TYPE = "fish";

  #priceCJ;
  #rarity;
  #location;
  #northernMonths;
  #southernMonths;
  #times;
  #shadow;

  constructor(series, data) {
    super({
      id: data?.id || "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      type: ACNHFish.TYPE,
      series,
    });

    this.#priceCJ = data ? data["price-cj"] : 0;
    this.#rarity = data?.availability?.rarity || "";
    this.#location = data?.availability?.location || "";
    this.#shadow = data?.shadow || "";
  }
}
