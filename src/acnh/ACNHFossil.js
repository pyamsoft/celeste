import { ACNHItem } from "./ACNHItem";

export class ACNHFossil extends ACNHItem {
  static TYPE = "fossils";

  constructor(series, data) {
    super({
      id: data ? data["file-name"] || "" : "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
      type: ACNHFossil.TYPE,
      series,
    });
  }
}
