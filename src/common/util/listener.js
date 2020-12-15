const TYPE_FUNCTION = typeof function () {};

export function stopListening(
  listener,
  options = {
    isFunction: true,
    isCancel: true,
    isStop: true,
    isUnbind: true,
  }
) {
  if (!listener) {
    return false;
  }

  const isFunction = options ? options.isFunction : true;
  const isCancel = options ? options.isCancel : true;
  const isStop = options ? options.isStop : true;
  const isUnbind = options ? options.isUnbind : true;

  if (typeof listener === TYPE_FUNCTION && isFunction) {
    listener();
    return true;
  }

  if (listener.cancel && isCancel) {
    listener.cancel();
    return true;
  }

  if (listener.stop && isStop) {
    listener.stop();
    return true;
  }

  if (listener.unbind && isUnbind) {
    listener.unbind();
    return true;
  }

  return false;
}
