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

For example, I'm writing an HTML parser and I need to detect a closing style or script tag without polluting the parser with extra logic. This `SeqMatcher` uses a trie under-the-hood because it may be more intuitive, but it is much slower.

## examples

See the [master branch](https://github.com/atlassubbed/atlas-seq-matcher#readme) for examples.

## caveats

#### performance with trie

This implementation is 4 times slower than the implementation on the [master branch](https://github.com/atlassubbed/atlas-seq-matcher#readme), since each invocation of `matcher.found` will result in extra object key lookups, which is slower than char code lookups and setting/reading a local integer. Recall that `matcher.found` is being called on the order of a million times for a typical HTML document, and maybe billions of times for continuous HTML streaming.
