${{topline}}

//// Node.js:    7.2.0
//// Rhino:      @TODO get Rhino working
//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)

!function (ROOT) { 'use strict'
ROOT.testify = testify // make `testify()` available to all test files
if (false) return // change to `true` to ‘hard skip’ this test
const { describe, it, eq, neq, is // chai and mocha
      , trySoftSet, tryHardSet, goodVals, badVals } = ROOT.testify()
const { countKeyMatches, isConstant, isReadOnly, isReadWrite, isValid } = Oom.KIT

${{{
module.exports.writeTestAll6Js(
    Object.assign({}, config, { classname:'Oom' }) )
}}}




${{{
module.exports.writeTestAll6Js(
    Object.assign({}, config, { classname:`Oom.${classname}` }) )
}}}


}( 'object' === typeof global ? global : this ) // `window` in a browser




//// UTILITY

//// Reduces boilerplate at the top of the test files. Bases-browser.6.js adds
//// it to global scope, so that the following test files can use it.
function testify () {
    this.chai  = this.chai  || require('chai')  // only `require()` Chai once
    this.mocha = this.mocha || require('mocha') // only `require()` Mocha once
    return {
        chai
      , mocha
      , assert:   chai.assert
      , expect:   chai.expect
      , eq:       chai.assert.strictEqual
      , neq:      chai.assert.notStrictEqual
      // , deepeq:   chai.assert.deepEqual
      , is:       chai.assert.isOk
      , describe: this.describe || mocha.describe // browser || Node.js
      , it:       this.it       || mocha.it       // browser || Node.js

        //// Simulate an accidental attempt to modify an object’s properties.
      , trySoftSet: (obj, keylist, value) => {
            keylist.split(',').forEach( key => {
                try { obj[key] = value } catch(e) {} })
        }

        //// Simulate a determined attempt to modify an object’s properties.
      , tryHardSet: (obj, keylist, value) => {
            keylist.split(',').forEach( key => {
                const def = { enumerable:true, value, configurable:true }
                try { Object.defineProperty(obj, key, def) } catch(e) {}
            })
        }

        //// Dummy values which pass or fail `isValid()`.
      , goodVals: {
            color:  '#C84CED'
          , Number: 12345
          , String: 'A new valid str'
        }
      , badVals: {
            color:  'C84CED' // missing the '#'
          , Number: '11.22.33' // the string '11.22' would be cast to 11.22
          , String: /Not a valid str/ // regexp, not a string
        }

    }
}
