# atlas-seq-matcher

Global substring matcher that accepts one character code at a time.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-seq-matcher.svg)](https://travis-ci.org/atlassubbed/atlas-seq-matcher)

---

## install

```
npm install --save atlas-seq-matcher
```

## why

If you are iterating through a `Buffer` or `String`, you might want to know whether or not the current character code completes a sequence you are interested in capturing.

For example, I'm writing an HTML parser and I need to detect a closing style or script tag without polluting the parser with extra logic. This `SeqMatcher` is fast and only keeps the last seen character code in memory.

## examples

#### capturing words in a stream

In this example, we'll create an object stream which outputs script-end events when it finds a script-closing tag:

```javascript
const SeqMatcher = require("atlas-seq-matcher");
const matcher = SeqMatcher("</script>");

// TODO: implement stream example

```

## caveats

#### performance with trie

I didn't test the equivalent trie implemention of `SeqMatcher` yet, but I'm certain it will be slower than the current implementation, since each invocation of `matcher.found` will result in an object key lookup, which is slower than char code lookups and setting/reading two local integers. Recall that `matcher.found` is being called on the order of a million times for a typical HTML document, and maybe billions of times for continuous HTML streaming.

A concise trie implementation would be something like: 

```javascript
...
module.exports = str => {
  ...
  let node;
  const head = new Trie(str), reset = () => {node = head};
  return reset(), {
    found: c => (node = node[c] || head).isEnd && !reset(),
    reset
  }
}
```
