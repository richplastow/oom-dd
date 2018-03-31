//// ECMASwitch //// 1.3.7 //// March 2018 //// ecmaswitch.loop.coop/ /////////

!function (ROOT) { 'use strict'

//// Create the namespace-object if it does not already exist and add constants.
var ECMASwitch = ROOT.ECMASwitch = ROOT.ECMASwitch || {}
var s, onAllLoadedFn
ECMASwitch.NAME     = 'ECMASwitch'
ECMASwitch.VERSION  = '1.3.7'
ECMASwitch.HOMEPAGE = 'http://ecmaswitch.loop.coop/'

//// Polyfill `document` for non-browser contexts.
var d = ROOT.document || {
    cookie: '~0~'
  , write:  function (x) {} // @TODO Node.js translate`<script>` to `require()`
}




//// BEGIN DYNAMIC SECTION /////////////////////////////////////////////////////
//// This dynamic section is kept up to date by ‘oomtility/make.js’ ////////////

var projectLC = '${{projectLC}}'
var classFiles = 'Bases'

//// END DYNAMIC SECTION ///////////////////////////////////////////////////////




//// PUBLIC API

////
ECMASwitch.hasLoaded = function (el) {
    var matches = []
      , position
      , elFilename = el.src.split('/').pop()
    for (var i=0; i<s.length; i++) {
        var expectedFilename = s[i].split('/').pop()
        if ( elFilename === expectedFilename ) {
            matches.push(expectedFilename)
            position = i
        }
    }
    if (0 === matches.length) throw Error(elFilename+' not expected')
    if (1 !== matches.length) throw Error(matches.length+' matches for '+elFilename)
    s.splice(position,1)
    if (0 === s.length && onAllLoadedFn)
        onAllLoadedFn()
}

////
ECMASwitch.load = function (path, names, onAllLoaded) {
    if (! path) throw Error("ECMASwitch.load(): Set `path`, eg './' or '../'")
    if (onAllLoaded) onAllLoadedFn = onAllLoaded
    var f = ~~d.cookie.split('~')[1] // script format, 0 - 3
      , p = path + ( (3 == f) ? 'src/' : 'dist/' ) // get path to proper format
      , B = '<script onload="ECMASwitch.hasLoaded(this)" src="'  // begin
      , E = '"></'+'script>' // end
    s = // src values
        (1 == f) ? [ // ES5 Minified
            path + 'support/asset/js/traceur-runtime.min.js'
          , p + 'main/' + projectLC + '.5.min.js'
        ]
      : (2 == f) ? [ // ES6 Production
            p + 'main/' + projectLC + '.6.js'
        ]
      : (3 == f) ?   // ES6 Development
            (p+'main/'+classFiles.replace(/,/g,'.6.js|'+p+'main/')+'.6.js')
           .split('|')
      : [            // ES5 Production (the default, if no cookies been set)
            path + 'support/asset/js/traceur-runtime.min.js'
          , p + 'main/' + projectLC + '.5.js'
        ]
    names = names || []
    for (var i=0; i<names.length; i++) if (names[i][f]) s.push( names[i][f] )
    s.unshift(path + 'support/asset/js/polyfill.min.js') //@TODO only load for legacy browsers
    s.unshift(path + 'support/asset/js/vue-2.5.13.min.js') // load second
    s.unshift(path + 'support/asset/js/jquery-3.3.1.min.js') // load first
    d.write(B + s.join(E + B) + E)
}


}( 'object' === typeof global ? global : this ) // `window` in a browser
