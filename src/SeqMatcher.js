const { isNonemptyStr } = require("./util")

module.exports = str => {
  if (!isNonemptyStr(str)) 
    throw new Error("requires non-empty str");
  let maxPos = str.length - 1, curCode, curPos;
  const next = i => {curCode = str.charCodeAt(i)}
  return next(curPos = 0), {
    found: code => {
      if (code !== curCode) return !!next(curPos = 0);
      if (curPos === maxPos) return !next(curPos = 0);
      return !!next(++curPos);
    },
    reset: () => next(curPos = 0)
  }
}
