//// Oom.Dd //// 1.0.0 //// March 2018 //// http://oom-dd.richplastow.com/ /////

"use strict";
!function(ROOT) {
  'use strict';
  var META = {
    NAME: 'Oom.Dd',
    VERSION: '1.0.0',
    HOMEPAGE: 'http://oom-dd.richplastow.com/',
    REMARKS: 'A VR website for Developing Dreams',
    LOADED_FIRST: !ROOT.Oom
  };
  var KIT = assignKIT(META.LOADED_FIRST || !ROOT.Oom.KIT ? {} : ROOT.Oom.KIT);
  var Oom = ROOT.Oom = META.LOADED_FIRST ? function() {
    function Oom() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
      var ME = 'Oom:constructor(): ';
      var Class = this.constructor;
      var attrSchema = Class.schema.attr;
      var attr = this.attr = {};
      for (var key in attrSchema) {
        var def = attrSchema[key];
        if (KIT.isConstant(key))
          KIT.define.constant.attr(attr, def, this);
        else if (KIT.isReadOnly(key))
          KIT.define.readOnly.attr(attr, def, this);
        else if (KIT.isReadWrite(key))
          KIT.define.readWrite.attr(attr, def, this);
        else
          throw Error(ME + key + ' is an invalid attribute name');
      }
    }
    return ($traceurRuntime.createClass)(Oom, {reset: function() {
        var attrSchema = this.constructor.schema.attr;
        for (var key in attrSchema) {
          if (KIT.isConstant(key))
            continue;
          var def = attrSchema[key];
          if (KIT.isReadOnly(key))
            this.attr['_' + key] = def.default;
          else
            this.attr[key] = def.default;
        }
      }}, {
      reset: function() {
        var statSchema = this.schema.stat;
        for (var key in statSchema) {
          if (KIT.isConstant(key))
            continue;
          var def = statSchema[key];
          var shadowObj = def.perClass ? this.stat : def.definedIn.stat;
          if (KIT.isReadOnly(key))
            shadowObj['_' + key] = def.default;
          else
            shadowObj[key] = def.default;
        }
      },
      mixin: function(shorthandSchema) {
        var ME = 'Oom.mixin(): ';
        var existing = this.schema;
        var normalised = KIT.normaliseSchema(this, shorthandSchema);
        this.schema = {};
        this.schema.stat = Object.assign({}, existing.stat, normalised.stat);
        this.schema.attr = Object.assign({}, existing.attr, normalised.attr);
        var stat = this.stat = {};
        for (var key in this.schema.stat) {
          var def = this.schema.stat[key];
          if (KIT.isConstant(key))
            KIT.define.constant.stat(stat, def);
          else if (KIT.isReadOnly(key))
            KIT.define.readOnly.stat(stat, def);
          else if (KIT.isReadWrite(key))
            KIT.define.readWrite.stat(stat, def);
          else
            throw Error(ME + key + ' is an invalid static name');
        }
      }
    });
  }() : ROOT.Oom;
  KIT.name(Oom, 'Oom');
  Oom.KIT = KIT;
  if (META.LOADED_FIRST) {
    Oom.schema = {};
    Oom.mixin({
      title: 'The Base Schema',
      remarks: 'The foundational schema, defined by the base Oom class',
      location: 'src/main/Bases.6.js',
      config: {},
      stat: {
        NAME: 'Oom',
        VERSION: META.VERSION,
        HOMEPAGE: 'http://oom.loop.coop/',
        REMARKS: 'Base class for all Oom classes',
        inst_tally: {
          remarks: 'The number of Oom instantiations made so far',
          default: 0
        },
        hilite: {
          remarks: 'General purpose, useful as a dev label or status',
          default: '#112233',
          type: 'color'
        }
      },
      attr: {
        UUID: {
          remarks: 'Every Oom instance gets a universally unique ID',
          default: KIT.generateUUID,
          type: 'string'
        },
        INST_INDEX: {
          remarks: 'Every Oom instance gets an instance index, which ' + 'equals its class’s `inst_tally` at the moment of ' + 'instantiation. As a side effect of recording ' + '`INST_INDEX`, `inst_tally` is incremented',
          default: function(instance) {
            return (++instance.constructor.stat._inst_tally) - 1;
          },
          type: 'nnint'
        },
        hilite: {
          remarks: 'General purpose, useful as a dev label or status',
          default: '#445566',
          type: 'color'
        },
        fooBar: {
          default: 1000,
          type: Number
        }
      }
    });
  }
  Object.defineProperty(Oom, 'memberTableVueTemplate', {get: function(innerHTML) {
      return innerHTML = "\n<div :class=\"'member-table '+objname\">\n  <table :class=\"{ hid:doHide }\">\n    <caption v-html=\"caption\"></caption>\n    <tr>\n      <th>Name</th>\n      <th>Value</th>\n      <th>Defined In</th>\n      <th>Type</th>\n      <th>Default</th>\n    </tr>\n    <tr v-for=\"val, key in obj\" v-bind:class=\"'Oom-'+key\">\n      <td class=\"key\">{{key}}</td>\n      <td class=\"val\">\n        <input v-if=\"isReadWrite(key)\"    class=\"read-write\" v-model=\"obj[key]\">\n        <span v-else-if=\"isReadOnly(key)\" class=\"read-only\">{{val}}</span>\n        <span v-else-if=\"isConstant(key)\" class=\"constant\">{{val}}</span>\n        <span v-else                      class=\"private\">{{val}}</span>\n      </td>\n      <td class=\"defined-in\">{{schema[key] ? schema[key].definedInStr : '-'}}</td>\n      <td class=\"type\">{{schema[key] ? schema[key].typeStr : '-'}}</td>\n      <td class=\"is-default\">{{schema[key] ? schema[key].isFn ? 'fn' : schema[key].default === val ? '√' : 'x' : '-'}}</td>\n    </tr>\n  </table>\n</div>\n";
    }});
  Object.defineProperty(Oom, 'devMainVueTemplate', {get: function(innerHTML) {
      return innerHTML = "\n<div class=\"dev-main col-12\">\n  <h4>{{stat.NAME}}<em>#{{attr.UUID}}</em></h4>\n  <member-table :schema=\"schema.stat\" :obj=\"stat\" objname=\"stat\"\n    :do-hide=\"ui.hideData\"\n    :caption=\"'<b style=color:'+stat.hilite+'>&#11044;</b> Static'\">\n  </member-table>\n  <member-table :schema=\"schema.attr\" :obj=\"attr\" objname=\"attr\"\n    :do-hide=\"ui.hideData\"\n    :caption=\"'<b style=color:'+attr.hilite+'>&#11044;</b> Attribute'\">\n  </member-table>\n</div>\n";
    }});
  Oom.devMainVue = function(instance) {
    return {
      template: Oom.devMainVueTemplate,
      data: function() {
        var Class = instance.constructor;
        return {
          schema: Class.schema,
          stat: Class.stat,
          attr: instance.attr,
          ui: {
            hideData: false,
            hideInners: false
          }
        };
      },
      methods: {},
      beforeCreate: function() {
        var $__4 = KIT,
            isReadWrite = $__4.isReadWrite,
            isReadOnly = $__4.isReadOnly,
            isConstant = $__4.isConstant,
            stringOrName = $__4.stringOrName;
        Vue.component('member-table', {
          template: Oom.memberTableVueTemplate,
          props: {
            doHide: Boolean,
            caption: String,
            schema: Object,
            obj: Object,
            objname: String
          },
          methods: {
            isReadWrite: isReadWrite,
            isReadOnly: isReadOnly,
            isConstant: isConstant,
            stringOrName: stringOrName
          }
        });
      },
      created: function() {
        KIT.wrapReadOnly(ROOT.Oom.stat);
      }
    };
  };
  Oom.devThumbAFrameVueTemplate = function(instance, innerHTML) {
    var pfx = instance.constructor.name.toLowerCase().replace(/\./g, '-');
    return innerHTML = ("\n<a-entity position=\"0 10 0\">\n  <a-" + pfx + "-devthumb oom-event class=\"stat\"\n            position=\"-0.7 1.5 -1.5\"\n            :hilite=\"stat.hilite\">\n    <a-animation mixin=\"rotate\"></a-animation>\n  </a-" + pfx + "-devthumb>\n  <a-" + pfx + "-devthumb oom-event class=\"attr\"\n            position=\"0.7 1.5 -1.5\"\n            :hilite=\"attr.hilite\">\n    <a-animation mixin=\"rotate\"></a-animation>\n  </a-" + pfx + "-devthumb>\n</a-entity>\n<!--\n            :material=\"'shader:flat; color:'+attr.hilite\">\n  <a-box oom-event class=\"stat\"\n         position=\"-0.7 1.5 -1.5\" :material=\"'shader:flat; color:'+stat.hilite\">\n    <a-animation mixin=\"rotate\"></a-animation>\n  </a-box>\n  <a-box oom-event class=\"attr\"\n         position=\"0.7 1.5 -1.5\" :material=\"'shader:flat; color:'+attr.hilite\">\n    <a-animation mixin=\"rotate\"></a-animation>\n  </a-box>\n-->\n");
  };
  Oom.devThumbAFrameVue = function(instance) {
    return {
      template: Oom.devThumbAFrameVueTemplate(instance),
      data: function() {
        var Class = instance.constructor;
        return {
          schema: Class.schema,
          stat: Class.stat,
          attr: instance.attr
        };
      }
    };
  };
  Oom.devThumbAFrame = function(instanceXXX) {
    return {
      schema: KIT.oomSchemaToAFrameSchema(ROOT.Oom.schema),
      init: function() {
        this.el.setAttribute('material', 'shader:flat; color:pink');
      },
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
        var $__2 = this;
        var attributes = {hilite: function(v) {
            return $__2.el.setAttribute('material', {color: v});
          }};
        if (!attributes[key])
          return console.warn((key + " not recognised"));
        attributes[key](this.data[key]);
      }
    };
  };
  Oom.devThumbAFramePrimative = function(instance, aframeComponentName) {
    var $__3;
    return AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
      defaultComponents: ($__3 = {}, Object.defineProperty($__3, aframeComponentName, {
        value: {hilite: '#ff0000'},
        configurable: true,
        enumerable: true,
        writable: true
      }), Object.defineProperty($__3, "geometry", {
        value: {primitive: 'box'},
        configurable: true,
        enumerable: true,
        writable: true
      }), $__3),
      mappings: {hilite: aframeComponentName + '.hilite'}
    });
  };
  Oom.Dd = function($__super) {
    function $__1() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
      $traceurRuntime.superConstructor($__1).call(this, config);
    }
    return ($traceurRuntime.createClass)($__1, {}, {}, $__super);
  }(Oom);
  KIT.name(Oom.Dd, 'Oom.Dd');
  Oom.Dd.mixin({
    title: 'The Oom.Dd Schema',
    remarks: 'Defines metadata for this module',
    location: 'src/main/Bases.6.js',
    config: {},
    stat: META,
    attr: {}
  });
  function assignKIT() {
    var previousKIT = arguments[0] !== (void 0) ? arguments[0] : {};
    return Object.assign({}, {
      generateUUID: function() {
        var rndCh = function(s, e) {
          return String.fromCharCode(Math.random() * (e - s) + s);
        };
        return 'x'.repeat(6).replace(/./g, function(c) {
          return rndCh(48, 122);
        }).replace(/[:-@\\[-\`]/g, function(c) {
          return rndCh(97, 122);
        });
      },
      applyDefault: function(valid, config) {
        if (config.hasOwnProperty(valid.name))
          return true;
        if (!valid.hasOwnProperty('default'))
          return false;
        config[valid.name] = 'function' === typeof valid.default ? valid.default(config) : valid.default;
        return true;
      },
      validateType: function(valid, value) {
        var ME = 'KIT.validateType: ',
            C = 'constructor';
        if (null === valid.type)
          return (null === value) ? null : "is not null";
        if ('undefined' === typeof valid.type)
          return ('undefined' === typeof value) ? null : "is not undefined";
        if (!valid.type.name)
          throw TypeError(ME + valid.name + "’s valid.type has no name");
        if (!value[C] || !value[C].name)
          throw TypeError(ME + valid.name + ("’s value has no " + C + ".name"));
        return (valid.type.name === value[C].name) ? null : ("has " + C + ".name " + value[C].name + " not " + valid.type.name);
      },
      validateRange: function(valid, value) {
        if (null != valid.min && valid.min > value)
          return ("is less than the minimum " + valid.min);
        if (null != valid.max && valid.max < value)
          return ("is greater than the maximum " + valid.max);
        if (null != valid.step && ((value / valid.step) % 1))
          return (value + " ÷ " + valid.step + " leaves " + (value / valid.step) % 1);
      },
      isValid: function(valid, value) {
        var PFX = 'KIT.isValid: ' + valid.name + '’s ';
        if ('string' === typeof valid.type)
          switch (valid.type) {
            case 'undefined':
              return valid.type === (typeof value === 'undefined' ? 'undefined' : $traceurRuntime.typeof(value));
            case 'color':
              return /^#[0-9a-fA-F]{6}$/.test(value);
            case 'nnint':
              return Number.isInteger(value);
            case 'null':
              return null === value;
            default:
              throw TypeError(PFX + ("valid.type is '" + valid.type + "'"));
          }
        if (Number === valid.type)
          return 'number' === typeof value && !Number.isNaN(value);
        if (null === valid.type)
          return null === value;
        if ('undefined' === typeof valid.type)
          return 'undefined' === typeof value;
        if (!valid.type.name)
          throw TypeError(PFX + "valid.type has no name");
        if (!value.constructor || !value.constructor.name)
          throw TypeError(PFX + "value has no constructor.name");
        return valid.type.name === value.constructor.name;
      },
      getNow: function() {
        var now;
        if ('object' === $traceurRuntime.typeof(ROOT.process) && 'function' === typeof ROOT.process.hrtime) {
          var hrtime = ROOT.process.hrtime();
          now = ((hrtime[0] * 1e9) + hrtime[1]) / 1e6;
        } else {
          now = ROOT.performance.now();
        }
        return now;
      },
      define: {
        constant: {
          stat: function(stat, def) {
            return KIT.define.constant.any(stat, def);
          },
          attr: function(attr, def, instance) {
            if (def.isFn) {
              var value = def.default(instance);
              Object.defineProperty(attr, def.name, {
                get: function() {
                  return value;
                },
                set: function(value) {},
                configurable: true,
                enumerable: true
              });
            } else {
              KIT.define.constant.any(attr, def);
            }
          },
          any: function(obj, def) {
            return Object.defineProperty(obj, def.name, {
              value: def.default,
              configurable: false,
              enumerable: true,
              writable: false
            });
          }
        },
        readOnly: {
          stat: function(stat, def) {
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            KIT.define.shadow(shadowObj, def);
            KIT.define.readOnly.any(stat, def, shadowObj);
          },
          attr: function(attr, def) {
            KIT.define.shadow(attr, def);
            KIT.define.readOnly.any(attr, def, attr);
          },
          any: function(obj, def, shadowObj) {
            return Object.defineProperty(obj, def.name, {
              get: function() {
                return shadowObj['_' + def.name];
              },
              set: function(value) {},
              configurable: true,
              enumerable: true
            });
          }
        },
        readWrite: {
          stat: function(stat, def) {
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            KIT.define.shadow(shadowObj, def);
            KIT.define.readWrite.any(stat, def, shadowObj);
          },
          attr: function(attr, def) {
            KIT.define.shadow(attr, def);
            KIT.define.readWrite.any(attr, def, attr);
          },
          any: function(obj, def, shadowObj) {
            return Object.defineProperty(obj, def.name, {
              get: function() {
                return shadowObj['_' + def.name];
              },
              set: function(value) {
                if (KIT.isValid(def, value))
                  return shadowObj['_' + def.name] = value;
                if ('function' !== typeof def.type)
                  return;
                var castValue = def.type(value);
                if (KIT.isValid(def, castValue))
                  return shadowObj['_' + def.name] = castValue;
              },
              configurable: true,
              enumerable: true
            });
          }
        },
        shadow: function(shadowObj, def) {
          return Object.defineProperty(shadowObj, '_' + def.name, {
            value: def.default,
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
      },
      name: function(obj, value) {
        return Object.defineProperty(obj, 'name', {
          value: value,
          configurable: false
        });
      },
      wrapReadOnly: function(obj) {},
      countKeyMatches: function(obj, matchFn) {
        var tally = arguments[2] !== (void 0) ? arguments[2] : 0;
        for (var key in obj)
          if (matchFn(key))
            tally++;
        return tally;
      },
      stringOrName: function(val) {
        return 'string' === typeof val ? val : val.name;
      },
      isConstant: function(k) {
        return /^[A-Z][_A-Z0-9]*$/.test(k);
      },
      isReadOnly: function(k) {
        return -1 !== k.indexOf('_') && /^[a-z][_a-z0-9]+$/.test(k);
      },
      isReadWrite: function(k) {
        return /^[a-z][A-Za-z0-9]*$/.test(k);
      },
      normaliseSchema: function(Class, schema) {
        var out = {};
        for (var zone in schema) {
          out[zone] = {};
          for (var propName in schema[zone]) {
            var PFX = 'KIT.normaliseSchema: ' + propName + '’s ';
            var inDesc = schema[zone][propName];
            var outDesc = out[zone][propName] = {};
            outDesc.name = propName;
            outDesc.default = 'object' === (typeof inDesc === 'undefined' ? 'undefined' : $traceurRuntime.typeof(inDesc)) ? inDesc.default : inDesc;
            outDesc.isFn = 'function' === typeof outDesc.default;
            var strToObj = {
              array: Array,
              boolean: Boolean,
              function: Function,
              number: Number,
              object: Object,
              string: String,
              symbol: Symbol
            };
            var validStr = {
              undefined: 1,
              color: 1,
              nnint: 1,
              null: 1
            };
            if (!inDesc.hasOwnProperty('type'))
              outDesc.type = outDesc.default.constructor;
            else if (strToObj[inDesc.type])
              outDesc.type = strToObj[inDesc.type];
            else if (validStr[inDesc.type])
              outDesc.type = inDesc.type;
            else {
              if ('function' !== typeof inDesc.type)
                throw TypeError(PFX + "inDesc.type is not a string or a function");
              if (!inDesc.type.name)
                throw TypeError(PFX + "inDesc.type has no name");
              outDesc.type = inDesc.type;
            }
            outDesc.typeStr = KIT.stringOrName(outDesc.type);
            outDesc.definedIn = Class;
            outDesc.definedInStr = Class.name;
            outDesc.perClass = null == inDesc.perClass ? true : inDesc.perClass;
            outDesc.remarks = inDesc.remarks || 'A' + (/^[aeiou]/.test(outDesc.typeStr) ? 'n ' : ' ') + outDesc.typeStr;
          }
        }
        return out;
      },
      oomSchemaToAFrameSchema: function(oomSchema) {
        return {hilite: {
            type: 'color',
            default: '#ff00ff'
          }};
      }
    }, previousKIT);
  }
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);




//// Made by Oomtility Make 1.3.7 //\\//\\ http://oomtility.loop.coop //////////
