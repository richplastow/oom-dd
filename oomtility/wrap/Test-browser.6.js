describe('${{classname}} (browser)', () => {
    const
        hid = true // `true` hides the components, `false` makes them visible
      , Class = ROOT.${{classname}}
      , stat = Class.stat
      , schema = Class.schema
      , instance = new Class()
      , attr = instance.attr




describe('The ${{classname}}.devMainVue() component', function (done) {
    const
        testID = 'test-${{classname.toLowerCase().replace(/\./g,'-')}}-devmainvue' // also used for component tag
      , vueComponent = Vue.component( testID, Class.devMainVue(instance) )
      , $container = $('.container').append(`<div class="row ${hid?'hid':''}" `
          + `id="${testID}"><${testID}>Loading...</${testID}></div>`)
      , vue = new Vue({ el:'#'+testID, mounted:testAfterMounted })

    function testAfterMounted () {




    //// AUTOMATIC STATIC TESTS
    //// Test whether the class’s devMainVue() component produces a complete
    //// interactive representation of the class’s statics. You don’t need to
    //// modify these tests unless you’ve given your class special behaviour.


    //// ${{classname}}.devMainVue(): The component itself.
    it('is a viable Vue component', function(){try{
        eq( $('#'+testID).length, 1
          , '#'+testID+' exists' )
        eq( $('#'+testID+' .dev-main').length, 1
          , 'dev-main exists' )
        eq( $('#'+testID+' .dev-main .member-table').length, 2
          , 'Two member-tables exist (one for stat, one for attr)' )
    }catch(e){console.error(e.message);throw e}})


    //// ${{classname}}.devMainVue(): Automatic statics - initial values.
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


    //// ${{classname}}.devMainVue(): Automatic read-only statics - shows changes.
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


    //// ${{classname}}.devMainVue(): Automatic read-write statics - shows changes.
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


    //// ${{classname}}.devMainVue(): Automatic read-write statics - valid input.
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


    //// ${{classname}}.devMainVue(): Automatic read-write statics - invalid input.
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


    //// ${{classname}}.devMainVue(): Automatic attributes - initial values.
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


    //// ${{classname}}.devMainVue(): Automatic read-only attributes - shows changes.
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


    //// ${{classname}}.devMainVue(): Automatic read-write attributes - shows changes.
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


    //// ${{classname}}.devMainVue(): Automatic read-write attributes - valid input.
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


    //// ${{classname}}.devMainVue(): Automatic read-write attributes - invalid input.
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
})//describe('The ${{classname}}.devMainVue() component')




describe('The ${{classname}}.devThumbAFrame*() set', function (done) {

    it('devThumbAFrame*() functions return expected objects', function(){try{
        //@TODO
    }catch(e){console.error(e.message);throw e}})

    const
        pfx = '${{classname.toLowerCase().replace(/\./g,"-")}}'
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


    //// ${{classname}}.devThumbAFrameVue(): `hilite` static and attribute - change.
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


    //// ${{classname}}.devThumbAFrameVue(): boxes respond to click.
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
})//describe('The ${{classname}}.devThumbAFrameVue() component')




})//describe('${{classname}} (browser)')
