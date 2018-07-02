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

I'm certain this implementation will be slower than the implementation on the master branch, since each invocation of `matcher.found` will result in an object key lookup, which is slower than char code lookups and setting/reading two local integers. Recall that `matcher.found` is being called on the order of a million times for a typical HTML document, and maybe billions of times for continuous HTML streaming.

