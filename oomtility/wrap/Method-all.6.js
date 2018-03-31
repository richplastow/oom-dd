${{topline}}

!function (ROOT) { 'use strict'
if ('function' !== typeof jQuery) throw Error('jQuery not found')
jQuery( function($) {
title('${{methodname}} All')
const Class = ${{classname}}




test('The ${{methodname}}() method', () => {
    const protoMethod = Class.prototype.${{methodshort}}
    is('function' === typeof protoMethod, 'prototype.${{methodshort}}() is a function')
    is('${{methodname}}' === protoMethod.NAME, "NAME is '${{methodname}}'"+protoMethod.NAME)
})




test('+ve ${{methodshort}}()', () => {
    const instance1 = Class.testInstanceFactory()
    is('123 ok!' === instance1.${{methodshort}}('123'),
       "`${{methodshort}}('123')` returns '123 ok!'")
    instance1.${{methodshort}}('456')
    is(2 === instance1.${{methodshort}}_calltally,
       'After two calls, `${{methodshort}}_calltally` is 2')

    const instance2 = Class.testInstanceFactory()
    instance2.${{methodshort}}('789')
    is(1 === instance2.${{methodshort}}_calltally,
       'A second instance has its own `${{methodshort}}_calltally` property')

})




test('-ve ${{methodshort}}()', () => {
    const protoMethod = Class.prototype.${{methodshort}}
    throws( () => protoMethod('123')
      , '${{methodname}}(): Must not be called as ${{classname}}.prototype.${{methodshort}}()'
      , 'Prototype call')
    const instance = Class.testInstanceFactory()
    throws( () => instance.${{methodshort}}(123)
      , '${{methodname}}(): abc has constructor.name Number not String'
      , 'Passing a number into `abc`')
})




})//jQuery()
}( 'object' === typeof global ? global : this ) // `window` in a browser
