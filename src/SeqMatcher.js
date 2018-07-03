const { isNonemptyStr, Trie } = require("./util")

module.exports = str => {
  if (!isNonemptyStr(str)) 
    throw new Error("requires non-empty str");
  const head = Trie(str)
  let node = head;
  return {
    found: c => !!(node = node[c] || head).isEnd && !!(node = head),
    reset: () => !!(node = head)
  }
}
