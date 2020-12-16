import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export function newRandomName() {
  return uniqueNamesGenerator({
    dictionaries: [colors, adjectives, animals],
  });
}
