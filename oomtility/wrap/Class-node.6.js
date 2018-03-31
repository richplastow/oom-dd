${{topline}}


!function (ROOT) { 'use strict'
if (false) return // change to `true` to ‘hard skip’ this test
const { describe, it, eq, is } = ROOT.testify()
describe('${{classname}} (node)', () => {




const Class = ${{classname}}, stat = Class.stat


describe(`+ve ${{classname}} class`, () => {
    it(`should be a class`, () => {
        eq('function', typeof Class, '${{classname}} should be a function')
    })
})




})//describe('${{classname}} (node)')
}( 'object' === typeof global ? global : this ) // `window` in a browser
