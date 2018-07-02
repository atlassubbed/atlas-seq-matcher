const { isNonemptyStr, Trie } = require("./util")

module.exports = str => {
  if (!isNonemptyStr(str)) 
    throw new Error("requires non-empty str");
  let node;
  const head = Trie(str), reset = () => {node = head};
  return reset(), {
    found: c => !!(node = node[c] || head).isEnd && !reset(),
    reset
  }
}
