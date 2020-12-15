import { createCache } from "../../util/cache";
import { ACNHApi } from "../../api/endpoints/ACNHApi";
import { ACNHFish } from "./ACNHFish";
import { ACNHSea } from "./ACNHSea";
import { ACNHBug } from "./ACNHBug";
import { ACNHWallmount } from "./ACNHWallmount";
import { ACNHHouseware } from "./ACNHHouseware";
import { ACNHFossil } from "./ACNHFossil";

const CACHE_TIMEOUT = 30 * 60 * 1000;

const fishCache = {};
const seaCache = {};
const bugCache = {};
const fossilCache = {};
const houseCache = {};
const wallCache = {};

function cacheWith(cache, key, upstream) {
  if (!cache[key]) {
    cache[key] = createCache(upstream, CACHE_TIMEOUT);
  }

  return cache[key].get(key).then((result) => result.data);
}

function clearCache(cache) {
  for (const key of Object.keys(cache)) {
    const c = cache[key];
    if (c) {
      c.clear();
    }
  }
}

async function getAll(cache, endpoint, model) {
  const items = await cacheWith(cache, null, endpoint);
  return Object.keys(items)
    .map((key) => items[key])
    .map((item) => model(item));
}

export class ACNHInteractor {
  static async getAllFish() {
    return getAll(fishCache, ACNHApi.getAllFish, ACNHFish.from);
  }

  static clearFish() {
    clearCache(fishCache);
  }

  static async getAllSea() {
    return getAll(seaCache, ACNHApi.getAllSea, ACNHSea.from);
  }

  static clearSea() {
    return clearCache(seaCache);
  }

  static async getAllBug() {
    return getAll(bugCache, ACNHApi.getAllBugs, ACNHBug.from);
  }

  static clearBug() {
    return clearCache(bugCache);
  }

  static async getAllFossil() {
    return getAll(fossilCache, ACNHApi.getAllFossils, ACNHFossil.from);
  }

  static clearFossil() {
    return clearCache(bugCache);
  }

  static async getAllHouse() {
    return getAll(houseCache, ACNHApi.getAllHouseware, (series) => {
      // This returns as a list of lists, where each list is an item by its variants.
      // One day we will support this
      return series.map((s) => ACNHHouseware.from(s)).flatMap((s) => s)[0];
    });
  }

  static clearHouse() {
    return clearCache(houseCache);
  }

  static async getAllWall() {
    return getAll(wallCache, ACNHApi.getAllWallmounted, (series) => {
      // This returns as a list of lists, where each list is an item by its variants.
      // One day we will support this
      return series.map((s) => ACNHWallmount.from(s)).flatMap((s) => s)[0];
    });
  }

  static clearWall() {
    return clearCache(wallCache);
  }

  static clearAll() {
    ACNHInteractor.clearFish();
    ACNHInteractor.clearSea();
    ACNHInteractor.clearBug();
    ACNHInteractor.clearFossil();
    ACNHInteractor.clearWall();
    ACNHInteractor.clearHouse();
  }
}
