//// Oom.Dd //// 1.0.4 //// March 2018 //// http://oom-dd.richplastow.com/ /////

!function (ROOT) { 'use strict'


//// Shortcuts to Oom’s global namespace and toolkit.
const Oom = ROOT.Oom
const KIT = Oom.KIT


//// Define the `Oom.Dd.Cloud` class.
const Class = Oom.Dd.Cloud = class extends Oom.Dd {

    constructor (config={}) {
        super(config)
/*
        //// Validate the configuration object.
        this._validateConstructor(config)

        //// Record config’s values to the `attr` object.
        this.validConstructor.forEach( valid => {
            const value = config[valid.name]
            Object.defineProperty(this.attr, valid.name, {
                value, enumerable:true, configurable:true, writable:true })
        })
        //// ready: a Promise which resolves when the instance has initialised.
        Object.defineProperty(this, 'ready', { value: this._getReady() })


        //// attr.index: the first instance of this class is `0`, the second is `1`, etc.
        if (Class === this.constructor) // not being called by a child-class
            attr.index = Class.stat.tally++ // also, update the static `tally`
*/
    }


    //// Defines this class’s static and instance properties.
    //// May be modified by ‘Plus’ classes. @TODO create and use the Plus class
    // static get schema () {
    //     return KIT.normaliseSchema(Oom.Dd.Cloud, Oom.Dd, {
    //
     //        //// Public static properties (known as ‘statics’ in Oom).
     //        stat: {
     //
     //            //// Public constant statics.
     //            NAME:    'Oom.Dd.Cloud'
     //          , REMARKS: '@TODO'
     //
     //          // , propA: Number // or set to `null` to accept any type
     //          // , propB: [ String, Number ] // multiple possible types
     //          // , propC: { type:String, required:true } // a required string
     //          , prop_d: { type:'number', default:100 } // a number with default value
     //          // , propE: { type:Object, default:function(){return[1]} } // must use factory fn
     //          // , propF: { validator:function(v){return v>10} } // custom validator
     //          , propG: 44.4
     //
     //        //// Public instance properties (known as ‘attributes’ in Oom).
     //        }, attr: {
     //
     //            OK: 123
     //
     //          // , propA: Number // or set to `null` to accept any type
     //          // , propB: [ String, Number ] // multiple possible types
     //          // , propC: { type:String, required:true } // a required string
     //          , prop_d: { type:Number, default:5.5 } // a number with default value
     //          // , propE: { type:Object, default:function(){return[1]} } // must use factory fn
     //          // , propF: { validator:function(v){return v>10} } // custom validator
     //          , propG: 44.4
     //
     //        }
     //    })//KIT.normaliseSchema()
     // }//schema


/*
    //// Returns a Promise which is recorded as the `ready` property, after
    //// the constructor() has validated `config` and recorded the config
    //// properties. Sub-classes can override _getReady() if they need to do
    //// other async preparation.
    //// Called by: constructor()
    _getReady () {

        //// setupStart: the time that `new Oom.Dd.Cloud({...})` was called.
        if (this.setupStart)
            throw new Error(`Oom.Dd.Cloud._getReady(): Can only run once`)
        Object.defineProperty(this, 'setupStart', { value:KIT.getNow() })

        //// `Oom.Dd.Cloud` does no setup, so could resolve the `ready`
        //// Promise immediately. However, to make _getReady()’s behavior
        //// consistent with classes which have a slow async setup, we introduce
        //// a miniscule delay.
        return new Promise( (resolve, reject) => { setTimeout( () => {

            //// setupEnd: the time that `_getReady()` finished running.
            Object.defineProperty(this, 'setupEnd', { value:KIT.getNow() })

            //// Define the instance’s `ready` property.
            resolve({
                setupDelay: this.setupEnd - this.setupStart
            })
        }, 0)})

    }




    //// Ensures the `config` argument passed to the `constructor()` is valid.
    //// Called by: constructor()
    _validateConstructor (config) {
        let err, value, ME = `Oom.Dd.Cloud._validateConstructor(): ` // error prefix
        if ('object' !== typeof config)
            throw new Error(ME+`config is type ${typeof config} not object`)
        this.validConstructor.forEach( valid => {
            if (! KIT.applyDefault(valid, config) )
                throw new TypeError(ME+`config.${valid.name} is mandatory`)
            value = config[valid.name]
            if ( err = KIT.validateType(valid, value) )
                throw new TypeError(ME+`config.${valid.name} ${err}`)
            if ( err = KIT.validateRange(valid, value) )
                throw new RangeError(ME+`config.${valid.name} ${err}`)
        })
    }


    //// Defines what the `config` argument passed to the `constructor()`
    //// should look like. Note that all of the `config` values are recorded
    //// as immutable instance properties.
    //// Called by: constructor()
    //// Called by: constructor() > _validateConstructor()
    //// Can also be used to auto-generate unit tests and auto-build GUIs.
    get validConstructor () { return [
        {
            title:   'Third Prop'
          , name:    'thirdProp'
          , alias:   'tp'

          , tooltip: 'An example object property, intended as a placeholder'
          , devtip:  'You should replace this placeholder with a real property'
          , form:    'text'

          , type:    String
          , default: 'Some default text'
        }


    ]}

    xxx (config) {
        const { hub, a, b, c } = this
        const { xx, yy, zz } = config

        ////

    }
*/

}; KIT.name(Class, 'Oom.Dd.Cloud')


//// Define this class’s static and instance properties.
Oom.Dd.Cloud.mixin({
    title: 'The Oom.Dd.Cloud Schema'
  , remarks: 'Defines metadata for this module'
  , location: 'src/main/Cloud.6.js'

  , config: {} //@TODO

    //// Public static properties (known as ‘statics’ in Oom).
  , stat: {

        //// Public constant statics.
        NAME:    'Oom.Dd.Cloud'
      , REMARKS: 'A single cloud, floating in the DD sky'
      , positionX: -0.7
      , positionY: 1.5
      , positionZ: -1.5
      , rotationX: 0
      , rotationY: 0
      , rotationZ: 0
/*
      // , propA: Number // or set to `null` to accept any type
      // , propB: [ String, Number ] // multiple possible types
      // , propC: { type:String, required:true } // a required string
      , prop_d: { type:'number', default:100 } // a number with default value
      // , propE: { type:Object, default:function(){return[1]} } // must use factory fn
      // , propF: { validator:function(v){return v>10} } // custom validator
      , propG: 44.4
*/
    //// Public instance properties (known as ‘attributes’ in Oom).
    }, attr: {
        positionX: 0.7
      , positionY: 1.5
      , positionZ: -1.5
      , rotationX: 0
      , rotationY: 0
      , rotationZ: 0
/*
        OK: 123

      // , propA: Number // or set to `null` to accept any type
      // , propB: [ String, Number ] // multiple possible types
      // , propC: { type:String, required:true } // a required string
      , prop_d: { type:Number, default:5.5 } // a number with default value
      // , propE: { type:Object, default:function(){return[1]} } // must use factory fn
      // , propF: { validator:function(v){return v>10} } // custom validator
      , propG: 44.4
*/
    }

})//Oom.Dd.Cloud.mixin()


/*
////
Oom.Dd.Cloud.devThumbAFrameVueTemplate = function (instance, innerHTML) {
    const pfx = instance.constructor.name.toLowerCase().replace(/\./g, '-')
    return innerHTML = `
<a-entity position="0 0 0">
  <a-${pfx}-devthumb oom-event class="stat"
            :positionx="stat.positionX" :positiony="stat.positionY" :positionz="stat.positionZ"
            :rotationx="stat.rotationX" :rotationy="stat.rotationY" :rotationz="stat.rotationZ"
            :hilite="stat.hilite">
  </a-${pfx}-devthumb>
  <a-${pfx}-devthumb oom-event class="attr"
            :positionx="attr.positionX" :positiony="attr.positionY" :positionz="attr.positionZ"
            :rotationx="attr.rotationX" :rotationy="attr.rotationY" :rotationz="attr.rotationZ"
            :hilite="attr.hilite">
  </a-${pfx}-devthumb>
</a-entity>
`}//Oom.Dd.Cloud.devThumbAFrameVueTemplate()


Oom.Dd.Cloud.devThumbAFrameVue = function (instance) { return {
    template: Oom.Dd.Cloud.devThumbAFrameVueTemplate(instance)
  , data: function () {
        const Class = instance.constructor
        return {
            schema: Class.schema
          , stat: Class.stat
          , attr: instance.attr
        }
    }

} }//Oom.Dd.Cloud.devThumbAFrameVue()



//// Returns on object used for registering an A-Frame component version of Oom.Dd.Cloud.
Oom.Dd.Cloud.devThumbAFrame = function (instanceXXX) { return {
    schema: KIT.oomSchemaToAFrameSchema2(ROOT.Oom.Dd.Cloud.schema)
  , init: function () {
        this.el.setAttribute('material', 'shader:flat; color:pink')
        this.el.setAttribute('position', '0,0,0')
        this.el.setAttribute('rotation', '0,0,0')
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
            hilite:    v => this.el.setAttribute('material', { color:v })
          , positionX: v => this.el.setAttribute('position', { x:v })
          , positionY: v => this.el.setAttribute('position', { y:v })
          , positionZ: v => this.el.setAttribute('position', { z:v })
          , rotationX: v => this.el.setAttribute('rotation', { x:v })
          , rotationY: v => this.el.setAttribute('rotation', { y:v })
          , rotationZ: v => this.el.setAttribute('rotation', { z:v })
        }
        if (! attributes[key])
            return console.warn(`${key} not recognised`)
        attributes[key](this.data[key])
        // console.log(key, this.data[key])
    }

} }//Oom.Dd.Cloud.devThumbAFrame()




////
//// See https://github.com/aframevr/aframe/blob/master/docs/introduction/html-and-primitives.md#registering-a-primitive
Oom.Dd.Cloud.devThumbAFramePrimative = function (instance, aframeComponentName) {
    return AFRAME.utils.extendDeep(
        {} // return a fresh object
      , AFRAME.primitives.getMeshMixin() // for creating mesh-based primitives
      , {
            defaultComponents: { // preset default components
                [aframeComponentName]: {
                    hilite: '#ff0000'
                  , positionX: 0
                  , positionY: 0
                  , positionZ: 0
                  , rotationX: 0
                  , rotationY: 0
                  , rotationZ: 0
                }
              , geometry: { primitive: 'sphere' }
            }
          , mappings: { // from HTML attributes to component properties
                hilite:    aframeComponentName+'.hilite'
              , positionx: aframeComponentName+'.positionX'
              , positiony: aframeComponentName+'.positionY'
              , positionz: aframeComponentName+'.positionZ'
              , rotationx: aframeComponentName+'.rotationX'
              , rotationy: aframeComponentName+'.rotationY'
              , rotationz: aframeComponentName+'.rotationZ'
            }
        }
    )//extendDeep()
}//Oom.devThumbAFramePrimative()
*/



//// PRIVATE FUNCTIONS


//// Place any private functions here.
// function noop () {}




}( 'object' === typeof global ? global : this ) // `window` in a browser
