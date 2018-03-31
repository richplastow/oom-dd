//// Oom.Dd //// 1.0.3 //// March 2018 //// http://oom-dd.richplastow.com/ /////


!function (ROOT) { 'use strict'
if (false) return // change to `true` to ‘hard skip’ this test
const { describe, it, eq, is } = ROOT.testify()
describe('Oom.Dd.Cloud (node)', () => {




const Class = Oom.Dd.Cloud, stat = Class.stat


describe(`+ve Oom.Dd.Cloud class`, () => {
    it(`should be a class`, () => {
        eq('function', typeof Class, 'Oom.Dd.Cloud should be a function')
    })
})




})//describe('Oom.Dd.Cloud (node)')
}( 'object' === typeof global ? global : this ) // `window` in a browser
