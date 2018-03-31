${{topline}}

!function (ROOT) { 'use strict'

//// Metadata for Oom.${{classname}}
const META = {
    NAME:     'Oom.${{classname}}'
  , VERSION:  '${{version}}' // OOMBUMPABLE
  , HOMEPAGE: '${{homepage}}'
  , REMARKS:  '${{remarks}}'
  , LOADED_FIRST: ! ROOT.Oom // true if the Oom class is defined by this module
}




//// INITIALISE KIT


//// Oom’s toolkit (created if not present). @TODO test with several modules
const KIT = assignKIT(META.LOADED_FIRST || ! ROOT.Oom.KIT ? {} :  ROOT.Oom.KIT)




//// THE Oom CLASS AND NAMESPACE


//// If not already present, define `Oom`, the base class for all Oom classes,
//// which is also Oom’s global namespace. Also, define a shortcut to it.
const Oom = ROOT.Oom = META.LOADED_FIRST ? class Oom {

    constructor (config={}) {
        const ME = 'Oom:constructor(): '
        const Class = this.constructor
        const attrSchema = Class.schema.attr

        //// Create the plain `inst.attr` object (which Vue will reactively
        //// watch) and add public attributes to it.
        const attr = this.attr = {}
        for (let key in attrSchema) {
            const def = attrSchema[key] // a single attribute schema-definition
            if ( KIT.isConstant(key) )
                KIT.define.constant.attr(attr, def, this)
            else if ( KIT.isReadOnly(key) )
                KIT.define.readOnly.attr(attr, def, this)
            else if ( KIT.isReadWrite(key) )
                KIT.define.readWrite.attr(attr, def, this)
            else
                throw Error(ME+key+' is an invalid attribute name')
        }

    }


    //// Resets read-only and read-write statics to their default values.
    static reset () { //@TODO smarter reset, remove local shadow
        const statSchema = this.schema.stat // `this` is the current class
        for (let key in statSchema) {
            if ( KIT.isConstant(key) ) continue // no need to reset constants
            const def = statSchema[key]
            const shadowObj = def.perClass ? this.stat : def.definedIn.stat
            if ( KIT.isReadOnly(key) ) // reset a read-only static’s ‘shadow’
                shadowObj['_'+key] = def.default
            else // a read-write static
                shadowObj[key] = def.default
        }
    }


    //// Resets read-only and read-write attributes to their default values.
    reset () { //@TODO smarter reset, remove local shadow
        const attrSchema = this.constructor.schema.attr // the current class
        for (let key in attrSchema) {
            if ( KIT.isConstant(key) ) continue // no need to reset constants
            const def = attrSchema[key]
            if ( KIT.isReadOnly(key) ) // reset a read-only attribute’s ‘shadow’
                this.attr['_'+key] = def.default
            else // a read-write attribute
                this.attr[key] = def.default
        }
    }


    //// Merge a new schema into the current class’s existing schema.
    static mixin (shorthandSchema) {
        const ME = 'Oom.mixin(): '

        //// Merge a normalised version of the new schema into the existing one.
        const existing = this.schema
        const normalised = KIT.normaliseSchema(this, shorthandSchema)
        this.schema = {} // reset this class’s schema
        this.schema.stat = Object.assign({}, existing.stat, normalised.stat)
        this.schema.attr = Object.assign({}, existing.attr, normalised.attr)

        //// Create or replace the plain `Class.stat` object (which Vue will
        //// reactively watch) and add public statics to it.
        const stat = this.stat = {}
        for (let key in this.schema.stat) {
            const def = this.schema.stat[key] // a single stat schema-definition
            if ( KIT.isConstant(key) )
                KIT.define.constant.stat(stat, def)
            else if ( KIT.isReadOnly(key) )
                KIT.define.readOnly.stat(stat, def)
            else if ( KIT.isReadWrite(key) )
                KIT.define.readWrite.stat(stat, def)
            else
                throw Error(ME+key+' is an invalid static name')
        }
    }

} : ROOT.Oom
KIT.name(Oom, 'Oom') // prevents `name` from being changed


//// Expose `KIT` globally.
Oom.KIT = KIT




if (META.LOADED_FIRST) {

    //// Oom is the base class, so its schema is not xxxxx @TODO describe
    Oom.schema = {}

    //// Define Oom’s static and instance properties.
    Oom.mixin({
        title: 'The Base Schema'
      , remarks: 'The foundational schema, defined by the base Oom class'
      , location: '${{__LOCATION__}}'

      , config: {} //@TODO

        //// Public static properties (known as ‘statics’ in Oom).
      , stat: {

            //// Public constant statics.
            NAME:     'Oom'
          , VERSION:  META.VERSION
          , HOMEPAGE: 'http://oom.loop.coop/'
          , REMARKS:  'Base class for all Oom classes'

            //// Public read-only statics.
            //// Paired with underying underscore-prefixed ‘shadow’ statics.
          , inst_tally: {
                remarks: 'The number of Oom instantiations made so far'
              , default: 0
            }

            //// Public read-write statics.
            //// Paired with underying underscore-prefixed ‘shadow’ statics.
          , hilite: {
                remarks: 'General purpose, useful as a dev label or status'
              , default: '#112233'
              , type:    'color'
            }

        //// Public instance properties (known as ‘attributes’ in Oom).
        }, attr: {

            //// Public constant attributes.
            UUID: {
                remarks: 'Every Oom instance gets a universally unique ID'
              , default: KIT.generateUUID
              , type:    'string'
            }
          , INST_INDEX: {
                remarks: 'Every Oom instance gets an instance index, which '
                       + 'equals its class’s `inst_tally` at the moment of '
                       + 'instantiation. As a side effect of recording '
                       + '`INST_INDEX`, `inst_tally` is incremented'
              , default: instance => (++instance.constructor.stat._inst_tally)-1
              , type:    'nnint'
            }

            //// Public read-only attributes.
            //// Paired with underying underscore-prefixed ‘shadow’ attributes.
            // ...

            //// Public read-write attributes.
            //// Paired with underying underscore-prefixed ‘shadow’ attributes.
          , hilite: {
                remarks: 'General purpose, useful as a dev label or status'
              , default: '#445566'
              , type:    'color'
            }
          , fooBar: { default:1000, type:Number }

        }

    })//Oom.mixin()

}//if (META.LOADED_FIRST)




//// <member-table> shows a table of class or instance members.
Object.defineProperty(Oom, 'memberTableVueTemplate', {
get: function (innerHTML) { return innerHTML = `
<div :class="'member-table '+objname">
  <table :class="{ hid:doHide }">
    <caption v-html="caption"></caption>
    <tr>
      <th>Name</th>
      <th>Value</th>
      <th>Defined In</th>
      <th>Type</th>
      <th>Default</th>
    </tr>
    <tr v-for="val, key in obj" v-bind:class="'Oom-'+key">
      <td class="key">{{key}}</td>
      <td class="val">
        <input v-if="isReadWrite(key)"    class="read-write" v-model="obj[key]">
        <span v-else-if="isReadOnly(key)" class="read-only">{{val}}</span>
        <span v-else-if="isConstant(key)" class="constant">{{val}}</span>
        <span v-else                      class="private">{{val}}</span>
      </td>
      <td class="defined-in">{{schema[key] ? schema[key].definedInStr : '-'}}</td>
      <td class="type">{{schema[key] ? schema[key].typeStr : '-'}}</td>
      <td class="is-default">{{schema[key] ? schema[key].isFn ? 'fn' : schema[key].default === val ? '√' : 'x' : '-'}}</td>
    </tr>
  </table>
</div>
`} })


////
Object.defineProperty(Oom, 'devMainVueTemplate', {
get: function (innerHTML) { return innerHTML = `
<div class="dev-main col-12">
  <h4>{{stat.NAME}}<em>#{{attr.UUID}}</em></h4>
  <member-table :schema="schema.stat" :obj="stat" objname="stat"
    :do-hide="ui.hideData"
    :caption="'<b style=color:'+stat.hilite+'>&#11044;</b> Static'">
  </member-table>
  <member-table :schema="schema.attr" :obj="attr" objname="attr"
    :do-hide="ui.hideData"
    :caption="'<b style=color:'+attr.hilite+'>&#11044;</b> Attribute'">
  </member-table>
</div>
`} })


Oom.devMainVue = function (instance) { return {
    template: Oom.devMainVueTemplate

  , data: function () {
        const Class = instance.constructor
        return {
            schema: Class.schema
          , stat: Class.stat
          , attr: instance.attr
          , ui: { hideData:false, hideInners:false }
        }
    }

/*
  , props: {
        firstProp: Number
      , UUID: String
    }
*/
  , methods: {
    }

    //// Register any component dependencies not already registered.
  , beforeCreate: function () {

        //@TODO if not already registered
        //// <member-table> shows a table of class and instance members.
        const { isReadWrite, isReadOnly, isConstant, stringOrName } = KIT
        Vue.component('member-table', {
            template: Oom.memberTableVueTemplate
          , props: {
                doHide: Boolean
              , caption: String
              , schema: Object
              , obj: Object
              , objname: String
            }
          , methods: { isReadWrite, isReadOnly, isConstant, stringOrName }
        })

    }

    //// Wrap Vue’s reactive getters and setters with our own.
  , created: function () {
        // KIT.wrapReadOnly(outers[outers.length-1]) //@TODO instance
        KIT.wrapReadOnly(ROOT.Oom.stat)
    }

} }//Oom.devMainVue()


////
Oom.devThumbAFrameVueTemplate = function (instance, innerHTML) {
    const pfx = instance.constructor.name.toLowerCase().replace(/\./g, '-')
    return innerHTML = `
<a-entity position="0 10 0">
  <a-${pfx}-devthumb oom-event class="stat"
            position="-0.7 1.5 -1.5"
            :hilite="stat.hilite">
    <a-animation mixin="rotate"></a-animation>
  </a-${pfx}-devthumb>
  <a-${pfx}-devthumb oom-event class="attr"
            position="0.7 1.5 -1.5"
            :hilite="attr.hilite">
    <a-animation mixin="rotate"></a-animation>
  </a-${pfx}-devthumb>
</a-entity>
<!--
            :material="'shader:flat; color:'+attr.hilite">
  <a-box oom-event class="stat"
         position="-0.7 1.5 -1.5" :material="'shader:flat; color:'+stat.hilite">
    <a-animation mixin="rotate"></a-animation>
  </a-box>
  <a-box oom-event class="attr"
         position="0.7 1.5 -1.5" :material="'shader:flat; color:'+attr.hilite">
    <a-animation mixin="rotate"></a-animation>
  </a-box>
-->
`}//Oom.devThumbAFrameVueTemplate()


Oom.devThumbAFrameVue = function (instance) { return {
    template: Oom.devThumbAFrameVueTemplate(instance)
  , data: function () {
        const Class = instance.constructor
        return {
            schema: Class.schema
          , stat: Class.stat
          , attr: instance.attr
        }
    }

} }//Oom.devThumbAFrameVue()


//// Returns on object used for registering an A-Frame component version of Oom.
Oom.devThumbAFrame = function (instanceXXX) { return {
    schema: KIT.oomSchemaToAFrameSchema(ROOT.Oom.schema)
  , init: function () {
        this.el.setAttribute('material', 'shader:flat; color:pink')
    }
  , update: function (oldData) {
        for (let key in AFRAME.utils.diff(oldData, this.data) )
            if (oldData[key] !== this.data[key]) // did change
                this.updateAttribute(key)
    }
  , tick: function () { }
  , remove: function () {}
  , pause: function () {}
  , play: function () {}

  , updateAttribute: function (key) {
        const attributes = {
            hilite: v => this.el.setAttribute('material', { color:v })
        }
        if (! attributes[key])
            return console.warn(`${key} not recognised`)
        attributes[key](this.data[key])
        // console.log(key, this.data[key])
    }

} }//Oom.devThumbAFrame()


////
//// See https://github.com/aframevr/aframe/blob/master/docs/introduction/html-and-primitives.md#registering-a-primitive
Oom.devThumbAFramePrimative = function (instance, aframeComponentName) {
    return AFRAME.utils.extendDeep(
        {} // return a fresh object
      , AFRAME.primitives.getMeshMixin() // for creating mesh-based primitives
      , {
            defaultComponents: { // preset default components
                [aframeComponentName]: { hilite:'#ff0000' }
              , geometry: { primitive: 'box' }
            }
          , mappings: { // from HTML attributes to component properties
                hilite: aframeComponentName+'.hilite'
            }
        }
    )//extendDeep()
}//Oom.devThumbAFramePrimative()




//// Oom.${{classname}} CLASS


//// Define `Oom.${{classname}}`, this module’s specialism of `Oom`.
Oom.${{classname}} = class extends Oom {
    constructor (config={}) {
        super(config)
    }

}; KIT.name(Oom.${{classname}}, 'Oom.${{classname}}')


//// Define this class’s static and instance properties.
Oom.Foo.mixin({
    title: 'The Oom.${{classname}} Schema'
  , remarks: 'Defines metadata for this module'
  , location: '${{__LOCATION__}}'

  , config: {} //@TODO

    //// Public static properties (known as ‘statics’ in Oom).
  , stat: META

    //// Public instance properties (known as ‘attributes’ in Oom).
  , attr: {}

})//Oom.Foo.mixin()




//// KIT FUNCTIONS


function assignKIT (previousKIT={}) { return Object.assign({}, {

    //// Creates a sequence of six random characters (57 billion combinations),
    //// containing only uppercase and lowercase letters and digits.
    generateUUID: () => {
        const rndCh = (s, e) => String.fromCharCode( Math.random() * (e-s) + s )
        return 'x'.repeat(6)
           .replace( /./g,           c => rndCh(48,122) ) // ascii 0-z
           .replace( /[:-@\\[-\`]/g, c => rndCh(97,122) ) // ascii a-z
    }


    //// @TODO describe these three
  , applyDefault: (valid, config) => {
        if ( config.hasOwnProperty(valid.name) )
            return true // `true` here signifies default didn’t need to be applied
        if (! valid.hasOwnProperty('default') )
            return false // `false` signifies a missing mandatory field
        config[valid.name] = 'function' === typeof valid.default
          ? valid.default(config) // a value can depend on another config value
          : valid.default
        return true // `true` here signifies default was successfully applied
    }

    //// Validates a value against a given type.
  , validateType: (valid, value) => {
        const ME = 'KIT.validateType: ', C = 'constructor'
        if (null === valid.type)
            return (null === value) ? null : `is not null`
        if ('undefined' === typeof valid.type)
            return ('undefined' === typeof value) ? null : `is not undefined`
        if (! valid.type.name )
            throw TypeError(ME+valid.name+`’s valid.type has no name`)
        if (! value[C] || ! value[C].name )
            throw TypeError(ME+valid.name+`’s value has no ${C}.name`)
        return (valid.type.name === value[C].name)
          ? null : `has ${C}.name ${value[C].name} not ${valid.type.name}`
    }

  , validateRange: (valid, value) => {
        if (null != valid.min && valid.min > value)
            return `is less than the minimum ${valid.min}`
        if (null != valid.max && valid.max < value)
            return `is greater than the maximum ${valid.max}`
        if (null != valid.step && ((value/valid.step) % 1))
            return `${value} ÷ ${valid.step} leaves ${(value/valid.step) % 1}`
    }

    //// Validates a value against a given type.
  , isValid: (valid, value) => { // `valid` is a schema descriptor-object
        const PFX = 'KIT.isValid: '+valid.name+'’s '
        if ('string' === typeof valid.type)
            switch (valid.type) {
                case 'undefined': // not a Vue or A-Frame type
                    return valid.type === typeof value
                // case 'array': // Vue: `Array`  A-Frame: 'array'
                //     return Array.isArray(value)
                case 'color': // A-Frame: 'color'
                    return /^#[0-9a-fA-F]{6}$/.test(value)
                case 'nnint': // A-Frame: 'int', but not negative numbers
                    return Number.isInteger(value)
                case 'null': // not a Vue or A-Frame type
                    return null === value
                //@TODO add more of these, following:
                //aframe.io/docs/master/core/component.html#property-types
                default:
                    throw TypeError(PFX+`valid.type is '${valid.type}'`)
            }
        if (Number === valid.type)
            return 'number' === typeof value && ! Number.isNaN(value)
        if (null === valid.type)
            return null === value
        if ('undefined' === typeof valid.type)
            return 'undefined' === typeof value
        if (! valid.type.name )
            throw TypeError(PFX+`valid.type has no name`)
        if (! value.constructor || ! value.constructor.name )
            throw TypeError(PFX+`value has no constructor.name`)
        return valid.type.name === value.constructor.name
    }


    //// Get milliseconds since context began, to several decimal places.
  , getNow: () => {
        let now
        if ( // Node.js
            'object'   === typeof ROOT.process
         && 'function' === typeof ROOT.process.hrtime) {
            const hrtime = ROOT.process.hrtime()
            now = ( (hrtime[0] * 1e9) + hrtime[1] ) / 1e6 // in milliseconds
        } else { // modern browser @TODO legacy browser
            now = ROOT.performance.now()
        }
        return now
    }


    //// Functions in the `define` set are used to initialise the statics and
    //// attributes defined in a class’s schema. They are primarily used by
    //// `Oom.mixin()`. `def` should be a single property-definition from a
    //// normalised schema object.
  , define: {

        //// Initialise a constant, eg `FOO_BAR`.
        constant: {
            stat: (stat, def) => KIT.define.constant.any(stat, def)
          , attr: function (attr, def, instance) {
                if (def.isFn) { // a weak constant: wont survive `tryHardSet()`
                    const value = def.default(instance)
                    Object.defineProperty(attr, def.name, {
                        get: function ()  { return value }
                      , set: function (value) { } // do nothing - it’s constant
                      , configurable:true, enumerable:true })
                } else { // a proper constant: will survive `tryHardSet()`
                    KIT.define.constant.any(attr, def)
                }
            }
          , any: (obj, def) =>
                Object.defineProperty(obj, def.name, { value: def.default
                  , configurable:false, enumerable:true, writable:false })
          //@TODO Fix the following - it would be neater and avoid `get/set()`, but it seems to make some constants writable at present:
          // , attr: (attr, def, instance) => KIT.define.constant.any(attr, def, instance)
          // , any: function (obj, def, instance) {
          //       // console.log('was', def.name, obj[def.name]);
          //       Object.defineProperty(obj, def.name, {
          //           value: def.isFn ? def.default(instance) : def.default
          //         , configurable: def.isFn
          //         , enumerable:true, writable:false })
          //       // console.log('set', def.name, 'to', obj[def.name], 'configurable?', def.isFn);
          //   }
        }

        //// Initialise a read-only property, eg `foo_bar`.
      , readOnly: {
            stat: (stat, def) => {
                const shadowObj = def.perClass ? stat : def.definedIn.stat
                KIT.define.shadow(shadowObj, def)
                KIT.define.readOnly.any(stat, def, shadowObj)
            }
          , attr: (attr, def) => {
                KIT.define.shadow(attr, def)
                KIT.define.readOnly.any(attr, def, attr)
            }
          , any:  (obj, def, shadowObj) =>
                Object.defineProperty(obj, def.name, {
                    get: function ()  { return shadowObj['_'+def.name] }
                  , set: function (value) { } // do nothing - it’s read-only
                  , configurable:true, enumerable:true })
        }

        //// Initialise a read-write property, eg `fooBar`.
      , readWrite: {
            stat: (stat, def) => {
                const shadowObj = def.perClass ? stat : def.definedIn.stat
                KIT.define.shadow(shadowObj, def)
                KIT.define.readWrite.any(stat, def, shadowObj)
            }
          , attr: (attr, def) => {
                KIT.define.shadow(attr, def)
                KIT.define.readWrite.any(attr, def, attr)
            }
          , any:  (obj, def, shadowObj) =>
                Object.defineProperty(obj, def.name, {
                    get: function ()  { return shadowObj['_'+def.name] }
                  , set: function (value) {
                        if ( KIT.isValid(def, value) )
                            return shadowObj['_'+def.name] = value
                        if ('function' !== typeof def.type) return // give up
                        let castValue = def.type(value) // eg `Number("123")`
                        if ( KIT.isValid(def, castValue) )
                            return shadowObj['_'+def.name] = castValue
                    }
                  , configurable:true, enumerable:true })
        }

        //// Used by `readOnly.*t**()` and `readWrite.*t**()` to initialise a
        //// ‘shadow’ property, eg `_foo_bar` or `_fooBar`.
      , shadow: (shadowObj, def) =>
            Object.defineProperty(shadowObj, '_'+def.name, { value:def.default
              , configurable:true, enumerable:true, writable:true })
    }
/*

    //// Adds one or more property to `obj`. @TODO refactor - too messy
    //// Can also be used to change the value of existing properties. @TODO does Vue croak when that happens?
  , define: (obj, isStatic, ...srcs) =>
        srcs.forEach( src => {
            const ME = 'KIT.define: ', def = {}
            for (let k in src) {
                if ('undefined' === typeof src[k].default)
                    throw Error(ME+k+' is not a valid schema object')
                const value = src[k].default
                if ( KIT.isReadOnly(k) ) { // eg 'foo_bar'
                    if (isStatic) {
                        if (! src[k].definedIn.stat['_'+k])
                            Object.defineProperty(src[k].definedIn.stat, '_'+k, {
                                writable:true, value
                              , configurable:true, enumerable:true })
                        def[k] = { // public read-only property
                            get: function ()  { return src[k].definedIn.stat['_'+k] }
                          , set: function (v) { } // read-only
                          , configurable:true, enumerable:true }
                    } else { // attribute
                        def['_'+k] = { // private property, still visible to Vue
                            writable:true, value
                          , configurable:true, enumerable:true }
                        def[k] = { // public read-only property (not a constant)
                            get: function ()  { return obj['_'+k] }
                          , set: function (v) { } // read-only
                          , configurable:true, enumerable:true }
                    }
                } else if ( KIT.isReadWrite(k) ) { // eg 'fooBar'
                    if (isStatic) {
                        if (src[k].definedIn.stat['_'+k])
                            console.log(src[k].definedInStr, 'already has', '_'+k);
                        else
                            Object.defineProperty(src[k].definedIn.stat, '_'+k, {
                                writable:true, value
                              , configurable:true, enumerable:true })
                        def[k] = { // public read-write property
                            get: function ()  { return src[k].definedIn.stat['_'+k] }
                          , set: function (v) {
                                if ( KIT.isValid(src[k], v) )
                                    return src[k].definedIn.stat['_'+k] = v
                                let vCast
                                if ('function' === typeof src[k].type) {
                                    vCast = src[k].type(v)
                                    if ( KIT.isValid(src[k], vCast) )
                                        return src[k].definedIn.stat['_'+k] = vCast
                                }
                            }
                          , configurable:true, enumerable:true }
                    } else { // attribute
                        def['_'+k] = { // private property, still visible to Vue
                            writable:true, value
                          , configurable:true, enumerable:true }
                        def[k] = { // public read-write property
                            get: function ()  { return obj['_'+k] }
                          , set: function (v) {
                                if ( KIT.isValid(src[k], v) )
                                    return obj['_'+k] = v
                                let vCast
                                if ('function' === typeof src[k].type) {
                                    vCast = src[k].type(v)
                                    if ( KIT.isValid(src[k], vCast) )
                                        return obj['_'+k] = vCast
                                }
                            }
                          , configurable:true, enumerable:true }
                    }
                } else if ( KIT.isConstant(k) ) { // eg 'FOO_BAR'
                    def[k] = { // public constant
                        writable:false, value
                      , configurable:false, enumerable:true }
                } else {
                    throw Error(ME+k+' is an invalid property name')
                }
            }
            Object.defineProperties(obj, def)
        })
*/

    //// Set the unwritable, unconfigurable, non-enumerable `name` property of
    //// `obj`. Usage: `name(myFn, 'myFn')`.
  , name: (obj, value) =>
        Object.defineProperty(obj, 'name', { value, configurable:false })

    //// Wraps Vue’s reactive getter and setter for each read-only property.
    //// The wrapper prevents the property being set directly, and gets from the
    //// ‘shadow’ property (same name, but underscore-prefixed). `wrapReadOnly()
    //// should be called after Vue creates a component.
  , wrapReadOnly: obj => {
/* @TODO reinstate or remove
        for (let k in obj) {
            if (! KIT.isReadOnly(k) ) continue // ignore constant and read-write
            const { get, set } = Object.getOwnPropertyDescriptor(obj, k)
            // const propertyDescriptor =
            //     Object.getOwnPropertyDescriptor(obj, k)
            // const vueReactiveGetter = propertyDescriptor.get
            // const vueReactiveSetter = propertyDescriptor.set
            // if (! vueReactiveGetter) { continue } // probably a non-writable property
            if ('wrappedGet' === get.name) { console.log('!!!');continue} //@TODO more graceful way of avoiding double-wrap
            // console.log('wrap ' + k + ' getter and setter');
            const wrappedGet = function wrappedGet () {
                let val
                if ( KIT.isReadOnly(k) )
                    val = obj['_'+k] // read-only property’s value
                else
                    val = get()
                // console.log('get ' + k + ' ' + val);
                return val
            }
            const wrappedSet = function wrappedSet (val) {
                if ( KIT.isReadOnly(k) )
                    return
                // console.log('set ' + k + ' to ' + val);
                return set(val)
            }
            // console.log('wrapped '+k+' on '+obj.UUID)
            Object.defineProperty(obj, k, {
                configurable:true, enumerable:true
              , get: wrappedGet
              , set: wrappedSet
            })
        }
*/
    }

  , countKeyMatches: (obj, matchFn, tally=0) => {
        for (let key in obj) if ( matchFn(key) ) tally++; return tally }

    ////
  , stringOrName: val => 'string' === typeof val ? val : val.name

    //// Three helpers which classify property names, eg 'foo_bar_4', 'fooBar4'
    //// and 'FOO_BAR_4'. Minimal names are 'a_', 'a' and 'A'. Leading digits or
    //// underscores are not allowed.
  , isConstant:  k => /^[A-Z][_A-Z0-9]*$/.test(k)
  , isReadOnly:  k => -1 !== k.indexOf('_') && /^[a-z][_a-z0-9]+$/.test(k)
  , isReadWrite: k => /^[a-z][A-Za-z0-9]*$/.test(k)

    //// Validates a schema object and fills in any gaps.
  , normaliseSchema: (Class, schema) => {
        const out = {}
        for (let zone in schema) {
            out[zone] = {} // eg `out.stat = {}` or `out.attr = {}`
            for (let propName in schema[zone]) {
                const PFX = 'KIT.normaliseSchema: '+propName+'’s '
                const inDesc = schema[zone][propName]
                const outDesc = out[zone][propName] = {}
                // if (null != inDesc.typeStr)
                //     throw TypeError(PFX+`inDesc.typeStr has already been set`)
                // if (null != inDesc.definedIn)
                //     throw TypeError(PFX+`inDesc.definedIn has already been set`)
                // if (null != inDesc.definedInStr)
                //     throw TypeError(PFX+`inDesc.definedInStr has already been set`)
                outDesc.name = propName // for better `isValid()` error messages
                outDesc.default = 'object' === typeof inDesc
                  ? inDesc.default // full: `{ stat:{ OK:{ default:'Yep' } } }`
                  : inDesc // ...or allow shorthand: `{ stat:{ OK:'Yep' } }`
                outDesc.isFn = 'function' === typeof outDesc.default
                const strToObj = {
                    array   : Array
                  , boolean : Boolean
                  , function: Function
                  , number  : Number
                  , object  : Object
                  , string  : String
                  , symbol  : Symbol
                }
                const validStr = {
                    undefined: 1 //@TODO add more of these, following:
                  , color    : 1 //aframe.io/docs/master/core/component.html#property-types
                  , nnint    : 1
                  , null     : 1
                }
                if (! inDesc.hasOwnProperty('type') )
                    outDesc.type = outDesc.default.constructor // 123 -> Number
                else if (strToObj[inDesc.type])
                    outDesc.type = strToObj[inDesc.type] // 'number' -> Number
                else if (validStr[inDesc.type])
                    outDesc.type = inDesc.type // 'nnint' -> 'nnint'
                else {
                    if ('function' !== typeof inDesc.type)
                        throw TypeError(PFX+`inDesc.type is not a string or a function`)
                    if (! inDesc.type.name )
                        throw TypeError(PFX+`inDesc.type has no name`)
                    outDesc.type = inDesc.type
                }
                outDesc.typeStr = KIT.stringOrName(outDesc.type) // can be passed to a Vue component, unlike functions
                outDesc.definedIn = Class
                outDesc.definedInStr = Class.name
                outDesc.perClass = null == inDesc.perClass ? true : inDesc.perClass
                outDesc.remarks = inDesc.remarks ||
                  'A' + ( /^[aeiou]/.test(outDesc.typeStr) ? 'n ' : ' ' ) + outDesc.typeStr //@TODO test
            }
        }
        return out
    }//normaliseSchema()


    ////
  , oomSchemaToAFrameSchema: oomSchema => {
        return {
            hilite: { type:'color', default:'#ff00ff' }
        }
    }

}, previousKIT) }//assignKIT()


}( 'object' === typeof global ? global : this ) // `window` in a browser
