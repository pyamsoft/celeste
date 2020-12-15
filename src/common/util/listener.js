const TYPE_FUNCTION = typeof function () {};

export function stopListening(listener) {
  if (!listener) {
    return false;
  }

  if (typeof listener === TYPE_FUNCTION) {
    listener();
    return true;
  }

  if (listener.cancel) {
    listener.cancel();
    return true;
  }

  if (listener.stop) {
    listener.stop();
    return true;
  }

  if (listener.unbind) {
    listener.unbind();
    return true;
  }

  return false;
}
