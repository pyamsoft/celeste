import React from "react";
import { ACNHFish } from "../../domain/acnh/ACNHFish";
import { ACNHBug } from "../../domain/acnh/ACNHBug";
import { ACNHSea } from "../../domain/acnh/ACNHSea";
import { ACNHFossil } from "../../domain/acnh/ACNHFossil";
import { ACNHHouseware } from "../../domain/acnh/ACNHHouseware";
import { ACNHWallmount } from "../../domain/acnh/ACNHWallmount";

export class WishListCategories {
  static DEFAULT = ACNHFish.TYPE;

  static getDisplayName(category) {
    switch (category) {
      case ACNHFish.TYPE:
        return "Fish";
      case ACNHBug.TYPE:
        return "Bugs";
      case ACNHSea.TYPE:
        return "Sea Creatures";
      case ACNHFossil.TYPE:
        return "Fossils";
      case ACNHHouseware.TYPE:
        return "Houseware";
      case ACNHWallmount.TYPE:
        return "Wall Mounted";
      default:
        return `Unknown: ${category}`;
    }
  }
}
