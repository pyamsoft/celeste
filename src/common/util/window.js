const MARGIN = 32;

function createRemBaseCache() {
  let _remBase = -1;
  return function remBase() {
    if (_remBase < 0) {
      _remBase = window.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
      );
    }
    return _remBase;
  };
}

const remBase = createRemBaseCache();

export function remToPx(rem) {
  return rem * remBase();
}

export function fitToWindowWidth(size) {
  const inner = window.innerWidth;
  const width = inner - MARGIN;
  if (!size || size <= 0) {
    return width;
  }
  return inner < size ? width : size;
}

export function fitToWindowHeight(size) {
  const inner = window.innerHeight;
  const height = inner - MARGIN;
  if (!size || size <= 0) {
    return height;
  }
  return inner < size ? height : size;
}
