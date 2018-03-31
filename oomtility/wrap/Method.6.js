${{topline}}

!function (ROOT) { 'use strict'

const META = {
    NAME:     '${{methodname}}'
  , REMARKS:  '${{remarks}}'
}


//// Shortcuts to Oom’s global namespace and toolkit, and this method’s class.
const Oom = ROOT.Oom
const KIT = Oom.KIT
const Class = ${{classname}}


//// Define the `${{methodname}}()` method.
const method = Class.prototype.${{methodshort}} = function (abc) {
    let err, ME = `${{methodname}}(): ` // error prefix
    if (! (this instanceof Class)) throw new Error(ME
      + `Must not be called as ${{classname}}.prototype.${{methodshort}}()`)
    if ( err = KIT.validateType({ type:String }, abc) )
        throw new TypeError(ME+`abc ${err}`)

    this.${{methodshort}}_calltally++
    return abc + ' ok!'

}//${{methodname}}()


//// A tally of the number of times `${{methodshort}}()` is called.
Class.prototype.${{methodshort}}_calltally = 0


//// Add static constants to the `${{methodshort}}()` method.
Object.defineProperties( method, KIT.toPropsObj(META) )




}( 'object' === typeof global ? global : this ) // `window` in a browser
