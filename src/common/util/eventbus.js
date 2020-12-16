import { newRandomID } from "./id";

function generateCount(listeners) {
  const ls = Object.values(listeners);
  let count = 0;
  for (const l of ls) {
    if (l) {
      ++count;
    }
  }
  return count;
}

export class EventBus {
  #listeners;
  #count;

  constructor() {
    this.#listeners = {};
    this.#count = 0;
  }

  get count() {
    return this.#count;
  }

  publish(event) {
    for (const listener of Object.values(this.#listeners)) {
      if (listener) {
        listener(event);
      }
    }
  }

  subscribe(callback) {
    const id = newRandomID();
    const self = this;
    self.#listeners[id] = callback;
    self.#count = generateCount(self.#listeners);
    return function unsubscribe() {
      self.#listeners[id] = null;
      self.#count = generateCount(self.#listeners);
    };
  }
}
