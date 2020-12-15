import { Logger } from "../../util/logger";
import { ACNHFish } from "../../domain/acnh/ACNHFish";
import { ACNHSea } from "../../domain/acnh/ACNHSea";
import { ACNHBug } from "../../domain/acnh/ACNHBug";
import { ACNHFossil } from "../../domain/acnh/ACNHFossil";
import { ACNHHouseware } from "../../domain/acnh/ACNHHouseware";
import { ACNHWallmount } from "../../domain/acnh/ACNHWallmount";

const logger = Logger.tag("ACNHApi");
const ROOT_URL = `https://acnhapi.com/v1`;

function checkStatus(response) {
  const status = response.status;
  if (!!response.ok || (status >= 200 && status < 300)) {
    return response;
  } else {
    const error = new Error(
      response.statusText || "An unknown error occurred."
    );
    error.url = response.url;
    error.code = response.status;
    logger.e(error, "Unable to reach endpoint");
    throw error;
  }
}

// Sometimes a response can be JSON, other times it may just be text. We handle either.
function parseResponse(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") >= 0) {
    return response.json().then((data) => {
      return {
        url: response.url,
        code: response.status,
        data,
      };
    });
  } else {
    return response.text().then((data) => {
      return {
        url: response.url,
        code: response.status,
        data,
      };
    });
  }
}

function xhr(url) {
  return fetch(`${ROOT_URL}${url}`, { method: "GET" })
    .then(checkStatus)
    .then(parseResponse);
}

function request(category, id) {
  if (id) {
    return xhr(`/${category}/${id}`);
  } else {
    return xhr(`/${category}`);
  }
}

function fetchFish(id) {
  return request(ACNHFish.TYPE, id);
}

function fetchSea(id) {
  return request(ACNHSea.TYPE, id);
}

function fetchBugs(id) {
  return request(ACNHBug.TYPE, id);
}

function fetchFossil(id) {
  return request(ACNHFossil.TYPE, id);
}

function fetchHouse(id) {
  return request(ACNHHouseware.TYPE, id);
}

function fetchWall(id) {
  return request(ACNHWallmount.TYPE, id);
}

export class ACNHApi {
  static getAllFish() {
    return fetchFish(null);
  }

  static getFish(id) {
    return fetchFish(id);
  }

  static getAllSea() {
    return fetchSea(null);
  }

  static getSea(id) {
    return fetchSea(id);
  }

  static getAllBugs() {
    return fetchBugs(null);
  }

  static getBug(id) {
    return fetchBugs(id);
  }

  static getAllFossils() {
    return fetchFossil(null);
  }

  static getFossil(id) {
    return fetchFossil(id);
  }

  static getAllHouseware() {
    return fetchHouse(null);
  }

  static getHouseware(id) {
    return fetchHouse(id);
  }

  static getAllWallmounted() {
    return fetchWall(null);
  }

  static getWallmounted(id) {
    return fetchWall(id);
  }
}
