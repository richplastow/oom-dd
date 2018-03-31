//// Oom.Dd //// 1.0.1 //// March 2018 //// http://oom-dd.richplastow.com/ /////

"use strict";
!function(ROOT) {
  'use strict';
  ROOT.testify = testify;
  if (false)
    return;
  var $__2 = ROOT.testify(),
      describe = $__2.describe,
      it = $__2.it,
      eq = $__2.eq,
      neq = $__2.neq,
      is = $__2.is,
      trySoftSet = $__2.trySoftSet,
      tryHardSet = $__2.tryHardSet,
      goodVals = $__2.goodVals,
      badVals = $__2.badVals;
  var $__3 = Oom.KIT,
      countKeyMatches = $__3.countKeyMatches,
      isConstant = $__3.isConstant,
      isReadOnly = $__3.isReadOnly,
      isReadWrite = $__3.isReadWrite,
      isValid = $__3.isValid;
  describe('Oom (all)', function() {
    describe('The Oom class', function() {
      var Class = ROOT.Oom,
          schema = Class.schema,
          stat = Class.stat;
      it('is a class with base methods', function() {
        try {
          eq((typeof Class === 'undefined' ? 'undefined' : $traceurRuntime.typeof(Class)), 'function', '`typeof Oom` is a function');
          eq($traceurRuntime.typeof(Class.reset), 'function', 'Oom.reset() is a static method');
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var n = countKeyMatches(schema.stat, isConstant);
      it(("has " + n + " constant static" + (1 == n ? '' : 's')), function() {
        try {
          tryHardSet(Class, 'name', 'Changed!');
          eq(Class.name, 'Oom', 'name is Oom');
          for (var key in schema.stat) {
            if (!isConstant(key))
              continue;
            var def = schema.stat[key];
            tryHardSet(stat, key, goodVals[def.typeStr]);
            eq(stat[key], def.default, 'stat.' + key + ' is ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.stat, isReadOnly);
      it(("has " + n + " read-only static" + (1 == n ? '' : 's')), function() {
        try {
          Class.reset();
          for (var key in schema.stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            stat[key] = goodVals[def.typeStr];
            eq(stat[key], def.default, 'stat.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('sees when read-only statics change', function() {
        try {
          for (var key in schema.stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            var good = goodVals[def.typeStr];
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            shadowObj['_' + key] = good;
            eq(stat[key], good, 'stat.' + key + ' has changed to ' + good);
            Class.reset();
            eq(stat[key], def.default, 'stat.' + key + ' has been reset to ' + def.default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.stat, isReadWrite);
      it(("has " + n + " read-write static" + (1 == n ? '' : 's')), function() {
        try {
          for (var key in schema.stat) {
            if (!isReadWrite(key))
              continue;
            var def = schema.stat[key];
            eq(stat[key], def.default, 'stat.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('allows read-write statics to be changed', function() {
        try {
          for (var key in schema.stat) {
            if (!isReadWrite(key))
              continue;
            var good = goodVals[schema.stat[key].typeStr];
            var bad = badVals[schema.stat[key].typeStr];
            stat[key] = good;
            eq(stat[key], good, 'stat.' + key + ' has changed to ' + good);
            stat[key] = bad;
            eq(stat[key], good, 'stat.' + key + ' has NOT changed to ' + bad);
            Class.reset();
            eq(stat[key], schema.stat[key].default, 'stat.' + key + ' has been reset to ' + schema.stat[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
    });
    describe('An Oom instance', function() {
      var Class = ROOT.Oom,
          schema = Class.schema,
          instance = new Class(),
          attr = instance.attr,
          unchanged = new Class();
      it('is an instance with base methods', function() {
        try {
          is(instance instanceof Class, 'is an instance of Oom');
          eq(Class, instance.constructor, '`constructor` is Oom');
          eq($traceurRuntime.typeof(instance.reset), 'function', 'myOom.reset() is an instance method');
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var n = countKeyMatches(schema.attr, function(key) {
        return isConstant(key) && schema.attr[key].isFn;
      });
      it(("has " + n + " constant attribute" + (1 == n ? '' : 's') + " from function"), function() {
        try {
          for (var key in schema.attr) {
            var def = schema.attr[key];
            if (!isConstant(key) || !def.isFn)
              continue;
            var origValue = attr[key];
            trySoftSet(attr, key, goodVals[def.typeStr]);
            eq(attr[key], origValue, 'attr.' + key + ' remains ' + origValue.toString() + ' after simple set');
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, function(key) {
        return isConstant(key) && !schema.attr[key].isFn;
      });
      it(("has " + n + " constant attribute" + (1 == n ? '' : 's') + " NOT from function"), function() {
        try {
          for (var key in schema.attr) {
            var def = schema.attr[key];
            if (!isConstant(key) || def.isFn)
              continue;
            tryHardSet(attr, key, goodVals[def.typeStr]);
            eq(attr[key], def.default, 'attr.' + key + ' is ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, isReadOnly);
      it(("has " + n + " read-only attribute" + (1 == n ? '' : 's')), function() {
        try {
          instance.reset();
          for (var key in schema.attr) {
            if (!isReadOnly(key))
              continue;
            var def = schema.attr[key];
            attr[key] = goodVals[def.typeStr];
            eq(attr[key], def.default, 'attr.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('sees when read-only attributes change', function() {
        try {
          for (var key in schema.attr) {
            if (!isReadOnly(key))
              continue;
            var good = goodVals[schema.attr[key].typeStr];
            attr['_' + key] = good;
            eq(attr[key], good, 'attr.' + key + ' has changed to ' + good);
            neq(unchanged.attr[key], good, 'unchanged.attr.' + key + ' has NOT changed to ' + good);
            instance.reset();
            unchanged.reset();
            eq(attr[key], schema.attr[key].default, 'attr.' + key + ' has been reset to ' + schema.attr[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, isReadWrite);
      it(("has " + n + " read-write attribute" + (1 == n ? '' : 's')), function() {
        try {
          for (var key in schema.attr) {
            if (!isReadWrite(key))
              continue;
            var def = schema.attr[key];
            eq(attr[key], def.default, 'attr.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('allows read-write attributes to be changed', function() {
        try {
          for (var key in schema.attr) {
            if (!isReadWrite(key))
              continue;
            var good = goodVals[schema.attr[key].typeStr];
            var bad = badVals[schema.attr[key].typeStr];
            attr[key] = good;
            eq(attr[key], good, 'attr.' + key + ' has changed to ' + good);
            neq(unchanged.attr[key], good, 'unchanged.attr.' + key + ' has NOT changed to ' + good);
            attr[key] = bad;
            eq(attr[key], good, 'attr.' + key + ' has NOT changed to ' + bad);
            neq(unchanged.attr[key], bad, 'unchanged.attr.' + key + ' has NOT changed to ' + bad);
            instance.reset();
            unchanged.reset();
            eq(attr[key], schema.attr[key].default, 'attr.' + key + ' has been reset to ' + schema.attr[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
    });
  });
  describe('Oom.Dd (all)', function() {
    describe('The Oom.Dd class', function() {
      var Class = ROOT.Oom.Dd,
          schema = Class.schema,
          stat = Class.stat;
      it('is a class with base methods', function() {
        try {
          eq((typeof Class === 'undefined' ? 'undefined' : $traceurRuntime.typeof(Class)), 'function', '`typeof Oom.Dd` is a function');
          eq($traceurRuntime.typeof(Class.reset), 'function', 'Oom.Dd.reset() is a static method');
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var n = countKeyMatches(schema.stat, isConstant);
      it(("has " + n + " constant static" + (1 == n ? '' : 's')), function() {
        try {
          tryHardSet(Class, 'name', 'Changed!');
          eq(Class.name, 'Oom.Dd', 'name is Oom.Dd');
          for (var key in schema.stat) {
            if (!isConstant(key))
              continue;
            var def = schema.stat[key];
            tryHardSet(stat, key, goodVals[def.typeStr]);
            eq(stat[key], def.default, 'stat.' + key + ' is ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.stat, isReadOnly);
      it(("has " + n + " read-only static" + (1 == n ? '' : 's')), function() {
        try {
          Class.reset();
          for (var key in schema.stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            stat[key] = goodVals[def.typeStr];
            eq(stat[key], def.default, 'stat.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('sees when read-only statics change', function() {
        try {
          for (var key in schema.stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            var good = goodVals[def.typeStr];
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            shadowObj['_' + key] = good;
            eq(stat[key], good, 'stat.' + key + ' has changed to ' + good);
            Class.reset();
            eq(stat[key], def.default, 'stat.' + key + ' has been reset to ' + def.default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.stat, isReadWrite);
      it(("has " + n + " read-write static" + (1 == n ? '' : 's')), function() {
        try {
          for (var key in schema.stat) {
            if (!isReadWrite(key))
              continue;
            var def = schema.stat[key];
            eq(stat[key], def.default, 'stat.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('allows read-write statics to be changed', function() {
        try {
          for (var key in schema.stat) {
            if (!isReadWrite(key))
              continue;
            var good = goodVals[schema.stat[key].typeStr];
            var bad = badVals[schema.stat[key].typeStr];
            stat[key] = good;
            eq(stat[key], good, 'stat.' + key + ' has changed to ' + good);
            stat[key] = bad;
            eq(stat[key], good, 'stat.' + key + ' has NOT changed to ' + bad);
            Class.reset();
            eq(stat[key], schema.stat[key].default, 'stat.' + key + ' has been reset to ' + schema.stat[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
    });
    describe('An Oom.Dd instance', function() {
      var Class = ROOT.Oom.Dd,
          schema = Class.schema,
          instance = new Class(),
          attr = instance.attr,
          unchanged = new Class();
      it('is an instance with base methods', function() {
        try {
          is(instance instanceof Class, 'is an instance of Oom.Dd');
          eq(Class, instance.constructor, '`constructor` is Oom.Dd');
          eq($traceurRuntime.typeof(instance.reset), 'function', 'myOomDd.reset() is an instance method');
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var n = countKeyMatches(schema.attr, function(key) {
        return isConstant(key) && schema.attr[key].isFn;
      });
      it(("has " + n + " constant attribute" + (1 == n ? '' : 's') + " from function"), function() {
        try {
          for (var key in schema.attr) {
            var def = schema.attr[key];
            if (!isConstant(key) || !def.isFn)
              continue;
            var origValue = attr[key];
            trySoftSet(attr, key, goodVals[def.typeStr]);
            eq(attr[key], origValue, 'attr.' + key + ' remains ' + origValue.toString() + ' after simple set');
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, function(key) {
        return isConstant(key) && !schema.attr[key].isFn;
      });
      it(("has " + n + " constant attribute" + (1 == n ? '' : 's') + " NOT from function"), function() {
        try {
          for (var key in schema.attr) {
            var def = schema.attr[key];
            if (!isConstant(key) || def.isFn)
              continue;
            tryHardSet(attr, key, goodVals[def.typeStr]);
            eq(attr[key], def.default, 'attr.' + key + ' is ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, isReadOnly);
      it(("has " + n + " read-only attribute" + (1 == n ? '' : 's')), function() {
        try {
          instance.reset();
          for (var key in schema.attr) {
            if (!isReadOnly(key))
              continue;
            var def = schema.attr[key];
            attr[key] = goodVals[def.typeStr];
            eq(attr[key], def.default, 'attr.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('sees when read-only attributes change', function() {
        try {
          for (var key in schema.attr) {
            if (!isReadOnly(key))
              continue;
            var good = goodVals[schema.attr[key].typeStr];
            attr['_' + key] = good;
            eq(attr[key], good, 'attr.' + key + ' has changed to ' + good);
            neq(unchanged.attr[key], good, 'unchanged.attr.' + key + ' has NOT changed to ' + good);
            instance.reset();
            unchanged.reset();
            eq(attr[key], schema.attr[key].default, 'attr.' + key + ' has been reset to ' + schema.attr[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, isReadWrite);
      it(("has " + n + " read-write attribute" + (1 == n ? '' : 's')), function() {
        try {
          for (var key in schema.attr) {
            if (!isReadWrite(key))
              continue;
            var def = schema.attr[key];
            eq(attr[key], def.default, 'attr.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('allows read-write attributes to be changed', function() {
        try {
          for (var key in schema.attr) {
            if (!isReadWrite(key))
              continue;
            var good = goodVals[schema.attr[key].typeStr];
            var bad = badVals[schema.attr[key].typeStr];
            attr[key] = good;
            eq(attr[key], good, 'attr.' + key + ' has changed to ' + good);
            neq(unchanged.attr[key], good, 'unchanged.attr.' + key + ' has NOT changed to ' + good);
            attr[key] = bad;
            eq(attr[key], good, 'attr.' + key + ' has NOT changed to ' + bad);
            neq(unchanged.attr[key], bad, 'unchanged.attr.' + key + ' has NOT changed to ' + bad);
            instance.reset();
            unchanged.reset();
            eq(attr[key], schema.attr[key].default, 'attr.' + key + ' has been reset to ' + schema.attr[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
    });
  });
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
function testify() {
  this.chai = this.chai || require('chai');
  this.mocha = this.mocha || require('mocha');
  return {
    chai: chai,
    mocha: mocha,
    assert: chai.assert,
    expect: chai.expect,
    eq: chai.assert.strictEqual,
    neq: chai.assert.notStrictEqual,
    is: chai.assert.isOk,
    describe: this.describe || mocha.describe,
    it: this.it || mocha.it,
    trySoftSet: function(obj, keylist, value) {
      keylist.split(',').forEach(function(key) {
        try {
          obj[key] = value;
        } catch (e) {}
      });
    },
    tryHardSet: function(obj, keylist, value) {
      keylist.split(',').forEach(function(key) {
        var def = {
          enumerable: true,
          value: value,
          configurable: true
        };
        try {
          Object.defineProperty(obj, key, def);
        } catch (e) {}
      });
    },
    goodVals: {
      color: '#C84CED',
      Number: 12345,
      String: 'A new valid str'
    },
    badVals: {
      color: 'C84CED',
      Number: '11.22.33',
      String: /Not a valid str/
    }
  };
}
!function(ROOT) {
  'use strict';
  if (false)
    return;
  var $__2 = ROOT.testify(),
      describe = $__2.describe,
      it = $__2.it,
      eq = $__2.eq,
      neq = $__2.neq,
      is = $__2.is,
      trySoftSet = $__2.trySoftSet,
      tryHardSet = $__2.tryHardSet,
      goodVals = $__2.goodVals,
      badVals = $__2.badVals;
  var $__3 = Oom.KIT,
      countKeyMatches = $__3.countKeyMatches,
      isConstant = $__3.isConstant,
      isReadOnly = $__3.isReadOnly,
      isReadWrite = $__3.isReadWrite,
      isValid = $__3.isValid;
  describe('Oom.Dd.Cloud (all)', function() {
    describe('The Oom.Dd.Cloud class', function() {
      var Class = ROOT.Oom.Dd.Cloud,
          schema = Class.schema,
          stat = Class.stat;
      it('is a class with base methods', function() {
        try {
          eq((typeof Class === 'undefined' ? 'undefined' : $traceurRuntime.typeof(Class)), 'function', '`typeof Oom.Dd.Cloud` is a function');
          eq($traceurRuntime.typeof(Class.reset), 'function', 'Oom.Dd.Cloud.reset() is a static method');
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var n = countKeyMatches(schema.stat, isConstant);
      it(("has " + n + " constant static" + (1 == n ? '' : 's')), function() {
        try {
          tryHardSet(Class, 'name', 'Changed!');
          eq(Class.name, 'Oom.Dd.Cloud', 'name is Oom.Dd.Cloud');
          for (var key in schema.stat) {
            if (!isConstant(key))
              continue;
            var def = schema.stat[key];
            tryHardSet(stat, key, goodVals[def.typeStr]);
            eq(stat[key], def.default, 'stat.' + key + ' is ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.stat, isReadOnly);
      it(("has " + n + " read-only static" + (1 == n ? '' : 's')), function() {
        try {
          Class.reset();
          for (var key in schema.stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            stat[key] = goodVals[def.typeStr];
            eq(stat[key], def.default, 'stat.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('sees when read-only statics change', function() {
        try {
          for (var key in schema.stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            var good = goodVals[def.typeStr];
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            shadowObj['_' + key] = good;
            eq(stat[key], good, 'stat.' + key + ' has changed to ' + good);
            Class.reset();
            eq(stat[key], def.default, 'stat.' + key + ' has been reset to ' + def.default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.stat, isReadWrite);
      it(("has " + n + " read-write static" + (1 == n ? '' : 's')), function() {
        try {
          for (var key in schema.stat) {
            if (!isReadWrite(key))
              continue;
            var def = schema.stat[key];
            eq(stat[key], def.default, 'stat.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, stat[key]), 'stat.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('allows read-write statics to be changed', function() {
        try {
          for (var key in schema.stat) {
            if (!isReadWrite(key))
              continue;
            var good = goodVals[schema.stat[key].typeStr];
            var bad = badVals[schema.stat[key].typeStr];
            stat[key] = good;
            eq(stat[key], good, 'stat.' + key + ' has changed to ' + good);
            stat[key] = bad;
            eq(stat[key], good, 'stat.' + key + ' has NOT changed to ' + bad);
            Class.reset();
            eq(stat[key], schema.stat[key].default, 'stat.' + key + ' has been reset to ' + schema.stat[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
    });
    describe('An Oom.Dd.Cloud instance', function() {
      var Class = ROOT.Oom.Dd.Cloud,
          schema = Class.schema,
          instance = new Class(),
          attr = instance.attr,
          unchanged = new Class();
      it('is an instance with base methods', function() {
        try {
          is(instance instanceof Class, 'is an instance of Oom.Dd.Cloud');
          eq(Class, instance.constructor, '`constructor` is Oom.Dd.Cloud');
          eq($traceurRuntime.typeof(instance.reset), 'function', 'myOomDdCloud.reset() is an instance method');
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var n = countKeyMatches(schema.attr, function(key) {
        return isConstant(key) && schema.attr[key].isFn;
      });
      it(("has " + n + " constant attribute" + (1 == n ? '' : 's') + " from function"), function() {
        try {
          for (var key in schema.attr) {
            var def = schema.attr[key];
            if (!isConstant(key) || !def.isFn)
              continue;
            var origValue = attr[key];
            trySoftSet(attr, key, goodVals[def.typeStr]);
            eq(attr[key], origValue, 'attr.' + key + ' remains ' + origValue.toString() + ' after simple set');
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, function(key) {
        return isConstant(key) && !schema.attr[key].isFn;
      });
      it(("has " + n + " constant attribute" + (1 == n ? '' : 's') + " NOT from function"), function() {
        try {
          for (var key in schema.attr) {
            var def = schema.attr[key];
            if (!isConstant(key) || def.isFn)
              continue;
            tryHardSet(attr, key, goodVals[def.typeStr]);
            eq(attr[key], def.default, 'attr.' + key + ' is ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, isReadOnly);
      it(("has " + n + " read-only attribute" + (1 == n ? '' : 's')), function() {
        try {
          instance.reset();
          for (var key in schema.attr) {
            if (!isReadOnly(key))
              continue;
            var def = schema.attr[key];
            attr[key] = goodVals[def.typeStr];
            eq(attr[key], def.default, 'attr.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('sees when read-only attributes change', function() {
        try {
          for (var key in schema.attr) {
            if (!isReadOnly(key))
              continue;
            var good = goodVals[schema.attr[key].typeStr];
            attr['_' + key] = good;
            eq(attr[key], good, 'attr.' + key + ' has changed to ' + good);
            neq(unchanged.attr[key], good, 'unchanged.attr.' + key + ' has NOT changed to ' + good);
            instance.reset();
            unchanged.reset();
            eq(attr[key], schema.attr[key].default, 'attr.' + key + ' has been reset to ' + schema.attr[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      n = countKeyMatches(schema.attr, isReadWrite);
      it(("has " + n + " read-write attribute" + (1 == n ? '' : 's')), function() {
        try {
          for (var key in schema.attr) {
            if (!isReadWrite(key))
              continue;
            var def = schema.attr[key];
            eq(attr[key], def.default, 'attr.' + key + ' is initially ' + def.default.toString());
            is(isValid(def, attr[key]), 'attr.' + key + ' is a valid ' + def.typeStr);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      it('allows read-write attributes to be changed', function() {
        try {
          for (var key in schema.attr) {
            if (!isReadWrite(key))
              continue;
            var good = goodVals[schema.attr[key].typeStr];
            var bad = badVals[schema.attr[key].typeStr];
            attr[key] = good;
            eq(attr[key], good, 'attr.' + key + ' has changed to ' + good);
            neq(unchanged.attr[key], good, 'unchanged.attr.' + key + ' has NOT changed to ' + good);
            attr[key] = bad;
            eq(attr[key], good, 'attr.' + key + ' has NOT changed to ' + bad);
            neq(unchanged.attr[key], bad, 'unchanged.attr.' + key + ' has NOT changed to ' + bad);
            instance.reset();
            unchanged.reset();
            eq(attr[key], schema.attr[key].default, 'attr.' + key + ' has been reset to ' + schema.attr[key].default);
          }
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      });
    });
  });
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);




//// Made by Oomtility Make 1.3.7 //\\//\\ http://oomtility.loop.coop //////////
