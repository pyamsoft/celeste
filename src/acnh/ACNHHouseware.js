import { ACNHItem } from "./ACNHItem";

export class ACNHHouseware extends ACNHItem {
  static TYPE = "houseware";

  constructor(data) {
    super({
      id: data ? data["internal-id"] || "" : "",
      name: data?.name["name-USen"] || "",
      price: data?.price || 0,
      image: data?.image_uri || "",
    });
  }
}
