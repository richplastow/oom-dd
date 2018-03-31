${{topline}}

!function (ROOT) { 'use strict'
if (false) return // change to `true` to ‘hard skip’ this test
const { describe, it, eq, neq, is // chai and mocha
      , trySoftSet, tryHardSet, goodVals, badVals } = ROOT.testify()
const { countKeyMatches, isConstant, isReadOnly, isReadWrite, isValid } = Oom.KIT

${{{
module.exports.writeTestAll6Js(config)
}}}

}( 'object' === typeof global ? global : this ) // `window` in a browser
