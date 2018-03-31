//// Oom.Dd //// 1.0.2 //// March 2018 //// http://oom-dd.richplastow.com/ /////

"use strict";
!function(ROOT) {
  'use strict';
  if (false)
    return $(mocha.run);
  var $__2 = ROOT.testify(),
      describe = $__2.describe,
      it = $__2.it,
      eq = $__2.eq,
      neq = $__2.neq,
      is = $__2.is,
      goodVals = $__2.goodVals,
      badVals = $__2.badVals;
  var $__3 = Oom.KIT,
      isConstant = $__3.isConstant,
      isReadOnly = $__3.isReadOnly,
      isReadWrite = $__3.isReadWrite;
  describe('Oom (browser)', function() {
    var hid = true,
        Class = ROOT.Oom,
        stat = Class.stat,
        schema = Class.schema,
        instance = new Class(),
        attr = instance.attr;
    describe('The Oom.devMainVue() component', function(done) {
      var testID = 'test-oom-devmainvue',
          vueComponent = Vue.component(testID, Class.devMainVue(instance)),
          $container = $('.container').append(("<div class=\"row " + (hid ? 'hid' : '') + "\" ") + ("id=\"" + testID + "\"><" + testID + ">Loading...</" + testID + "></div>")),
          vue = new Vue({
            el: '#' + testID,
            mounted: testAfterMounted
          });
      function testAfterMounted() {
        it('is a viable Vue component', function() {
          try {
            eq($('#' + testID).length, 1, '#' + testID + ' exists');
            eq($('#' + testID + ' .dev-main').length, 1, 'dev-main exists');
            eq($('#' + testID + ' .dev-main .member-table').length, 2, 'Two member-tables exist (one for stat, one for attr)');
          } catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('shows correct initial statics', function(done) {
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                var $el = $(("#" + testID + " .stat .Oom-" + key + " .val"));
                var val = ($el.find('.read-write')[0]) ? $el.find('.read-write').val() : $el.text();
                eq(val, stat[key] + '', ("Vue should set .Oom-" + key + " to stat." + key));
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-only statics have changed', function(done) {
          var cache = {good: {}};
          for (var key in stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            cache.good[key] = goodVals[def.typeStr];
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            shadowObj['_' + key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadOnly(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .stat .Oom-" + key + " .val")).text(), good, '`#' + testID + ' .stat .Oom-' + key + ' .val` changed to ' + good);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-write statics have changed', function(done) {
          var cache = {good: {}};
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.good[key] = goodVals[schema.stat[key].typeStr];
            stat[key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .stat .Oom-" + key + " .val .read-write")).val(), good, '`#' + testID + ' .stat .Oom-' + key + ' .val` changed to ' + good);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('updates read-write statics after UI input', function(done) {
          var cache = {
            $el: {},
            good: {}
          };
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .stat .Oom-" + key + " .val .read-write"));
            cache.good[key] = goodVals[schema.stat[key].typeStr];
            simulateInput(cache.$el[key], cache.good[key]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.good[key] + '', "<INPUT> change should make Vue update stat." + key);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('does not update read-write statics after invalid UI input', function(done) {
          var cache = {
            $el: {},
            orig: {}
          };
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .stat .Oom-" + key + " .val .read-write"));
            cache.orig[key] = cache.$el[key].val();
            simulateInput(cache.$el[key], badVals[schema.stat[key].typeStr]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.orig[key], "invalid <INPUT> change does not update stat." + key);
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows correct initial attributes', function(done) {
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                var $el = $(("#" + testID + " .attr .Oom-" + key + " .val"));
                var val = ($el.find('.read-write')[0]) ? $el.find('.read-write').val() : $el.text();
                eq(val, attr[key] + '', ("Vue should set .Oom-" + key + " to attr." + key));
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-only attributes have changed', function(done) {
          var cache = {good: {}};
          for (var key in attr) {
            if (!isReadOnly(key))
              continue;
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            attr['_' + key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadOnly(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .attr .Oom-" + key + " .val")).text(), good, '`#' + testID + ' .attr .Oom-' + key + ' .val` changed to ' + good);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-write attributes have changed', function(done) {
          var cache = {good: {}};
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            attr[key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .attr .Oom-" + key + " .val .read-write")).val(), good, '`#' + testID + ' .attr .Oom-' + key + ' .val` changed to ' + good);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('updates read-write attributes after UI input', function(done) {
          var cache = {
            $el: {},
            good: {}
          };
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .attr .Oom-" + key + " .val .read-write"));
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            simulateInput(cache.$el[key], cache.good[key]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.good[key] + '', "<INPUT> change should make Vue update attr." + key);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('does not update read-write attributes after invalid UI input', function(done) {
          var cache = {
            $el: {},
            orig: {}
          };
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .attr .Oom-" + key + " .val .read-write"));
            cache.orig[key] = cache.$el[key].val();
            simulateInput(cache.$el[key], badVals[schema.attr[key].typeStr]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.orig[key], "invalid <INPUT> change does not update attr." + key);
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
      }
    });
    describe('The Oom.devThumbAFrame*() set', function(done) {
      it('devThumbAFrame*() functions return expected objects', function() {
        try {} catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var pfx = 'oom',
          testID = ("test-" + pfx + "-devthumb"),
          vueComponent = Vue.component(testID, Class.devThumbAFrameVue(instance)),
          aframeComponent = AFRAME.registerComponent((pfx + "-devthumb"), Class.devThumbAFrame(instance)),
          aframePrimative = AFRAME.registerPrimitive(("a-" + pfx + "-devthumb"), Class.devThumbAFramePrimative(instance, (pfx + "-devthumb"))),
          $container = $('a-scene').append(("<a-entity id=\"" + testID + "\">") + ("<" + testID + "></" + testID + "></a-entity>")),
          vue = new Vue({
            el: '#' + testID,
            mounted: testAfterMounted
          });
      function testAfterMounted() {
        it('devThumbAframeVue() creates a viable Vue component', function() {
          try {
            eq($('#' + testID).length, 1, '#' + testID + ' exists');
            eq($(("#" + testID + " a-" + pfx + "-devthumb")).length, 2, ("Two <a-" + pfx + "-devthumb>s exist in #" + testID));
          } catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('on the inside, is a viable A-Frame component', function() {
          try {} catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('changing `stat/attr.hilite` changes box color', function(done) {
          var $__4 = generateRandomColors(),
              firstObj = $__4.firstObj,
              firstHex = $__4.firstHex,
              secondObj = $__4.secondObj,
              secondHex = $__4.secondHex;
          stat.hilite = firstHex;
          attr.hilite = secondHex;
          Vue.nextTick(function() {
            Vue.nextTick((function() {
              var error;
              try {
                $(("#" + testID + " >a-entity")).attr('position', '0 0 0');
                var r = testPixels({
                  tol: 1,
                  pos: [{
                    x: 0,
                    y: 0.5
                  }, {
                    x: 1,
                    y: 0.5
                  }],
                  exp: [firstObj, secondObj]
                });
                eq(r[0].passes, 4, ("mid-left pixel " + r[0].actualRGBA + " is near-") + ("enough expected hilite static " + r[0].expRGBA));
                eq(r[1].passes, 4, ("mid-right pixel " + r[1].actualRGBA + " is near-") + ("enough expected hilite attribute " + r[1].expRGBA));
                $(("#" + testID + " >a-entity")).attr('position', '0 10 0');
              } catch (e) {
                error = e;
                console.error(e.message);
              }
              done(error);
            }).bind(this));
          });
        });
        it('boxes can change `stat/attr.hilite` on click', function(done) {
          var $__4 = generateRandomColors(),
              thirdObj = $__4.thirdObj,
              thirdHex = $__4.thirdHex,
              fourthObj = $__4.fourthObj,
              fourthHex = $__4.fourthHex;
          var onOomEvent = function(evt) {
            if (!evt.detail)
              return;
            var $__5 = evt.detail,
                el = $__5.el,
                type = $__5.type;
            if ('click' !== type)
              return;
            if ($(el).hasClass('stat'))
              stat.hilite = thirdHex;
            if ($(el).hasClass('attr'))
              attr.hilite = fourthHex;
          };
          $(window).on('oom-event', onOomEvent);
          var evt = new MouseEvent('click');
          $(("#" + testID + " a-" + pfx + "-devthumb.stat"))[0].dispatchEvent(evt);
          $(("#" + testID + " a-" + pfx + "-devthumb.attr"))[0].dispatchEvent(evt);
          $(window).off('oom-event', onOomEvent);
          Vue.nextTick(function() {
            Vue.nextTick((function() {
              var error;
              try {
                $(("#" + testID + " >a-entity")).attr('position', '0 0 0');
                var r = testPixels({
                  tol: 1,
                  pos: [{
                    x: 0,
                    y: 0.5
                  }, {
                    x: 1,
                    y: 0.5
                  }],
                  exp: [thirdObj, fourthObj]
                });
                eq(r[0].passes, 4, ("mid-left pixel " + r[0].actualRGBA + " is near-") + ("enough expected hilite static " + r[0].expRGBA));
                eq(r[1].passes, 4, ("mid-right pixel " + r[1].actualRGBA + " is near-") + ("enough expected hilite attribute " + r[1].expRGBA));
                eq(stat.hilite, thirdHex, '`stat.hilite` is now ' + thirdHex);
                eq(attr.hilite, fourthHex, '`attr.hilite` is now ' + fourthHex);
                $(("#" + testID + " >a-entity")).attr('position', '0 10 0');
              } catch (e) {
                error = e;
                console.error(e.message);
              }
              done(error);
            }).bind(this));
          });
        });
      }
    });
  });
  describe('Oom.Dd (browser)', function() {
    var hid = true,
        Class = ROOT.Oom.Dd,
        stat = Class.stat,
        schema = Class.schema,
        instance = new Class(),
        attr = instance.attr;
    describe('The Oom.Dd.devMainVue() component', function(done) {
      var testID = 'test-oom-dd-devmainvue',
          vueComponent = Vue.component(testID, Class.devMainVue(instance)),
          $container = $('.container').append(("<div class=\"row " + (hid ? 'hid' : '') + "\" ") + ("id=\"" + testID + "\"><" + testID + ">Loading...</" + testID + "></div>")),
          vue = new Vue({
            el: '#' + testID,
            mounted: testAfterMounted
          });
      function testAfterMounted() {
        it('is a viable Vue component', function() {
          try {
            eq($('#' + testID).length, 1, '#' + testID + ' exists');
            eq($('#' + testID + ' .dev-main').length, 1, 'dev-main exists');
            eq($('#' + testID + ' .dev-main .member-table').length, 2, 'Two member-tables exist (one for stat, one for attr)');
          } catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('shows correct initial statics', function(done) {
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                var $el = $(("#" + testID + " .stat .Oom-" + key + " .val"));
                var val = ($el.find('.read-write')[0]) ? $el.find('.read-write').val() : $el.text();
                eq(val, stat[key] + '', ("Vue should set .Oom-" + key + " to stat." + key));
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-only statics have changed', function(done) {
          var cache = {good: {}};
          for (var key in stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            cache.good[key] = goodVals[def.typeStr];
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            shadowObj['_' + key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadOnly(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .stat .Oom-" + key + " .val")).text(), good, '`#' + testID + ' .stat .Oom-' + key + ' .val` changed to ' + good);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-write statics have changed', function(done) {
          var cache = {good: {}};
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.good[key] = goodVals[schema.stat[key].typeStr];
            stat[key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .stat .Oom-" + key + " .val .read-write")).val(), good, '`#' + testID + ' .stat .Oom-' + key + ' .val` changed to ' + good);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('updates read-write statics after UI input', function(done) {
          var cache = {
            $el: {},
            good: {}
          };
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .stat .Oom-" + key + " .val .read-write"));
            cache.good[key] = goodVals[schema.stat[key].typeStr];
            simulateInput(cache.$el[key], cache.good[key]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.good[key] + '', "<INPUT> change should make Vue update stat." + key);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('does not update read-write statics after invalid UI input', function(done) {
          var cache = {
            $el: {},
            orig: {}
          };
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .stat .Oom-" + key + " .val .read-write"));
            cache.orig[key] = cache.$el[key].val();
            simulateInput(cache.$el[key], badVals[schema.stat[key].typeStr]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.orig[key], "invalid <INPUT> change does not update stat." + key);
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows correct initial attributes', function(done) {
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                var $el = $(("#" + testID + " .attr .Oom-" + key + " .val"));
                var val = ($el.find('.read-write')[0]) ? $el.find('.read-write').val() : $el.text();
                eq(val, attr[key] + '', ("Vue should set .Oom-" + key + " to attr." + key));
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-only attributes have changed', function(done) {
          var cache = {good: {}};
          for (var key in attr) {
            if (!isReadOnly(key))
              continue;
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            attr['_' + key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadOnly(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .attr .Oom-" + key + " .val")).text(), good, '`#' + testID + ' .attr .Oom-' + key + ' .val` changed to ' + good);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-write attributes have changed', function(done) {
          var cache = {good: {}};
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            attr[key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .attr .Oom-" + key + " .val .read-write")).val(), good, '`#' + testID + ' .attr .Oom-' + key + ' .val` changed to ' + good);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('updates read-write attributes after UI input', function(done) {
          var cache = {
            $el: {},
            good: {}
          };
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .attr .Oom-" + key + " .val .read-write"));
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            simulateInput(cache.$el[key], cache.good[key]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.good[key] + '', "<INPUT> change should make Vue update attr." + key);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('does not update read-write attributes after invalid UI input', function(done) {
          var cache = {
            $el: {},
            orig: {}
          };
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .attr .Oom-" + key + " .val .read-write"));
            cache.orig[key] = cache.$el[key].val();
            simulateInput(cache.$el[key], badVals[schema.attr[key].typeStr]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.orig[key], "invalid <INPUT> change does not update attr." + key);
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
      }
    });
    describe('The Oom.Dd.devThumbAFrame*() set', function(done) {
      it('devThumbAFrame*() functions return expected objects', function() {
        try {} catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var pfx = 'oom-dd',
          testID = ("test-" + pfx + "-devthumb"),
          vueComponent = Vue.component(testID, Class.devThumbAFrameVue(instance)),
          aframeComponent = AFRAME.registerComponent((pfx + "-devthumb"), Class.devThumbAFrame(instance)),
          aframePrimative = AFRAME.registerPrimitive(("a-" + pfx + "-devthumb"), Class.devThumbAFramePrimative(instance, (pfx + "-devthumb"))),
          $container = $('a-scene').append(("<a-entity id=\"" + testID + "\">") + ("<" + testID + "></" + testID + "></a-entity>")),
          vue = new Vue({
            el: '#' + testID,
            mounted: testAfterMounted
          });
      function testAfterMounted() {
        it('devThumbAframeVue() creates a viable Vue component', function() {
          try {
            eq($('#' + testID).length, 1, '#' + testID + ' exists');
            eq($(("#" + testID + " a-" + pfx + "-devthumb")).length, 2, ("Two <a-" + pfx + "-devthumb>s exist in #" + testID));
          } catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('on the inside, is a viable A-Frame component', function() {
          try {} catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('changing `stat/attr.hilite` changes box color', function(done) {
          var $__4 = generateRandomColors(),
              firstObj = $__4.firstObj,
              firstHex = $__4.firstHex,
              secondObj = $__4.secondObj,
              secondHex = $__4.secondHex;
          stat.hilite = firstHex;
          attr.hilite = secondHex;
          Vue.nextTick(function() {
            Vue.nextTick((function() {
              var error;
              try {
                $(("#" + testID + " >a-entity")).attr('position', '0 0 0');
                var r = testPixels({
                  tol: 1,
                  pos: [{
                    x: 0,
                    y: 0.5
                  }, {
                    x: 1,
                    y: 0.5
                  }],
                  exp: [firstObj, secondObj]
                });
                eq(r[0].passes, 4, ("mid-left pixel " + r[0].actualRGBA + " is near-") + ("enough expected hilite static " + r[0].expRGBA));
                eq(r[1].passes, 4, ("mid-right pixel " + r[1].actualRGBA + " is near-") + ("enough expected hilite attribute " + r[1].expRGBA));
                $(("#" + testID + " >a-entity")).attr('position', '0 10 0');
              } catch (e) {
                error = e;
                console.error(e.message);
              }
              done(error);
            }).bind(this));
          });
        });
        it('boxes can change `stat/attr.hilite` on click', function(done) {
          var $__4 = generateRandomColors(),
              thirdObj = $__4.thirdObj,
              thirdHex = $__4.thirdHex,
              fourthObj = $__4.fourthObj,
              fourthHex = $__4.fourthHex;
          var onOomEvent = function(evt) {
            if (!evt.detail)
              return;
            var $__5 = evt.detail,
                el = $__5.el,
                type = $__5.type;
            if ('click' !== type)
              return;
            if ($(el).hasClass('stat'))
              stat.hilite = thirdHex;
            if ($(el).hasClass('attr'))
              attr.hilite = fourthHex;
          };
          $(window).on('oom-event', onOomEvent);
          var evt = new MouseEvent('click');
          $(("#" + testID + " a-" + pfx + "-devthumb.stat"))[0].dispatchEvent(evt);
          $(("#" + testID + " a-" + pfx + "-devthumb.attr"))[0].dispatchEvent(evt);
          $(window).off('oom-event', onOomEvent);
          Vue.nextTick(function() {
            Vue.nextTick((function() {
              var error;
              try {
                $(("#" + testID + " >a-entity")).attr('position', '0 0 0');
                var r = testPixels({
                  tol: 1,
                  pos: [{
                    x: 0,
                    y: 0.5
                  }, {
                    x: 1,
                    y: 0.5
                  }],
                  exp: [thirdObj, fourthObj]
                });
                eq(r[0].passes, 4, ("mid-left pixel " + r[0].actualRGBA + " is near-") + ("enough expected hilite static " + r[0].expRGBA));
                eq(r[1].passes, 4, ("mid-right pixel " + r[1].actualRGBA + " is near-") + ("enough expected hilite attribute " + r[1].expRGBA));
                eq(stat.hilite, thirdHex, '`stat.hilite` is now ' + thirdHex);
                eq(attr.hilite, fourthHex, '`attr.hilite` is now ' + fourthHex);
                $(("#" + testID + " >a-entity")).attr('position', '0 10 0');
              } catch (e) {
                error = e;
                console.error(e.message);
              }
              done(error);
            }).bind(this));
          });
        });
      }
    });
  });
  $(mocha.run);
}(window);
function simulateInput($input, val) {
  $input.val(val);
  var e = document.createEvent('HTMLEvents');
  e.initEvent('input', true, true);
  $input[0].dispatchEvent(e);
}
function testPixels(config) {
  var c = Object.assign({}, {
    tol: 5,
    pos: [{
      x: 0.5,
      y: 0.5
    }],
    exp: [{
      r: 255,
      g: 0,
      b: 0,
      a: 255
    }]
  }, config);
  var sceneEl = $('a-scene')[0];
  var captureCanvas = sceneEl.components.screenshot.getCanvas('perspective');
  var captureCtx = captureCanvas.getContext('2d');
  var cloneCanvas = document.createElement('canvas');
  var cloneCtx = cloneCanvas.getContext('2d');
  cloneCanvas.width = captureCanvas.width;
  cloneCanvas.height = captureCanvas.height;
  cloneCtx.drawImage(captureCanvas, 0, 0);
  $('#screenshots').append(cloneCanvas);
  var r = [];
  for (var i = 0; i < c.pos.length; i++) {
    var $__2 = c.pos[i],
        x = $__2.x,
        y = $__2.y;
    var exp = c.exp[i];
    var tol = c.tol;
    var xClamped = 0 > x ? 0 : 1 <= x ? captureCanvas.width - 1 : captureCanvas.width * x;
    var yClamped = 0 > y ? 0 : 1 <= y ? captureCanvas.height - 1 : captureCanvas.width * y;
    var actual = Array.from(cloneCtx.getImageData(~~xClamped, ~~yClamped, 1, 1).data);
    var passes = 0;
    passes += (actual[0] < (exp.r + tol)) && (actual[0] > (exp.r - tol));
    passes += (actual[1] < (exp.g + tol)) && (actual[1] > (exp.g - tol));
    passes += (actual[2] < (exp.b + tol)) && (actual[2] > (exp.b - tol));
    passes += (actual[3] < (exp.a + tol)) && (actual[3] > (exp.a - tol));
    r[i] = {
      passes: passes,
      actualRGBA: ("rgba(" + actual.join(',') + ")"),
      expRGBA: ("rgba(" + exp.r + "," + exp.g + "," + exp.b + "," + exp.a + ")")
    };
  }
  return r;
}
function generateRandomColors() {
  var colors = [];
  for (var i = 1; i < 26; i++) {
    var color = ('00' + i.toString(3)).slice(-3);
    colors.push([2 == color[0] ? 255 : 1 == color[0] ? 128 : 0, 2 == color[1] ? 255 : 1 == color[1] ? 128 : 0, 2 == color[2] ? 255 : 1 == color[2] ? 128 : 0, '#' + color.replace(/0/g, '00').replace(/1/g, '80').replace(/2/g, 'ff')]);
  }
  var out = {};
  ;
  ['first', 'second', 'third', 'fourth'].forEach(function(prefix, i) {
    var $__3,
        $__4;
    var from = ~~(i * colors.length / 4);
    var to = ~~((i + 1) * colors.length / 4);
    var index = ~~(Math.random() * (to - from)) + from;
    var $__2 = colors[index],
        r = ($__3 = $__2[Symbol.iterator](), ($__4 = $__3.next()).done ? void 0 : $__4.value),
        g = ($__4 = $__3.next()).done ? void 0 : $__4.value,
        b = ($__4 = $__3.next()).done ? void 0 : $__4.value,
        hex = ($__4 = $__3.next()).done ? void 0 : $__4.value;
    out[prefix + 'Hex'] = hex;
    out[prefix + 'Obj'] = {
      r: r,
      g: g,
      b: b,
      a: 255
    };
  });
  return out;
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
      goodVals = $__2.goodVals,
      badVals = $__2.badVals;
  var $__3 = Oom.KIT,
      isConstant = $__3.isConstant,
      isReadOnly = $__3.isReadOnly,
      isReadWrite = $__3.isReadWrite;
  describe('Oom.Dd.Cloud (browser)', function() {
    var hid = 0,
        Class = ROOT.Oom.Dd.Cloud,
        stat = Class.stat,
        schema = Class.schema,
        instance = new Class(),
        attr = instance.attr;
    describe('The Oom.Dd.Cloud.devMainVue() component', function(done) {
      var testID = 'test-oom-dd-cloud-devmainvue',
          vueComponent = Vue.component(testID, Class.devMainVue(instance)),
          $container = $('.container').append(("<div class=\"row " + (hid ? 'hid' : '') + "\" ") + ("id=\"" + testID + "\"><" + testID + ">Loading...</" + testID + "></div>")),
          vue = new Vue({
            el: '#' + testID,
            mounted: testAfterMounted
          });
      function testAfterMounted() {
        it('is a viable Vue component', function() {
          try {
            eq($('#' + testID).length, 1, '#' + testID + ' exists');
            eq($('#' + testID + ' .dev-main').length, 1, 'dev-main exists');
            eq($('#' + testID + ' .dev-main .member-table').length, 2, 'Two member-tables exist (one for stat, one for attr)');
          } catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('shows correct initial statics', function(done) {
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                var $el = $(("#" + testID + " .stat .Oom-" + key + " .val"));
                var val = ($el.find('.read-write')[0]) ? $el.find('.read-write').val() : $el.text();
                eq(val, stat[key] + '', ("Vue should set .Oom-" + key + " to stat." + key));
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-only statics have changed', function(done) {
          var cache = {good: {}};
          for (var key in stat) {
            if (!isReadOnly(key))
              continue;
            var def = schema.stat[key];
            cache.good[key] = goodVals[def.typeStr];
            var shadowObj = def.perClass ? stat : def.definedIn.stat;
            shadowObj['_' + key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadOnly(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .stat .Oom-" + key + " .val")).text(), good, '`#' + testID + ' .stat .Oom-' + key + ' .val` changed to ' + good);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-write statics have changed', function(done) {
          var cache = {good: {}};
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.good[key] = goodVals[schema.stat[key].typeStr];
            stat[key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .stat .Oom-" + key + " .val .read-write")).val(), good, '`#' + testID + ' .stat .Oom-' + key + ' .val` changed to ' + good);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('updates read-write statics after UI input', function(done) {
          var cache = {
            $el: {},
            good: {}
          };
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .stat .Oom-" + key + " .val .read-write"));
            cache.good[key] = goodVals[schema.stat[key].typeStr];
            simulateInput(cache.$el[key], cache.good[key]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.good[key] + '', "<INPUT> change should make Vue update stat." + key);
              }
              Class.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('does not update read-write statics after invalid UI input', function(done) {
          var cache = {
            $el: {},
            orig: {}
          };
          for (var key in stat) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .stat .Oom-" + key + " .val .read-write"));
            cache.orig[key] = cache.$el[key].val();
            simulateInput(cache.$el[key], badVals[schema.stat[key].typeStr]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in stat) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.orig[key], "invalid <INPUT> change does not update stat." + key);
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows correct initial attributes', function(done) {
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                var $el = $(("#" + testID + " .attr .Oom-" + key + " .val"));
                var val = ($el.find('.read-write')[0]) ? $el.find('.read-write').val() : $el.text();
                eq(val, attr[key] + '', ("Vue should set .Oom-" + key + " to attr." + key));
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-only attributes have changed', function(done) {
          var cache = {good: {}};
          for (var key in attr) {
            if (!isReadOnly(key))
              continue;
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            attr['_' + key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadOnly(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .attr .Oom-" + key + " .val")).text(), good, '`#' + testID + ' .attr .Oom-' + key + ' .val` changed to ' + good);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('shows that read-write attributes have changed', function(done) {
          var cache = {good: {}};
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            attr[key] = cache.good[key];
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                var good = cache.good[key] + '';
                eq($(("#" + testID + " .attr .Oom-" + key + " .val .read-write")).val(), good, '`#' + testID + ' .attr .Oom-' + key + ' .val` changed to ' + good);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('updates read-write attributes after UI input', function(done) {
          var cache = {
            $el: {},
            good: {}
          };
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .attr .Oom-" + key + " .val .read-write"));
            cache.good[key] = goodVals[schema.attr[key].typeStr];
            simulateInput(cache.$el[key], cache.good[key]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.good[key] + '', "<INPUT> change should make Vue update attr." + key);
              }
              instance.reset();
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
        it('does not update read-write attributes after invalid UI input', function(done) {
          var cache = {
            $el: {},
            orig: {}
          };
          for (var key in attr) {
            if (!isReadWrite(key))
              continue;
            cache.$el[key] = $(("#" + testID + " .attr .Oom-" + key + " .val .read-write"));
            cache.orig[key] = cache.$el[key].val();
            simulateInput(cache.$el[key], badVals[schema.attr[key].typeStr]);
          }
          Vue.nextTick((function() {
            var error;
            try {
              for (var key in attr) {
                if (!isReadWrite(key))
                  continue;
                eq(cache.$el[key].val(), cache.orig[key], "invalid <INPUT> change does not update attr." + key);
              }
            } catch (e) {
              error = e;
              console.error(e.message);
            }
            done(error);
          }).bind(this));
        });
      }
    });
    describe('The Oom.Dd.Cloud.devThumbAFrame*() set', function(done) {
      it('devThumbAFrame*() functions return expected objects', function() {
        try {} catch (e) {
          console.error(e.message);
          throw e;
        }
      });
      var pfx = 'oom-dd-cloud',
          testID = ("test-" + pfx + "-devthumb"),
          vueComponent = Vue.component(testID, Class.devThumbAFrameVue(instance)),
          aframeComponent = AFRAME.registerComponent((pfx + "-devthumb"), Class.devThumbAFrame(instance)),
          aframePrimative = AFRAME.registerPrimitive(("a-" + pfx + "-devthumb"), Class.devThumbAFramePrimative(instance, (pfx + "-devthumb"))),
          $container = $('a-scene').append(("<a-entity id=\"" + testID + "\">") + ("<" + testID + "></" + testID + "></a-entity>")),
          vue = new Vue({
            el: '#' + testID,
            mounted: testAfterMounted
          });
      function testAfterMounted() {
        it('devThumbAframeVue() creates a viable Vue component', function() {
          try {
            eq($('#' + testID).length, 1, '#' + testID + ' exists');
            eq($(("#" + testID + " a-" + pfx + "-devthumb")).length, 2, ("Two <a-" + pfx + "-devthumb>s exist in #" + testID));
          } catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('on the inside, is a viable A-Frame component', function() {
          try {} catch (e) {
            console.error(e.message);
            throw e;
          }
        });
        it('changing `stat/attr.hilite` changes box color', function(done) {
          var $__4 = generateRandomColors(),
              firstObj = $__4.firstObj,
              firstHex = $__4.firstHex,
              secondObj = $__4.secondObj,
              secondHex = $__4.secondHex;
          stat.hilite = firstHex;
          attr.hilite = secondHex;
          Vue.nextTick(function() {
            Vue.nextTick((function() {
              var error;
              try {
                $(("#" + testID + " >a-entity")).attr('position', '0 0 0');
                var r = testPixels({
                  tol: 1,
                  pos: [{
                    x: 0,
                    y: 0.5
                  }, {
                    x: 1,
                    y: 0.5
                  }],
                  exp: [firstObj, secondObj]
                });
                eq(r[0].passes, 4, ("mid-left pixel " + r[0].actualRGBA + " is near-") + ("enough expected hilite static " + r[0].expRGBA));
                eq(r[1].passes, 4, ("mid-right pixel " + r[1].actualRGBA + " is near-") + ("enough expected hilite attribute " + r[1].expRGBA));
                $(("#" + testID + " >a-entity")).attr('position', '0 10 0');
              } catch (e) {
                error = e;
                console.error(e.message);
              }
              done(error);
            }).bind(this));
          });
        });
        it('boxes can change `stat/attr.hilite` on click', function(done) {
          var $__4 = generateRandomColors(),
              thirdObj = $__4.thirdObj,
              thirdHex = $__4.thirdHex,
              fourthObj = $__4.fourthObj,
              fourthHex = $__4.fourthHex;
          var onOomEvent = function(evt) {
            if (!evt.detail)
              return;
            var $__5 = evt.detail,
                el = $__5.el,
                type = $__5.type;
            if ('click' !== type)
              return;
            if ($(el).hasClass('stat'))
              stat.hilite = thirdHex;
            if ($(el).hasClass('attr'))
              attr.hilite = fourthHex;
          };
          $(window).on('oom-event', onOomEvent);
          var evt = new MouseEvent('click');
          $(("#" + testID + " a-" + pfx + "-devthumb.stat"))[0].dispatchEvent(evt);
          $(("#" + testID + " a-" + pfx + "-devthumb.attr"))[0].dispatchEvent(evt);
          $(window).off('oom-event', onOomEvent);
          Vue.nextTick(function() {
            Vue.nextTick((function() {
              var error;
              try {
                $(("#" + testID + " >a-entity")).attr('position', '0 0 0');
                var r = testPixels({
                  tol: 1,
                  pos: [{
                    x: 0,
                    y: 0.5
                  }, {
                    x: 1,
                    y: 0.5
                  }],
                  exp: [thirdObj, fourthObj]
                });
                eq(r[0].passes, 4, ("mid-left pixel " + r[0].actualRGBA + " is near-") + ("enough expected hilite static " + r[0].expRGBA));
                eq(r[1].passes, 4, ("mid-right pixel " + r[1].actualRGBA + " is near-") + ("enough expected hilite attribute " + r[1].expRGBA));
                eq(stat.hilite, thirdHex, '`stat.hilite` is now ' + thirdHex);
                eq(attr.hilite, fourthHex, '`attr.hilite` is now ' + fourthHex);
              } catch (e) {
                error = e;
                console.error(e.message);
              }
              done(error);
            }).bind(this));
          });
        });
      }
    });
  });
}(window);




//// Made by Oomtility Make 1.3.7 //\\//\\ http://oomtility.loop.coop //////////
