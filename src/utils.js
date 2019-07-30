export function getSingle(fn) {
  let result;
  return function(...args) {
    return result || (result = fn(...args));
  };
}
