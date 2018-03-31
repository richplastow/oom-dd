//// Oom.Dd //// 1.0.0 //// March 2018 //// http://oom-dd.richplastow.com/ /////

"use strict";
!function(ROOT) {
  'use strict';
  if ('function' !== typeof jQuery)
    throw Error('jQuery not found');
  jQuery(function($) {
    return console.log('@TODO fix demo');
    var outers = window.outers = [];
    var inners = window.inners = [];
    var template = {};
    template.memberTable = {};
    template.memberTable.innerHTML = "\n<table v-bind:class=\"{ hid: doHide }\">\n<caption v-html=\"caption\"></caption>\n<tr v-for=\"val, key in obj\">\n  <td>{{key}}</td>\n  <td>\n    <input v-if=\"isWritable(obj, key)\" v-model=\"obj[key]\">\n    <span v-else title=\"Read Only\">{{val}}</span>\n  </td>\n</tr>\n</table>";
    template.oomDemo = {};
    template.oomDemo.innerHTML = "\n<div class=\"oom-component container\">\n\n  <!-- The A-Frame scene -->\n  <a-scene embedded vr-mode-ui=\"enabled:false\">\n    <a-assets>\n      <a-mixin id=\"rotate\"\n               attribute=\"rotation\"\n               dur=\"10000\"\n               fill=\"forwards\"\n               to=\"0 360 0\"\n               repeat=\"indefinite\"\n      ></a-mixin>\n    </a-assets>\n    <a-oomfoo position=\"0 1.5 -3\"\n              :firstprop=\"instance.firstProp\"\n              :secondprop=\"instance.secondProp\">\n      <a-animation mixin=\"rotate\"></a-animation>\n    </a-oomfoo>\n  </a-scene>\n\n  <!-- Header and buttons -->\n  <div class=\"row\">\n    <div class=\"col-sm-7 h4\">\n      {{static.NAME}}<em class=\"text-muted\">#{{instance.UUID}}</em>\n      {{instance.index+1}}&nbsp;of&nbsp;{{static.tally}}\n    </div>\n    <div class=\"col-sm-5 rr\">\n      <span class=\"btn btn-sm btn-primary\" @click=\"toggleHideData\">{{ui.hideData ? 'Show' : 'Hide'}} Data</span>\n      <span class=\"btn btn-sm btn-primary\" @click=\"toggleHideInners\">{{ui.hideInners ? 'Show' : 'Hide'}} Inners</span>\n    </div>\n  </div>\n\n  <!-- Class and instance members -->\n  <member-table :obj=\"static\"   :do-hide=\"ui.hideData\"\n    :caption=\"static.NAME+' static data:'\"></member-table>\n  <member-table :obj=\"instance\" :do-hide=\"ui.hideData\"\n    :caption=\"static.NAME+'<em>#'+instance.UUID+'</em>&nbsp; instance data:'\"></member-table>\n\n  <!-- Composition - other instances contained in this Oom.Dd instance -->\n  <div v-bind:class=\"{ hid: ui.hideInners }\">\n    <oom-base-sub v-bind=\"instance\"></oom-base-sub>\n    <oom-base-sub v-bind=\"instance\"></oom-base-sub>\n  </div>\n\n</div>\n";
    template.oomBaseSub = {};
    template.oomBaseSub.innerHTML = "\n<div class=\"oom-component oom-base-sub container\">\n<div class=\"row\">\n<div class=\"col-sm-7 h4\">\n  {{static.NAME}}<em class=\"text-muted\">#{{instance.UUID}}</em>\n  {{instance.index+1}}&nbsp;of&nbsp;{{static.tally}}\n</div>\n<div class=\"col-sm-5 rr\">\n  <span class=\"btn btn-sm btn-primary\" @click=\"toggleHideData\">{{ui.hideData ? 'Show' : 'Hide'}} Data</span>\n</div>\n</div>\n<member-table :obj=\"static\"   :do-hide=\"ui.hideData\"\n:caption=\"static.NAME+' static data:'\"></member-table>\n<member-table :obj=\"instance\" :do-hide=\"ui.hideData\"\n:caption=\"static.NAME+'<em>#'+instance.UUID+'</em>&nbsp; instance data:'\"></member-table>\n<table v-bind:class=\"{ hid: ui.hideData }\">\n<caption>Props, passed from outer components:</caption>\n<tr><td>firstProp</td><td>{{firstProp}}</td></tr>\n<tr><td>UUID</td><td>{{UUID}}</td></tr>\n</table>\n</div>\n";
    AFRAME.registerComponent('oomfoo', {
      schema: apiToAframeSchema(ROOT.Oom.Dd.api),
      init: function() {},
      update: function(oldData) {
        for (var key in AFRAME.utils.diff(oldData, this.data))
          if (oldData[key] !== this.data[key])
            this.updateAttribute(key);
      },
      tick: function() {},
      remove: function() {},
      pause: function() {},
      play: function() {},
      updateAttribute: function(key) {
        var $__3 = this;
        ({
          firstprop: function(v) {
            return $__3.el.setAttribute('material', {color: ['red', 'green', 'blue', 'yellow', '#007bff'][v]});
          },
          secondprop: function(v) {
            return v;
          }
        })[key](this.data[key]);
      }
    });
    var extendDeep = AFRAME.utils.extendDeep;
    var meshMixin = AFRAME.primitives.getMeshMixin();
    AFRAME.registerPrimitive('a-oomfoo', extendDeep({}, meshMixin, {
      defaultComponents: {
        oomfoo: {firstprop: 2},
        geometry: {primitive: 'box'}
      },
      mappings: {
        depth: 'geometry.depth',
        height: 'geometry.height',
        width: 'geometry.width',
        firstprop: 'oomfoo.firstprop',
        secondprop: 'oomfoo.secondprop'
      }
    }));
    Vue.component('member-table', {
      template: template.memberTable.innerHTML,
      props: {
        doHide: Boolean,
        caption: String,
        obj: Object
      },
      methods: {isWritable: isWritable}
    });
    Vue.component('oom-demo', {
      template: template.oomDemo.innerHTML,
      data: function() {
        return {
          instance: outers[outers.length - 1].api,
          static: ROOT.Oom.Dd.api,
          ui: {
            hideData: false,
            hideInners: false
          }
        };
      },
      methods: {
        toggleHideData: toggleHideData,
        toggleHideInners: toggleHideInners
      },
      beforeCreate: function() {
        outers.push(new ROOT.Oom.Dd({
          firstProp: outers.length + 4,
          secondProp: new Date
        }));
      },
      created: function() {
        wrapApiGettersAndSetters(outers[outers.length - 1]);
        wrapApiGettersAndSetters(ROOT.Oom.Dd);
      }
    });
    Vue.component('oom-base-sub', {
      template: template.oomBaseSub.innerHTML,
      data: function() {
        return {
          instance: inners[inners.length - 1].api,
          static: ROOT.Oom.Dd.Cloud.api,
          ui: {hideData: false}
        };
      },
      props: {
        firstProp: Number,
        UUID: String
      },
      methods: {toggleHideData: toggleHideData},
      beforeCreate: function() {
        inners.push(new ROOT.Oom.Dd.Cloud({thirdProp: 'inners.length: ' + inners.length}));
      },
      created: function() {
        wrapApiGettersAndSetters(outers[outers.length - 1]);
        wrapApiGettersAndSetters(ROOT.Oom.Dd.Cloud);
      }
    });
    new Vue({el: '#demo'});
    function toggleHideData() {
      this.ui.hideData = !this.ui.hideData;
    }
    function toggleHideInners() {
      this.ui.hideInners = !this.ui.hideInners;
    }
    function isWritable(obj, key) {
      if (!obj.hasOwnProperty(key))
        console.log(obj, 'has no', key);
      return false !== Object.getOwnPropertyDescriptor(obj, key).writable;
    }
    function wrapApiGettersAndSetters(obj) {
      var $__5 = function(propName) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(obj.api, propName);
        var vueReactiveGetter = propertyDescriptor.get;
        var vueReactiveSetter = propertyDescriptor.set;
        if (!vueReactiveGetter) {
          return 0;
        }
        if ('wrappedGetter' === vueReactiveGetter.name)
          return 1;
        var wrappedGetter = function wrappedGetter() {
          var val = vueReactiveGetter();
          return val;
        };
        var wrappedSetter = function wrappedSetter(val) {
          if ('firstProp' === propName || 'index' === propName)
            val = +val;
          return vueReactiveSetter(val);
        };
        Object.defineProperty(obj.api, propName, {
          configurable: true,
          enumerable: true,
          get: wrappedGetter,
          set: wrappedSetter
        });
      },
          $__6;
      $__4: for (var propName in obj.api) {
        $__6 = $__5(propName);
        switch ($__6) {
          case 0:
            continue $__4;
          case 1:
            continue $__4;
        }
      }
    }
    function apiToAframeSchema(api) {
      return {
        firstprop: {
          type: 'nnint',
          default: 3
        },
        secondprop: {type: 'string'}
      };
    }
  });
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);




//// Made by Oomtility Make 1.3.7 //\\//\\ http://oomtility.loop.coop //////////
