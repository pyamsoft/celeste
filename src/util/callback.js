export function distinctBy(distinction, callback) {
  let lastSeen = undefined;
  return function distintCallback(data) {
    const newData = distinction(data);
    if (lastSeen !== newData) {
      lastSeen = newData;
      callback(newData);
    }
  };
}
