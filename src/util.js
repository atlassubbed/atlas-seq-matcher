const isNonemptyStr = s => s && typeof s === "string";

const Trie = str => {
  let head = {}, node = head;
  for (let i = 0; i < str.length; i++)
    node = (node[str.charCodeAt(i)] = {});
  node.isEnd = true;
  return head;
}

module.exports = { isNonemptyStr, Trie }
