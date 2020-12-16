import { v4 } from "uuid";

export function newRandomID() {
  return v4();
}

export function asID(anything) {
  if (anything === null) {
    return null;
  }

  if (anything === undefined) {
    return null;
  }

  return `${anything}`;
}
