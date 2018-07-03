const { isNonemptyStr } = require("./util")

module.exports = str => {
  if (!isNonemptyStr(str)) 
    throw new Error("requires non-empty str");
  let max = str.length - 1, pos = 0;
  return {
    found: code => {
      if (code !== str.charCodeAt(pos)) return !!(pos = 0);
      if (pos === max) return !(pos = 0);
      return !++pos;
    },
    reset: () => !(pos = 0)
  }
}
