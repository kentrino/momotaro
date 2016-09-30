// not compatiable with array.
module.exports = (to, from) => {
  // if (from instanceof Array) {}
  Object.keys(from).forEach(key => {
    if (typeof from[key] === 'object') {
      to[key] = {};
      clone(to[key], from[key]);
    } else {
      to[key] = from[key];
    }
  });
};
