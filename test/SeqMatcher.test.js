const { describe, it } = require("mocha")
const { expect } = require("chai")
const SeqMatcher = require("../src/SeqMatcher")

describe("SeqMatcher", function(){
  it("should throw error if not given non-empty str", function(){
    const invalidArgs = ["", /reg/, new Date(), {}, () => {}, null, undefined, 0, 1, 1.0, NaN];
    invalidArgs.forEach(arg => {
      expect(() => SeqMatcher(arg)).to.throw("requires non-empty str")
    })
  })

  const expectMatch = (body, substr, expectedMatchIndexes) => {
    const matcher = SeqMatcher(substr);
    for (let i = 0; i < body.length; i++){
      const code = body.charCodeAt(i);
      const isMatchingIndex = expectedMatchIndexes.indexOf(i) > -1;
      const errorMsg = `expected${isMatchingIndex ? " " : " no "}match at index ${i}`
      expect(matcher.found(code)).to.equal(isMatchingIndex, errorMsg)
    }
  }

  // should handle the literal edge cases
  describe("finds the indexes of substrings of unit length", function(){
    it("should find the substring if it's at the beginning", function(){
      expectMatch("abbbbb", "a", [0])
    })
    it("should find the substring if it's at the end", function(){
      expectMatch("bbbbba", "a", [5])
    })
    it("should find the substring if it not at the extrema", function(){
      expectMatch("bbbabb", "a", [3])
    })
    it("should find all instances of the substring", function(){
      expectMatch("baabab", "a", [1, 2, 4])
    })
  })

  describe("finds the ending indexes of substrings of non-unit length", function(){
    it("should find the substring if it's at the beginning", function(){
      expectMatch("atlasbbbbbbbbbbbbbbbbb", "atlas", [4])
    })
    it("should find the substring if it's at the end", function(){
      expectMatch("bbbbbbbbbbbbbbbbbatlas", "atlas", [21])
    })
    it("should find the substring if it not at the extrema", function(){
      expectMatch("bbbbbbbbatlasbbbbbbbbb", "atlas", [12])
    })
    it("should find all instances of the substring", function(){
      expectMatch("bbatlasbbatlasatlasbbb", "atlas", [6, 13, 18])
    })
  })
})
