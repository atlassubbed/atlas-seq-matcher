# atlas-seq-matcher

Fork of [atlas-seq-matcher](https://github.com/atlassubbed/atlas-seq-matcher) without pinning to node 10.

Global substring matcher that accepts one character code at a time.

[![Built latest](https://github.com/BonnierNews/atlas-seq-matcher/actions/workflows/build-latest.yaml/badge.svg)](https://github.com/BonnierNews/atlas-seq-matcher/actions/workflows/build-latest.yaml)
---

## install

```
npm install --save @bonniernews/atlas-seq-matcher
```

## why

If you are iterating through a `Buffer` or `String`, you might want to know whether or not the current character code completes a sequence you are interested in capturing.

For example, I'm writing an HTML parser and I need to detect a closing style or script tag without polluting the parser with extra logic. This `SeqMatcher` is fast and only keeps the current position in the string in memory.

## examples

#### capturing words in a stream

In this example, we'll [create an object transform stream](https://nodejs.org/api/stream.html#stream_implementing_a_transform_stream) which outputs script-end events when it finds a script-closing tag:

```javascript
// ./ScriptEndStream.js
const { Transform } = require("stream")
const SeqMatcher = require("@bonniernews/atlas-seq-matcher")

// implements transform stream API
module.exports = class ScriptEndStream extends Transform {
  constructor(){
    // this stream outputs data as whole objects
    super({readableObjectMode: true})
    this.matcher = SeqMatcher("</script>");
  }
  _transform(chunk, encoding, done){
    if (chunk === null) return this.end();
    const { matcher }  = this, chunkSize = chunk.length;
    for (let i = 0; i < chunkSize; i++){
      if (matcher.found(chunk[i])){
        // current i is the ">" character of our script-end tag.
        this.push({msg: "found a script ending tag!"})
      }
    }
    // done processing this chunk. next!
    done(null)
  }
  _flush(done){
    // resets the internal matcher position to 0
    this.matcher.reset() 
    done(null)
  }
}
```

Using the stream is pretty easy, we'll call it `Parser`:

```javascript
const Parser = require("./ScriptEndStream")
const htmlStream = fs.createReadStream("./index.html");
htmlStream.pipe(new Parser()).on("data", event => {
  console.log(event.msg) // found a script ending tag!
})
```

#### what about using regexp?

The above example is somewhat contrived, as there are better ways to "count" the number of script-end tags in your text. The following is a much faster way to do it, but requires your potentially long string to exist entirely in memory:

```javascript
...
const myHtml = fs.readFileSync("./index.html");
const matcher = /<\/script>/g
// number of script-end tags
myHtml.match(matcher).length;
```

This example becomes useless when you are dealing with hundreds of megabytes of HTML. 

#### what about using regexp in a stream?

Okay, so we don't want our entire string in memory -- let's just use a regexp with our stream interface:

```javascript
const { Transform } = require("stream")

// implements transform stream API
module.exports = class ScriptEndStream extends Transform {
  constructor(){
    super({readableObjectMode: true})
    this.matcher = /<\/script>/g
  }
  _transform(chunk, encoding, done){
    if (chunk === null) return this.end();
    const { matcher }  = this, chunkSize = chunk.length;
    // DOESN'T WORK FOR EDGE CASES!
    const matches = chunk.toString().match(matcher);
    if (matches) matches.forEach(match => {
      this.push({msg: "found a script ending tag!"})
    })
    done(null)
  }
  _flush(done){
    this.matcher.reset(), 
    done(null)
  }
}
```

This seems nice, but it fails to capture matches which have been split at the chunk-level. For example consider the following case:
  
  1. First chunk: `"my first chunk</scri"`
  2. Second chunk: `"pt>my second chunk"`

This solution fails to capture script-end tags that lie on the boundary. When working with streams or are already iterating through characters, just use `SeqMatcher`. Since `SeqMatcher` works on the character level, it is chunk-agnostic and does not run into boundary problems.

#### resetting the matcher

If you need to flush your stream or do some cleanup, you can manually reset the internal position of the matcher, which effectively erases its memory of what it has seen:

```javascript
...
matcher.reset()
```

## caveats

#### performance with trie

The trie implementation of the `SeqMatcher` looks cleaner, but is slower than the current implementation by a factor 4, since each invocation of `matcher.found` will result in an extra object key lookup, which is slower than char code lookups and setting/reading a local integer. Recall that `matcher.found` is being called on the order of a million times for a typical HTML document, and maybe billions of times for continuous HTML streaming.

A concise trie implementation can be found in the [trie-implementation](https://github.com/atlassubbed/atlas-seq-matcher/tree/trie-implementation) branch.

#### single-char sequences

If you're trying to match a single character (e.g. `SeqMatcher("a")`), don't use `SeqMatcher`, just do it at top level, since it's a *single* character. While this module passes tests for single-char sequences, it has not been optimized for them.
