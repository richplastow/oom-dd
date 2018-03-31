//// Oom.Dd //// 1.0.1 //// March 2018 //// http://oom-dd.richplastow.com/ /////

//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)

!function (ROOT) { 'use strict'
if (false) return $(mocha.run) // change to `true` to ‘hard skip’ this test
const { describe, it, eq, neq, is, goodVals, badVals } = ROOT.testify()
const { isConstant, isReadOnly, isReadWrite } = Oom.KIT
describe('Oom (browser)', () => {
    const
        hid = true // `true` hides the components, `false` makes them visible
      , Class = ROOT.Oom
      , stat = Class.stat
      , schema = Class.schema
      , instance = new Class()
      , attr = instance.attr




describe('The Oom.devMainVue() component', function (done) {
    const
        testID = 'test-oom-devmainvue' // also used for component tag
      , vueComponent = Vue.component( testID, Class.devMainVue(instance) )
      , $container = $('.container').append(`<div class="row ${hid?'hid':''}" `
          + `id="${testID}"><${testID}>Loading...</${testID}></div>`)
      , vue = new Vue({ el:'#'+testID, mounted:testAfterMounted })

    function testAfterMounted () {




    //// AUTOMATIC STATIC TESTS
    //// Test whether the class’s devMainVue() component produces a complete
    //// interactive representation of the class’s statics. You don’t need to
    //// modify these tests unless you’ve given your class special behaviour.


    //// Oom.devMainVue(): The component itself.
    it('is a viable Vue component', function(){try{
        eq( $('#'+testID).length, 1
          , '#'+testID+' exists' )
        eq( $('#'+testID+' .dev-main').length, 1
          , 'dev-main exists' )
        eq( $('#'+testID+' .dev-main .member-table').length, 2
          , 'Two member-tables exist (one for stat, one for attr)' )
    }catch(e){console.error(e.message);throw e}})


    //// Oom.devMainVue(): Automatic statics - initial values.
    //// `Vue.nextTick()` because Vue hasn’t initialised the properties yet.
    it('shows correct initial statics', function (done) {
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                const $el = $(`#${testID} .stat .Oom-${key} .val`)
                const val = ( $el.find('.read-write')[0] )
                    ? $el.find('.read-write').val() // from an <INPUT>
                    : $el.text() // constant or read-only
                eq( val, stat[key]+''
                  , `Vue should set .Oom-${key} to stat.${key}`)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    }) // `bind(this)` to run the test in Mocha’s context)


    //// Oom.devMainVue(): Automatic read-only statics - shows changes.
    it('shows that read-only statics have changed', function (done) {
        const cache = { good:{} }
        for (let key in stat) {
            if (! isReadOnly(key) ) continue // only read-only properties
            const def = schema.stat[key]
            cache.good[key] = goodVals[ def.typeStr ]
            const shadowObj = def.perClass ? stat : def.definedIn.stat
            shadowObj['_'+key] = cache.good[key] // `perClass` controls where a static’s ‘shadow’ value is stored
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadOnly(key) ) continue // only read-only properties
                const good = cache.good[key]+''
                eq($(`#${testID} .stat .Oom-${key} .val`).text(), good
                  , '`#'+testID+' .stat .Oom-'+key+' .val` changed to '+good)
                //// Changing a read-only value via its underscore-prefixed
                //// ‘shadow’ does not invoke any validation or type-checking.
                //// Therefore we don’t test that `badVals` are rejected.
            }
            Class.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.devMainVue(): Automatic read-write statics - shows changes.
    it('shows that read-write statics have changed', function (done) {
        const cache = { good:{} }
        for (let key in stat) {
            if (! isReadWrite(key) ) continue // only read-write properties
            cache.good[key] = goodVals[ schema.stat[key].typeStr ]
            stat[key] = cache.good[key]
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadWrite(key) ) continue
                const good = cache.good[key]+''
                eq($(`#${testID} .stat .Oom-${key} .val .read-write`).val(), good
                  , '`#'+testID+' .stat .Oom-'+key+' .val` changed to '+good)
            }
            Class.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.devMainVue(): Automatic read-write statics - valid input.
    it('updates read-write statics after UI input', function (done) {
        const cache = { $el:{}, good:{} }
        for (let key in stat) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .stat .Oom-${key} .val .read-write`)
            cache.good[key] = goodVals[ schema.stat[key].typeStr ]
            simulateInput( cache.$el[key], cache.good[key] )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.good[key]+''
                  , `<INPUT> change should make Vue update stat.`+key)
            }
            Class.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.devMainVue(): Automatic read-write statics - invalid input.
    it('does not update read-write statics after invalid UI input', function (done) {
        const cache = { $el:{}, orig:{} }
        for (let key in stat) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .stat .Oom-${key} .val .read-write`)
            cache.orig[key] = cache.$el[key].val()
            simulateInput(
                cache.$el[key]
              , badVals[ schema.stat[key].typeStr ]
            )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.orig[key]
                  , `invalid <INPUT> change does not update stat.`+key)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })




    //// CUSTOM STATIC TESTS
    //@TODO




    //// AUTOMATIC ATTRIBUTE TESTS
    //// Test whether the class’s devMainVue() component produces a complete
    //// interactive representation of the class’s attributes. You don’t need to
    //// modify these tests unless you’ve given your class special behaviour.


    //// Oom.devMainVue(): Automatic attributes - initial values.
    //// `Vue.nextTick()` because Vue hasn’t initialised the properties yet.
    it('shows correct initial attributes', function (done) {
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                const $el = $(`#${testID} .attr .Oom-${key} .val`)
                const val = ( $el.find('.read-write')[0] )
                    ? $el.find('.read-write').val() // from an <INPUT>
                    : $el.text() // constant or read-only
                eq( val, attr[key]+''
                  , `Vue should set .Oom-${key} to attr.${key}`)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    }) // `bind(this)` to run the test in Mocha’s context)


    //// Oom.devMainVue(): Automatic read-only attributes - shows changes.
    it('shows that read-only attributes have changed', function (done) {
        const cache = { good:{} }
        for (let key in attr) {
            if (! isReadOnly(key) ) continue // only read-only properties
            cache.good[key] = goodVals[ schema.attr[key].typeStr ]
            attr['_'+key] = cache.good[key]
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadOnly(key) ) continue // only read-only properties
                const good = cache.good[key]+''
                eq($(`#${testID} .attr .Oom-${key} .val`).text(), good
                  , '`#'+testID+' .attr .Oom-'+key+' .val` changed to '+good)
                //// Changing a read-only value via its underscore-prefixed
                //// ‘shadow’ does not invoke any validation or type-checking.
                //// Therefore we don’t test that `badVals` are rejected.
            }
            instance.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.devMainVue(): Automatic read-write attributes - shows changes.
    it('shows that read-write attributes have changed', function (done) {
        const cache = { good:{} }
        for (let key in attr) {
            if (! isReadWrite(key) ) continue // only read-write properties
            cache.good[key] = goodVals[ schema.attr[key].typeStr ]
            attr[key] = cache.good[key]
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadWrite(key) ) continue
                const good = cache.good[key]+''
                eq($(`#${testID} .attr .Oom-${key} .val .read-write`).val(), good
                  , '`#'+testID+' .attr .Oom-'+key+' .val` changed to '+good)
            }
            instance.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.devMainVue(): Automatic read-write attributes - valid input.
    it('updates read-write attributes after UI input', function (done) {
        const cache = { $el:{}, good:{} }
        for (let key in attr) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .attr .Oom-${key} .val .read-write`)
            cache.good[key] = goodVals[ schema.attr[key].typeStr ]
            simulateInput( cache.$el[key], cache.good[key] )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.good[key]+''
                  , `<INPUT> change should make Vue update attr.`+key)
            }
            instance.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.devMainVue(): Automatic read-write attributes - invalid input.
    it('does not update read-write attributes after invalid UI input', function (done) {
        const cache = { $el:{}, orig:{} }
        for (let key in attr) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .attr .Oom-${key} .val .read-write`)
            cache.orig[key] = cache.$el[key].val()
            simulateInput(
                cache.$el[key]
              , badVals[ schema.attr[key].typeStr ]
            )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.orig[key]
                  , `invalid <INPUT> change does not update attr.`+key)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })




    //// CUSTOM ATTRIBUTE TESTS
    //@TODO






    }//testAfterMounted()
})//describe('The Oom.devMainVue() component')




describe('The Oom.devThumbAFrame*() set', function (done) {

    it('devThumbAFrame*() functions return expected objects', function(){try{
        //@TODO
    }catch(e){console.error(e.message);throw e}})

    const
        pfx = 'oom'
      , testID = `test-${pfx}-devthumb` // also used for component tag
      , vueComponent = Vue.component( testID, Class.devThumbAFrameVue(instance) )
      , aframeComponent = AFRAME.registerComponent(`${pfx}-devthumb`, Class.devThumbAFrame(instance) )
      , aframePrimative = AFRAME.registerPrimitive(`a-${pfx}-devthumb`, Class.devThumbAFramePrimative(instance, `${pfx}-devthumb`) )
      , $container = $('a-scene').append(`<a-entity id="${testID}">`
          + `<${testID}></${testID}></a-entity>`)
      , vue = new Vue({ el:'#'+testID, mounted:testAfterMounted })

    function testAfterMounted () {




    //// AUTOMATIC STATIC TESTS
    //// Test whether the devThumbAFrameVue component xxxxxx. You don’t need to modify these tests unless
    //// you’ve given your class special behaviour.


    it('devThumbAframeVue() creates a viable Vue component', function(){try{
        eq( $('#'+testID).length, 1
          , '#'+testID+' exists' )
        eq( $(`#${testID} a-${pfx}-devthumb`).length, 2
          , `Two <a-${pfx}-devthumb>s exist in #${testID}` )
    }catch(e){console.error(e.message);throw e}})


    it('on the inside, is a viable A-Frame component', function(){try{
        //@TODO
    }catch(e){console.error(e.message);throw e}})


    //// Oom.devThumbAFrameVue(): `hilite` static and attribute - change.
    //// `Vue.nextTick()` because Vue hasn’t initialised the properties yet.
    it('changing `stat/attr.hilite` changes box color', function (done) {
        const { firstObj, firstHex, secondObj, secondHex } = generateRandomColors()
        stat.hilite = firstHex
        attr.hilite = secondHex
        // Vue.nextTick(window.requestAnimationFrame(function(){let error;try{
        Vue.nextTick(function(){//@TODO be smarter than this two-tick trick
        Vue.nextTick((function(){let error;try{
            $(`#${testID} >a-entity`).attr('position', '0 0 0')
            let r = testPixels({ // results
                tol: 1 // tolerance, flat-shader, so no shaded side of box
              , pos: [
                    { x:0, y:0.5 } // middle of the left edge
                  , { x:1, y:0.5 } // middle of the right edge
                ]
              , exp: [
                    firstObj  // eg `{ r:0, g:255, b:0, a:255 }` to expect green
                  , secondObj // eg `{ r:0, g:0, b:255, a:255 }` to expect blue
                ]
            })
            eq( r[0].passes, 4, `mid-left pixel ${r[0].actualRGBA} is near-`
              + `enough expected hilite static ${r[0].expRGBA}`)
            eq( r[1].passes, 4, `mid-right pixel ${r[1].actualRGBA} is near-`
              + `enough expected hilite attribute ${r[1].expRGBA}`)
            $(`#${testID} >a-entity`).attr('position', '0 10 0')
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
        })
    }) // `bind(this)` to run the test in Mocha’s context)


    //// Oom.devThumbAFrameVue(): boxes respond to click.
    it('boxes can change `stat/attr.hilite` on click', function (done) {
        const { thirdObj, thirdHex, fourthObj, fourthHex } = generateRandomColors()
        const onOomEvent = function (evt) {
            if (! evt.detail) return
            const { el, type } = evt.detail
            if ('click' !== type) return
            if ( $(el).hasClass('stat') )
                stat.hilite = thirdHex
            if ( $(el).hasClass('attr') )
                attr.hilite = fourthHex
        }
        $(window).on('oom-event', onOomEvent)
        const evt = new MouseEvent('click')
        $(`#${testID} a-${pfx}-devthumb.stat`)[0].dispatchEvent(evt)
        $(`#${testID} a-${pfx}-devthumb.attr`)[0].dispatchEvent(evt)
        $(window).off('oom-event', onOomEvent)

        Vue.nextTick(function(){//@TODO be smarter than this two-tick trick
        Vue.nextTick((function(){let error;try{
            $(`#${testID} >a-entity`).attr('position', '0 0 0')
            let r = testPixels({ // results
                tol: 1 // tolerance, flat-shader, so no shaded side of box
              , pos: [
                    { x:0, y:0.5 } // middle of the left edge
                  , { x:1, y:0.5 } // middle of the right edge
                ]
              , exp: [
                    thirdObj  // eg `{ r:0, g:255, b:0, a:255 }` to expect green
                  , fourthObj // eg `{ r:0, g:0, b:255, a:255 }` to expect blue
                ]
            })
            eq( r[0].passes, 4, `mid-left pixel ${r[0].actualRGBA} is near-`
              + `enough expected hilite static ${r[0].expRGBA}`)
            eq( r[1].passes, 4, `mid-right pixel ${r[1].actualRGBA} is near-`
              + `enough expected hilite attribute ${r[1].expRGBA}`)
            eq( stat.hilite, thirdHex
              , '`stat.hilite` is now '+thirdHex )
            eq( attr.hilite, fourthHex
              , '`attr.hilite` is now '+fourthHex )
            $(`#${testID} >a-entity`).attr('position', '0 10 0')
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
        })
    }) // `bind(this)` to run the test in Mocha’s context)


    //@NEXT change A-Frame material directly - Vue should see that



    }//testAfterMounted()
})//describe('The Oom.devThumbAFrameVue() component')




})//describe('Oom (browser)')




describe('Oom.Dd (browser)', () => {
    const
        hid = true // `true` hides the components, `false` makes them visible
      , Class = ROOT.Oom.Dd
      , stat = Class.stat
      , schema = Class.schema
      , instance = new Class()
      , attr = instance.attr




describe('The Oom.Dd.devMainVue() component', function (done) {
    const
        testID = 'test-oom-dd-devmainvue' // also used for component tag
      , vueComponent = Vue.component( testID, Class.devMainVue(instance) )
      , $container = $('.container').append(`<div class="row ${hid?'hid':''}" `
          + `id="${testID}"><${testID}>Loading...</${testID}></div>`)
      , vue = new Vue({ el:'#'+testID, mounted:testAfterMounted })

    function testAfterMounted () {




    //// AUTOMATIC STATIC TESTS
    //// Test whether the class’s devMainVue() component produces a complete
    //// interactive representation of the class’s statics. You don’t need to
    //// modify these tests unless you’ve given your class special behaviour.


    //// Oom.Dd.devMainVue(): The component itself.
    it('is a viable Vue component', function(){try{
        eq( $('#'+testID).length, 1
          , '#'+testID+' exists' )
        eq( $('#'+testID+' .dev-main').length, 1
          , 'dev-main exists' )
        eq( $('#'+testID+' .dev-main .member-table').length, 2
          , 'Two member-tables exist (one for stat, one for attr)' )
    }catch(e){console.error(e.message);throw e}})


    //// Oom.Dd.devMainVue(): Automatic statics - initial values.
    //// `Vue.nextTick()` because Vue hasn’t initialised the properties yet.
    it('shows correct initial statics', function (done) {
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                const $el = $(`#${testID} .stat .Oom-${key} .val`)
                const val = ( $el.find('.read-write')[0] )
                    ? $el.find('.read-write').val() // from an <INPUT>
                    : $el.text() // constant or read-only
                eq( val, stat[key]+''
                  , `Vue should set .Oom-${key} to stat.${key}`)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    }) // `bind(this)` to run the test in Mocha’s context)


    //// Oom.Dd.devMainVue(): Automatic read-only statics - shows changes.
    it('shows that read-only statics have changed', function (done) {
        const cache = { good:{} }
        for (let key in stat) {
            if (! isReadOnly(key) ) continue // only read-only properties
            const def = schema.stat[key]
            cache.good[key] = goodVals[ def.typeStr ]
            const shadowObj = def.perClass ? stat : def.definedIn.stat
            shadowObj['_'+key] = cache.good[key] // `perClass` controls where a static’s ‘shadow’ value is stored
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadOnly(key) ) continue // only read-only properties
                const good = cache.good[key]+''
                eq($(`#${testID} .stat .Oom-${key} .val`).text(), good
                  , '`#'+testID+' .stat .Oom-'+key+' .val` changed to '+good)
                //// Changing a read-only value via its underscore-prefixed
                //// ‘shadow’ does not invoke any validation or type-checking.
                //// Therefore we don’t test that `badVals` are rejected.
            }
            Class.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.Dd.devMainVue(): Automatic read-write statics - shows changes.
    it('shows that read-write statics have changed', function (done) {
        const cache = { good:{} }
        for (let key in stat) {
            if (! isReadWrite(key) ) continue // only read-write properties
            cache.good[key] = goodVals[ schema.stat[key].typeStr ]
            stat[key] = cache.good[key]
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadWrite(key) ) continue
                const good = cache.good[key]+''
                eq($(`#${testID} .stat .Oom-${key} .val .read-write`).val(), good
                  , '`#'+testID+' .stat .Oom-'+key+' .val` changed to '+good)
            }
            Class.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.Dd.devMainVue(): Automatic read-write statics - valid input.
    it('updates read-write statics after UI input', function (done) {
        const cache = { $el:{}, good:{} }
        for (let key in stat) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .stat .Oom-${key} .val .read-write`)
            cache.good[key] = goodVals[ schema.stat[key].typeStr ]
            simulateInput( cache.$el[key], cache.good[key] )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.good[key]+''
                  , `<INPUT> change should make Vue update stat.`+key)
            }
            Class.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.Dd.devMainVue(): Automatic read-write statics - invalid input.
    it('does not update read-write statics after invalid UI input', function (done) {
        const cache = { $el:{}, orig:{} }
        for (let key in stat) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .stat .Oom-${key} .val .read-write`)
            cache.orig[key] = cache.$el[key].val()
            simulateInput(
                cache.$el[key]
              , badVals[ schema.stat[key].typeStr ]
            )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in stat) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.orig[key]
                  , `invalid <INPUT> change does not update stat.`+key)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })




    //// CUSTOM STATIC TESTS
    //@TODO




    //// AUTOMATIC ATTRIBUTE TESTS
    //// Test whether the class’s devMainVue() component produces a complete
    //// interactive representation of the class’s attributes. You don’t need to
    //// modify these tests unless you’ve given your class special behaviour.


    //// Oom.Dd.devMainVue(): Automatic attributes - initial values.
    //// `Vue.nextTick()` because Vue hasn’t initialised the properties yet.
    it('shows correct initial attributes', function (done) {
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                const $el = $(`#${testID} .attr .Oom-${key} .val`)
                const val = ( $el.find('.read-write')[0] )
                    ? $el.find('.read-write').val() // from an <INPUT>
                    : $el.text() // constant or read-only
                eq( val, attr[key]+''
                  , `Vue should set .Oom-${key} to attr.${key}`)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    }) // `bind(this)` to run the test in Mocha’s context)


    //// Oom.Dd.devMainVue(): Automatic read-only attributes - shows changes.
    it('shows that read-only attributes have changed', function (done) {
        const cache = { good:{} }
        for (let key in attr) {
            if (! isReadOnly(key) ) continue // only read-only properties
            cache.good[key] = goodVals[ schema.attr[key].typeStr ]
            attr['_'+key] = cache.good[key]
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadOnly(key) ) continue // only read-only properties
                const good = cache.good[key]+''
                eq($(`#${testID} .attr .Oom-${key} .val`).text(), good
                  , '`#'+testID+' .attr .Oom-'+key+' .val` changed to '+good)
                //// Changing a read-only value via its underscore-prefixed
                //// ‘shadow’ does not invoke any validation or type-checking.
                //// Therefore we don’t test that `badVals` are rejected.
            }
            instance.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.Dd.devMainVue(): Automatic read-write attributes - shows changes.
    it('shows that read-write attributes have changed', function (done) {
        const cache = { good:{} }
        for (let key in attr) {
            if (! isReadWrite(key) ) continue // only read-write properties
            cache.good[key] = goodVals[ schema.attr[key].typeStr ]
            attr[key] = cache.good[key]
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadWrite(key) ) continue
                const good = cache.good[key]+''
                eq($(`#${testID} .attr .Oom-${key} .val .read-write`).val(), good
                  , '`#'+testID+' .attr .Oom-'+key+' .val` changed to '+good)
            }
            instance.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.Dd.devMainVue(): Automatic read-write attributes - valid input.
    it('updates read-write attributes after UI input', function (done) {
        const cache = { $el:{}, good:{} }
        for (let key in attr) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .attr .Oom-${key} .val .read-write`)
            cache.good[key] = goodVals[ schema.attr[key].typeStr ]
            simulateInput( cache.$el[key], cache.good[key] )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.good[key]+''
                  , `<INPUT> change should make Vue update attr.`+key)
            }
            instance.reset()
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })


    //// Oom.Dd.devMainVue(): Automatic read-write attributes - invalid input.
    it('does not update read-write attributes after invalid UI input', function (done) {
        const cache = { $el:{}, orig:{} }
        for (let key in attr) {
            if (! isReadWrite(key) ) continue
            cache.$el[key] = $(`#${testID} .attr .Oom-${key} .val .read-write`)
            cache.orig[key] = cache.$el[key].val()
            simulateInput(
                cache.$el[key]
              , badVals[ schema.attr[key].typeStr ]
            )
        }
        Vue.nextTick((function(){let error;try{
            for (let key in attr) {
                if (! isReadWrite(key) ) continue
                eq( cache.$el[key].val(), cache.orig[key]
                  , `invalid <INPUT> change does not update attr.`+key)
            }
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
    })




    //// CUSTOM ATTRIBUTE TESTS
    //@TODO






    }//testAfterMounted()
})//describe('The Oom.Dd.devMainVue() component')




describe('The Oom.Dd.devThumbAFrame*() set', function (done) {

    it('devThumbAFrame*() functions return expected objects', function(){try{
        //@TODO
    }catch(e){console.error(e.message);throw e}})

    const
        pfx = 'oom-dd'
      , testID = `test-${pfx}-devthumb` // also used for component tag
      , vueComponent = Vue.component( testID, Class.devThumbAFrameVue(instance) )
      , aframeComponent = AFRAME.registerComponent(`${pfx}-devthumb`, Class.devThumbAFrame(instance) )
      , aframePrimative = AFRAME.registerPrimitive(`a-${pfx}-devthumb`, Class.devThumbAFramePrimative(instance, `${pfx}-devthumb`) )
      , $container = $('a-scene').append(`<a-entity id="${testID}">`
          + `<${testID}></${testID}></a-entity>`)
      , vue = new Vue({ el:'#'+testID, mounted:testAfterMounted })

    function testAfterMounted () {




    //// AUTOMATIC STATIC TESTS
    //// Test whether the devThumbAFrameVue component xxxxxx. You don’t need to modify these tests unless
    //// you’ve given your class special behaviour.


    it('devThumbAframeVue() creates a viable Vue component', function(){try{
        eq( $('#'+testID).length, 1
          , '#'+testID+' exists' )
        eq( $(`#${testID} a-${pfx}-devthumb`).length, 2
          , `Two <a-${pfx}-devthumb>s exist in #${testID}` )
    }catch(e){console.error(e.message);throw e}})


    it('on the inside, is a viable A-Frame component', function(){try{
        //@TODO
    }catch(e){console.error(e.message);throw e}})


    //// Oom.Dd.devThumbAFrameVue(): `hilite` static and attribute - change.
    //// `Vue.nextTick()` because Vue hasn’t initialised the properties yet.
    it('changing `stat/attr.hilite` changes box color', function (done) {
        const { firstObj, firstHex, secondObj, secondHex } = generateRandomColors()
        stat.hilite = firstHex
        attr.hilite = secondHex
        // Vue.nextTick(window.requestAnimationFrame(function(){let error;try{
        Vue.nextTick(function(){//@TODO be smarter than this two-tick trick
        Vue.nextTick((function(){let error;try{
            $(`#${testID} >a-entity`).attr('position', '0 0 0')
            let r = testPixels({ // results
                tol: 1 // tolerance, flat-shader, so no shaded side of box
              , pos: [
                    { x:0, y:0.5 } // middle of the left edge
                  , { x:1, y:0.5 } // middle of the right edge
                ]
              , exp: [
                    firstObj  // eg `{ r:0, g:255, b:0, a:255 }` to expect green
                  , secondObj // eg `{ r:0, g:0, b:255, a:255 }` to expect blue
                ]
            })
            eq( r[0].passes, 4, `mid-left pixel ${r[0].actualRGBA} is near-`
              + `enough expected hilite static ${r[0].expRGBA}`)
            eq( r[1].passes, 4, `mid-right pixel ${r[1].actualRGBA} is near-`
              + `enough expected hilite attribute ${r[1].expRGBA}`)
            $(`#${testID} >a-entity`).attr('position', '0 10 0')
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
        })
    }) // `bind(this)` to run the test in Mocha’s context)


    //// Oom.Dd.devThumbAFrameVue(): boxes respond to click.
    it('boxes can change `stat/attr.hilite` on click', function (done) {
        const { thirdObj, thirdHex, fourthObj, fourthHex } = generateRandomColors()
        const onOomEvent = function (evt) {
            if (! evt.detail) return
            const { el, type } = evt.detail
            if ('click' !== type) return
            if ( $(el).hasClass('stat') )
                stat.hilite = thirdHex
            if ( $(el).hasClass('attr') )
                attr.hilite = fourthHex
        }
        $(window).on('oom-event', onOomEvent)
        const evt = new MouseEvent('click')
        $(`#${testID} a-${pfx}-devthumb.stat`)[0].dispatchEvent(evt)
        $(`#${testID} a-${pfx}-devthumb.attr`)[0].dispatchEvent(evt)
        $(window).off('oom-event', onOomEvent)

        Vue.nextTick(function(){//@TODO be smarter than this two-tick trick
        Vue.nextTick((function(){let error;try{
            $(`#${testID} >a-entity`).attr('position', '0 0 0')
            let r = testPixels({ // results
                tol: 1 // tolerance, flat-shader, so no shaded side of box
              , pos: [
                    { x:0, y:0.5 } // middle of the left edge
                  , { x:1, y:0.5 } // middle of the right edge
                ]
              , exp: [
                    thirdObj  // eg `{ r:0, g:255, b:0, a:255 }` to expect green
                  , fourthObj // eg `{ r:0, g:0, b:255, a:255 }` to expect blue
                ]
            })
            eq( r[0].passes, 4, `mid-left pixel ${r[0].actualRGBA} is near-`
              + `enough expected hilite static ${r[0].expRGBA}`)
            eq( r[1].passes, 4, `mid-right pixel ${r[1].actualRGBA} is near-`
              + `enough expected hilite attribute ${r[1].expRGBA}`)
            eq( stat.hilite, thirdHex
              , '`stat.hilite` is now '+thirdHex )
            eq( attr.hilite, fourthHex
              , '`attr.hilite` is now '+fourthHex )
            $(`#${testID} >a-entity`).attr('position', '0 10 0')
        }catch(e){error=e;console.error(e.message)}done(error)}).bind(this))
        })
    }) // `bind(this)` to run the test in Mocha’s context)


    //@NEXT change A-Frame material directly - Vue should see that



    }//testAfterMounted()
})//describe('The Oom.Dd.devThumbAFrameVue() component')




})//describe('Oom.Dd (browser)')





//// Calling `mocha.run()` here will run all of the test files, including the
//// ones which haven’t loaded yet. Note that `mocha.run()` does not need to be
//// called when running Mocha tests under Node.js.
$(mocha.run)

}(window)




//// UTILITY

//// Uses jQuery to simulate an <INPUT>’s value being changed. The simple
//// `$('.my-input').val('abc').trigger('input')` does not trigger Vue.
//// From https://github.com/vuejs/Discussion/issues/157#issuecomment-273301588
function simulateInput ($input, val) {
    $input.val(val)
    const e = document.createEvent('HTMLEvents')
    e.initEvent('input', true, true)
    $input[0].dispatchEvent(e)
}


//// Test whether one or more pixel in an A-Frame scene is the expected colour.
function testPixels (config) {

    //// Apply defaults to `config`.
    const c = Object.assign({}, {
        tol: 5 // tolerance, eg if expected is 245, allow 241 to 249
      , pos: [ // positions
            { x:0.5, y:0.5 } // center middle by default
        ]
      , exp: [ // expected
            { r:255, g:0, b:0, a:255 } // 100% red by default
        ]
    }, config)

    //// Get a reference to A-Frame’s ‘screenshot’ canvas.
    const sceneEl = $('a-scene')[0]
    const captureCanvas = sceneEl.components.screenshot.getCanvas('perspective')
    const captureCtx = captureCanvas.getContext('2d')

    //// Copy the screenshot canvas, and add it to our list of thumbnails.
    const cloneCanvas = document.createElement('canvas');
    const cloneCtx = cloneCanvas.getContext('2d');
    cloneCanvas.width = captureCanvas.width;
    cloneCanvas.height = captureCanvas.height;
    cloneCtx.drawImage(captureCanvas, 0, 0);
    $('#screenshots').append(cloneCanvas)

    //// Test the RGBA colour value of each specified pixel.
    const r = []
    for (let i=0; i<c.pos.length; i++) {
        const { x, y } = c.pos[i]
        const exp = c.exp[i]
        const tol = c.tol

        //// Prevent pixel outside canvas bounds, if `x` or `y` are set to `1`.
        const xClamped =
            0 > x  ? 0
          : 1 <= x ? captureCanvas.width - 1
          : captureCanvas.width * x
        const yClamped =
            0 > y  ? 0
          : 1 <= y ? captureCanvas.height - 1
          : captureCanvas.width * y

        //// Get the colour at the specified position.
        const actual = Array.from(
            cloneCtx.getImageData(
                ~~xClamped // x position
              , ~~yClamped // x position
              , 1, 1 // one pixel
            ).data )

        //// If `passes` is `4`, all four channels are within tolerance.
        let passes = 0
        passes += ( actual[0] < (exp.r+tol) ) && ( actual[0] > (exp.r-tol) )
        passes += ( actual[1] < (exp.g+tol) ) && ( actual[1] > (exp.g-tol) )
        passes += ( actual[2] < (exp.b+tol) ) && ( actual[2] > (exp.b-tol) )
        passes += ( actual[3] < (exp.a+tol) ) && ( actual[3] > (exp.a-tol) )

        //// Add to the test results array.
        r[i] = {
            passes
          , actualRGBA: `rgba(${actual.join(',')})`
          , expRGBA:    `rgba(${exp.r},${exp.g},${exp.b},${exp.a})`
        }
    }

    //// Return the test results.
    return r
}


//// Returns four different random colours, as an object like:
//// { firstObj:{r:0,g:0,b:128}, firstHex:'#000080', ..., fourthHex:'#ff80ff' }
function generateRandomColors () {
    const colors = []
    for (let i=1; i<26; i++) { // `1` to avoid black
        const color = ( '00'+i.toString(3) ).slice(-3) // '000' to '222'
        colors.push([
            2 == color[0] ? 255 : 1 == color[0] ? 128 : 0 // r
          , 2 == color[1] ? 255 : 1 == color[1] ? 128 : 0 // g
          , 2 == color[2] ? 255 : 1 == color[2] ? 128 : 0 // b
          , '#' + color.replace(/0/g,'00').replace(/1/g,'80').replace(/2/g,'ff')
        ])
    }
    const out = {}
    ;['first','second','third','fourth'].forEach( (prefix,i) => {
        const from =   ~~( i * colors.length / 4 )
        const to = ~~( (i+1) * colors.length / 4 )
        const index = ~~( Math.random() * (to - from) ) + from
        const [ r, g, b, hex ] = colors[index]
        out[prefix+'Hex'] = hex
        out[prefix+'Obj'] = { r, g, b, a:255 }
    })
    return out
}
