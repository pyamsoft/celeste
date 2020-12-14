import { IS_DEBUG_MODE } from "./constants";

function log(method, tag, ...args) {
  if (tag) {
    method(`[${tag}]`, ...args);
  } else {
    method(...args);
  }
}

class DebugLogger {
  constructor(tag) {
    this.tag = tag;
  }

  d(...args) {
    if (IS_DEBUG_MODE) {
      log(console.log, this.tag, ...args);
    }
  }

  w(...args) {
    if (IS_DEBUG_MODE) {
      log(console.warn, this.tag, ...args);
    }
  }

  e(...args) {
    if (IS_DEBUG_MODE) {
      log(console.error, this.tag, ...args);
    }
  }
}

const RootLogger = new DebugLogger(null);

export class Logger {
  static tag(tag) {
    return new DebugLogger(tag);
  }

  static d(...args) {
    RootLogger.d(...args);
  }

  static w(...args) {
    RootLogger.w(...args);
  }

  static e(...args) {
    RootLogger.e(...args);
  }
}
