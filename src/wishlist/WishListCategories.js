import { ACNHFish } from "../acnh/ACNHFish";
import { ACNHBug } from "../acnh/ACNHBug";
import { ACNHSea } from "../acnh/ACNHSea";
import { ACNHFossil } from "../acnh/ACNHFossil";
import { ACNHHouseware } from "../acnh/ACNHHouseware";
import { ACNHWallmount } from "../acnh/ACNHWallmount";

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
