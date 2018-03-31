${{topline}}

!function (ROOT) { 'use strict'
if ('function' !== typeof jQuery) throw Error('jQuery not found')
jQuery( function($) {
return console.log('@TODO fix demo');

//// Instance containers.
const outers = window.outers = [] //@TODO remove `window.outers = `
const inners = window.inners = [] //@TODO remove `window.inners = `




//// TEMPLATES


//// Templates are coded as `template.scene.innerHTML = `...` to switch on HTML
//// highlighting in Atom.
const template = {}


//// <member-table> shows a table of class and instance members.
template.memberTable = {}; template.memberTable.innerHTML = `
<table v-bind:class="{ hid: doHide }">
<caption v-html="caption"></caption>
<tr v-for="val, key in obj">
  <td>{{key}}</td>
  <td>
    <input v-if="isWritable(obj, key)" v-model="obj[key]">
    <span v-else title="Read Only">{{val}}</span>
  </td>
</tr>
</table>`


//// All A-Frame components must already be registered by the time the scene
//// appears in the DOM. This `oomDemo` template contains the <a-scene>, and it
//// will only appear in the DOM when we run `new Vue({ el: '#demo' })` below,
//// which happens AFTER our Oom A-Frame components have been registered.
template.oomDemo = {}; template.oomDemo.innerHTML = `
<div class="oom-component container">

  <!-- The A-Frame scene -->
  <a-scene embedded vr-mode-ui="enabled:false">
    <a-assets>
      <a-mixin id="rotate"
               attribute="rotation"
               dur="10000"
               fill="forwards"
               to="0 360 0"
               repeat="indefinite"
      ></a-mixin>
    </a-assets>
    <a-oomfoo position="0 1.5 -3"
              :firstprop="instance.firstProp"
              :secondprop="instance.secondProp">
      <a-animation mixin="rotate"></a-animation>
    </a-oomfoo>
  </a-scene>

  <!-- Header and buttons -->
  <div class="row">
    <div class="col-sm-7 h4">
      {{static.NAME}}<em class="text-muted">#{{instance.UUID}}</em>
      {{instance.index+1}}&nbsp;of&nbsp;{{static.tally}}
    </div>
    <div class="col-sm-5 rr">
      <span class="btn btn-sm btn-primary" @click="toggleHideData">{{ui.hideData ? 'Show' : 'Hide'}} Data</span>
      <span class="btn btn-sm btn-primary" @click="toggleHideInners">{{ui.hideInners ? 'Show' : 'Hide'}} Inners</span>
    </div>
  </div>

  <!-- Class and instance members -->
  <member-table :obj="static"   :do-hide="ui.hideData"
    :caption="static.NAME+' static data:'"></member-table>
  <member-table :obj="instance" :do-hide="ui.hideData"
    :caption="static.NAME+'<em>#'+instance.UUID+'</em>&nbsp; instance data:'"></member-table>

  <!-- Composition - other instances contained in this ${{projectTC}} instance -->
  <div v-bind:class="{ hid: ui.hideInners }">
    <oom-base-sub v-bind="instance"></oom-base-sub>
    <oom-base-sub v-bind="instance"></oom-base-sub>
  </div>

</div>
`


////
template.oomBaseSub = {}; template.oomBaseSub.innerHTML = `
<div class="oom-component oom-base-sub container">
<div class="row">
<div class="col-sm-7 h4">
  {{static.NAME}}<em class="text-muted">#{{instance.UUID}}</em>
  {{instance.index+1}}&nbsp;of&nbsp;{{static.tally}}
</div>
<div class="col-sm-5 rr">
  <span class="btn btn-sm btn-primary" @click="toggleHideData">{{ui.hideData ? 'Show' : 'Hide'}} Data</span>
</div>
</div>
<member-table :obj="static"   :do-hide="ui.hideData"
:caption="static.NAME+' static data:'"></member-table>
<member-table :obj="instance" :do-hide="ui.hideData"
:caption="static.NAME+'<em>#'+instance.UUID+'</em>&nbsp; instance data:'"></member-table>
<table v-bind:class="{ hid: ui.hideData }">
<caption>Props, passed from outer components:</caption>
<tr><td>firstProp</td><td>{{firstProp}}</td></tr>
<tr><td>UUID</td><td>{{UUID}}</td></tr>
</table>
</div>
`




//// AFRAME


//// Register 'oomfoo', an A-Frame component version of ${{projectTC}}.
AFRAME.registerComponent('oomfoo', {
    schema: apiToAframeSchema(ROOT.${{projectTC}}.api)
  , init: function () {}
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
        ({
            firstprop: v => this.el.setAttribute('material', {
                color: ['red','green','blue','yellow','#007bff'][v]
            })
          , secondprop: v => v
        })[key](this.data[key])
    }

})


////
//// See https://github.com/aframevr/aframe/blob/master/docs/introduction/html-and-primitives.md#registering-a-primitive
const extendDeep = AFRAME.utils.extendDeep
const meshMixin = AFRAME.primitives.getMeshMixin() // for creating mesh-based primitives

AFRAME.registerPrimitive('a-oomfoo', extendDeep({}, meshMixin, {
    defaultComponents: { // preset default components
        oomfoo: { firstprop: 2 }
      , geometry: { primitive: 'box' }
    }
  , mappings: { // from HTML attributes to component properties
        depth: 'geometry.depth'
      , height: 'geometry.height'
      , width: 'geometry.width'
      , firstprop: 'oomfoo.firstprop'
      , secondprop: 'oomfoo.secondprop'
    }
}))




//// VUE


//// Register <member-table>, which shows a table of class and instance members.
Vue.component('member-table', {
    template: template.memberTable.innerHTML
  , props: {
        doHide: Boolean
      , caption: String
      , obj: Object
    }
  , methods: {
        isWritable
    }
})


//// Register <oom-demo>, the Vue component which contains this demo.
Vue.component('oom-demo', {
    template: template.oomDemo.innerHTML
  , data: function () { return {
        instance: outers[outers.length-1].api
      , static: ROOT.${{projectTC}}.api
      , ui: { hideData:false, hideInners:false }
    } }

  , methods: {
        toggleHideData
      , toggleHideInners
    }

    //// Generate an instance of ${{projectTC}}.
  , beforeCreate: function () {
        outers.push( new ROOT.${{projectTC}}({
            firstProp: outers.length + 4
          , secondProp: new Date
        }) )
    }

    //// Wrap Vue’s reactive getters and setters with our own.
  , created: function () {
        wrapApiGettersAndSetters(outers[outers.length-1])
        wrapApiGettersAndSetters(ROOT.${{projectTC}})
    }

})


//// Register <a-oomfoo-wrap>, to tell Vue about the A-Frame primative for ${{projectTC}}.
// Vue.component('a-oomfoo-wrap', {
//     template: template.aOomfoo.innerHTML
//   , data: function () { return {
//         instance: outers[outers.length-1].api
//       , static: ROOT.${{projectTC}}.api
//     } }
// })


//// Register <oom-base-sub>, a Vue component version of ${{classname}}.
Vue.component('oom-base-sub', {
    template: template.oomBaseSub.innerHTML
  , data: function () { return {
        instance: inners[inners.length-1].api
      , static: ROOT.${{classname}}.api
      , ui: { hideData:false }
    } }

  , props: {
        firstProp: Number
      , UUID: String
    }

  , methods: {
        toggleHideData
    }

    //// Generate an instance of ${{classname}}.
  , beforeCreate: function () {
        inners.push( new ROOT.${{classname}}({
            thirdProp: 'inners.length: ' + inners.length
        }) )
    }

    //// Wrap Vue’s reactive getters and setters with our own.
  , created: function () {
        wrapApiGettersAndSetters(outers[outers.length-1])
        wrapApiGettersAndSetters(ROOT.${{classname}})
    }
})


//// Create the root instance for the demo.
new Vue({ el: '#demo' })




//// COMPONENT METHODS


function toggleHideData () {
    this.ui.hideData = ! this.ui.hideData;
}
function toggleHideInners () {
    this.ui.hideInners = ! this.ui.hideInners;
}
function isWritable (obj, key) {
    // console.log(obj.NAME, key)
    if (! obj.hasOwnProperty(key)) console.log(obj, 'has no', key);
    return false !== Object.getOwnPropertyDescriptor(obj, key).writable
}




//// UTILITY


function wrapApiGettersAndSetters (obj) {
    for (let propName in obj.api) {
        const propertyDescriptor =
            Object.getOwnPropertyDescriptor(obj.api, propName)
        const vueReactiveGetter = propertyDescriptor.get
        const vueReactiveSetter = propertyDescriptor.set
        if (! vueReactiveGetter) { continue } // probably a non-writable property
        if ('wrappedGetter' === vueReactiveGetter.name) continue //@TODO more graceful way of avoiding double-wrap
        const wrappedGetter = function wrappedGetter () {
            const val = vueReactiveGetter()
            // console.log('get ' + propName + ' ' + val);
            return val
        }
        const wrappedSetter = function wrappedSetter (val) {
            if ('firstProp' === propName || 'index' === propName) val = +val //@TODO automate type casting from string
            // console.log('Set ' + propName + ' to ' + val);
            return vueReactiveSetter(val)
        }
        // console.log('wrapped '+propName+' on '+obj.api.UUID)
        Object.defineProperty(obj.api, propName, {
            configurable:true, enumerable:true
          , get: wrappedGetter
          , set: wrappedSetter
        })
    }
}


function apiToAframeSchema (api) {
    return {
        firstprop:  { type:'nnint', default:3 }
      , secondprop: { type:'string' }
    }
}




})//jQuery()
}( 'object' === typeof global ? global : this ) // `window` in a browser
