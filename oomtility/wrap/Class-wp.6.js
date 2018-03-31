${{topline}}

!function (ROOT) { 'use strict'
if (false) return // change to `true` to ‘hard skip’ this test
const { describe, it, eq, neq, is, goodVals, badVals } = ROOT.testify()
const { isConstant, isReadOnly, isReadWrite } = Oom.KIT

${{{
module.exports.writeTestWp6Js(config)
}}}

}(window)
