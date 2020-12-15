import { createCache } from "../common/util/cache";
import { ACNHApi } from "./ACNHApi";
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
  const result = {};
  for (const key of Object.keys(items)) {
    result[key] = model(key, items[key]);
  }
  return result;
}

export class ACNHInteractor {
  static async getAllFish() {
    return getAll(
      fishCache,
      ACNHApi.getAllFish,
      (key, data) => new ACNHFish(key, data)
    );
  }

  static clearFish() {
    clearCache(fishCache);
  }

  static async getAllSea() {
    return getAll(
      seaCache,
      ACNHApi.getAllSea,
      (key, data) => new ACNHSea(key, data)
    );
  }

  static clearSea() {
    return clearCache(seaCache);
  }

  static async getAllBug() {
    return getAll(
      bugCache,
      ACNHApi.getAllBugs,
      (key, data) => new ACNHBug(key, data)
    );
  }

  static clearBug() {
    return clearCache(bugCache);
  }

  static async getAllFossil() {
    return getAll(
      fossilCache,
      ACNHApi.getAllFossils,
      (key, data) => new ACNHFossil(key, data)
    );
  }

  static clearFossil() {
    return clearCache(bugCache);
  }

  static async getAllHouse() {
    return getAll(houseCache, ACNHApi.getAllHouseware, (key, series) =>
      series.map((s) => new ACNHHouseware(key, s)).flatMap((s) => s)
    );
  }

  static clearHouse() {
    return clearCache(houseCache);
  }

  static async getAllWall() {
    return getAll(wallCache, ACNHApi.getAllWallmounted, (key, series) =>
      series.map((s) => new ACNHWallmount(key, s)).flatMap((s) => s)
    );
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
