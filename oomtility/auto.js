!function () { 'use strict'

const NAME     = 'Oomtility Auto'
    , VERSION  = '1.3.7'
    , HOMEPAGE = 'http://oomtility.loop.coop'

    , BYLINE   = (`\n\n\n\n//// Initialised by ${NAME} ${VERSION}\n`
               + `${HOMEPAGE} /////////////////////////////`).slice(0,84) + '\n'
    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script initialises source, test and demo files for new classes and
and methods. It can also remove these files. It also updates the ‘dynamic’
sections of various ‘support/’ files. @TODO docs

Installation
------------
If you haven’t done it already, you should set up the \`oomauto\` alias:
$ node oomtility/alias.js

Basic Usage
-----------
$ cd /path/to/your/oom/repo/      # An Oom repo directory
$ oomauto --version               # Show the current ${NAME} version
$ oomauto Base Another Base.Sub   # Generate files for three new classes
$ oomauto Base.Sub.foo topLevel   # Generate files for two new methods
$ oomauto -r Another Base.Sub     # Remove two classes’s files (+ methods)
$ oomauto --remove Base.Sub.foo   # Remove a method from a class

Generate Or Remove Files
------------------------
1.  src/main/Base.Sub.6.js                  Source file for Base.Sub class
2.  src/test/Base.Sub-all.6.js              Basic unit tests you’ll add to
3.  src/test/Base.Sub-browser.6.js          As above, for browsers only
4.  src/test/Base.Sub-node.6.js             As above, for Node.js only
5.  src/test/Base.Sub-wp.6.js               As above, for WordPress integration
6.  src/demo/Base.Sub-demo.6.js             Usage example script
7.  support/demo-base.sub.html              Usage example page (lowercase)
8.  src/main/Base.Sub.foo.6.js              Source file for foo() method
9.  src/test/Base.Sub.foo-all.6.js          Basic unit tests you’ll add to
10. src/test/Base.Sub.foo-browser.6.js      As above, for browsers only
11. src/test/Base.Sub.foo-node.6.js         As above, for Node.js only
12. src/test/Base.Sub.foo-wp.6.js           As above, for WordPress integration

Edit Files
----------
1. support/demo.html                       Link to each usage example
2. support/asset/js/ecmaswitch.js          \`var classFiles = '...'\` updated
3. support/test.html                       ‘Development ES6’ links
X. src/main/README.md                      Documentation for each class @TODO move to docs.js
X. support/docs.html                       Documentation for each class @TODO move to docs.js

Options
-------
-h  --help      Show this help message
-r  --remove    Remove existing class or classes from the project
-v  --version   Show the current ${NAME} version

This script lives at ${HOMEPAGE}
`


//// Validate the environment.
const nodePath = process.argv.shift()
const selfPath = process.argv.shift()
if ( '/oomtility/auto.js' !== selfPath.slice(-18) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== selfPath.slice(0,-18) ) )
    return console.warn(`Unexpected CWD, try:\n  $ cd ${selfPath.slice(0,-18)}`)
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node oomtility/auto.js')




//// SETUP


//// Load library functionality.
const fs = require('fs')
    , wrapped = require('./wrapped.js')

//// Set constants.
const rxClassname
    = /^[A-Z][A-Za-z0-9]+(\.[A-Z][A-Za-z0-9]+)*$/
const rxMethodname
    = /^([A-Z][A-Za-z0-9]+\.)?([A-Z][A-Za-z0-9]+\.)*[a-z][A-Za-z0-9]+$/
const topline = (fs.readFileSync(`src/main/Bases.6.js`)+'').split('\n')[0]
const [
    x1          // four slashes
  , projectTC   // titlecase with a dot, eg 'Oom.Foo'
  , x2          // four slashes
  , projectV    // current project version, eg ‘1.2.3’
  , x3          // four slashes
  , projectMth  // current last-updated month, eg ‘January’
  , projectYYYY // current last-updated year, eg ‘2018’
  , x4          // four slashes
  , projectURL  // project URL, eg ‘http://oom-foo.loop.coop/’
] = topline.split(' ')
const projectLC  = process.cwd().split('/').pop() // lowercase, eg 'oom-foo'
if ( projectLC.toLowerCase() != projectLC) return console.warn(
    `Project '${projectLC}' contains uppercase letters`)
if ( projectTC.toLowerCase().replace(/\./g,'-') != projectLC) return console.warn(
    `Project '${projectLC}' is called '${projectTC}' in src/main/Bases.6.js`)
if (! /^Oom\.[A-Z][a-z]+$/.test(projectTC) )
    return console.warn(`Bases.6.js’s topline title '${projectTC}' is invalid`)
const projectRepo = 'https://github.com/loopdotcoop/' + projectLC
const projectNPM  = 'https://www.npmjs.com/package/' + projectLC

//// Simplifies moving ‘Bases.6.js’ to the start of concatenation.
Array.prototype.move = function(from, to) { // stackoverflow.com/a/7180095
    this.splice(to, 0, this.splice(from, 1)[0]) }

//// Declare variables.
let opt, remove, classes = [], methods = [], mains, tests, pos
  , genTally = 0

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-h' === opt || '--help'    === opt) return console.log(HELP)
    if ('-r' === opt || '--remove'  === opt) { remove = true; continue }
    if ('-v' === opt || '--version' === opt) return console.log(NAME, VERSION)
    if ( rxClassname.test(opt) )
        classes.push(opt)
    else if ( rxMethodname.test(opt) )
        methods.push(opt)
    else
        console.warn(`Ignoring '${opt}' - not a valid option, class or method`)
}

//// The special 'Bases' class name must not be used. Also, the main class
//// defined in ‘Bases.6.js’ (same name as the project) cannot appear in `name`.
for (let i=0, name; name=classes[i]; i++) {
    if (projectTC === name || 'Bases' === name)
        return console.warn(`‘Bases.6.js’ ${remove
          ? 'must exist':'already exists'} (it defines '${projectTC}')`)
    if ( projectTC === name.split('.')[0] )
        return console.warn(`'${name}' invalid: cannot contain '${projectTC}'`)
    if ('Bases' === name.split('.')[0] )
        return console.warn(`'${name}' invalid: reserved class name 'Bases'`)
    //@TODO must not be alphabetically before 'Bases'?
    //@TODO re-test all this, it’s probably broken since changing from App to Bases
}

//// Methods must not be added to the special 'Bases' class name.
for (let i=0, name; name=methods[i]; i++)
    if ('Bases' === name.split('.')[0] )
        return console.warn(`'${name}' invalid: reserved class name 'Bases'`)

//// Ignore duplicate class names and method names.
classes = new Set(classes)
methods = new Set(methods)




//// GENERATE OR REMOVE FILES


//// 1.  src/main/Base.Sub.6.js                  Source file for Base.Sub class

classes.forEach( name => { generateOrRemove(
    name
  , `src/main/${name}.6.js`
  , generateClass
) })


//// 2.  src/test/Base.Sub-all.6.js              Basic unit tests you’ll add to
classes.forEach( name => { generateOrRemove(
    name
  , `src/test/${name}-all.6.js`
  , generateClassAll
) })


//// 3.  src/test/Base.Sub-browser.6.js          As above, for browsers only
classes.forEach( name => { generateOrRemove(
    name
  , `src/test/${name}-browser.6.js`
  , generateClassBrowser
) })


//// 4.  src/test/Base.Sub-node.6.js             As above, for Node.js only
classes.forEach( name => { generateOrRemove(
    name
  , `src/test/${name}-node.6.js`
  , generateClassNode
) })


//// 5.  src/test/Base.Sub-wp.6.js               As above, for WordPress integration
classes.forEach( name => { generateOrRemove(
    name
  , `src/test/${name}-wp.6.js`
  , generateClassWp
) })


//// 6.  src/demo/Base.Sub-demo.6.js             Usage example script
classes.forEach( name => { generateOrRemove(
    name
  , `src/demo/${name}-demo.6.js`
  , generateDemoScript
) })


//// 7.  support/demo-base.sub.html              Usage example page (lowercase)
classes.forEach( name => { generateOrRemove(
    name
  , `support/demo-${name.toLowerCase().replace(/\./g,'-')}.html`
  , generateDemoPage
) })


//// 8.  src/main/Base.Sub.foo.6.js              Source file for foo() method

methods.forEach( name => { generateOrRemove(
    name
  , `src/main/${-1===name.indexOf('.')?'App.':''}${name}.6.js`//@TODO fix
  , generateMethod
) }) // note that we prefix a top-level method’s filename with ‘App.’@TODO fix


//// 9.  src/test/Base.Sub.foo-all.6.js          Basic unit tests you’ll add to
methods.forEach( name => { generateOrRemove(
    name
  , `src/test/${-1===name.indexOf('.')?'App.':''}${name}-all.6.js`//@TODO fix
  , generateMethodAll
) })


//// 10. src/test/Base.Sub.foo-browser.6.js      As above, for browsers only

methods.forEach( name => { generateOrRemove(
    name
  , `src/test/${-1===name.indexOf('.')?'App.':''}${name}-browser.6.js`//@TODO fix
  , generateMethodBrowser
) })


//// 11. src/test/Base.Sub.foo-node.6.js         As above, for Node.js only

methods.forEach( name => { generateOrRemove(
    name
  , `src/test/${-1===name.indexOf('.')?'App.':''}${name}-node.6.js`//@TODO fix
  , generateMethodNode
) })


//// 12. src/test/Base.Sub.foo-wp.6.js           As above, for WordPress integration

methods.forEach( name => { generateOrRemove(
    name
  , `src/test/${-1===name.indexOf('.')?'App.':''}${name}-wp.6.js`//@TODO fix
  , generateMethodWp
) })




//// EDIT @TODO MOVE TO `oomtility/docs.js`


//// 1. src/main/README.md                      Documentation for each class
// @todo


//// 3. support/docs.html                       Documentation for each class
// @todo




//// EDIT FILES

//// 1. support/demo.html                       Link to each usage example
wrapped.updateDemoFile('support/demo.html', 'support')


//// 2. support/asset/js/ecmaswitch.js          `var classFiles = '...'` updated
mains = fs.readdirSync('src/main')
if ( -1 === (pos = mains.indexOf('Bases.6.js')) )
    return console.warn('No ‘src/main/Bases.6.js’')
mains.move(pos, 0) // ‘src/main/Bases.6.js’ must go 1st (`move()` defined above)
wrapped.updateECMASwitch('support/asset/js/ecmaswitch.js', mains, projectLC)


//// 3. support/test.html                       ‘Development ES6’ links
tests = fs.readdirSync('src/test')
wrapped.updateTestFile('support/test.html', tests) // `tests` from previous step




//// FINISH

console.log(
    NAME + ` ${remove?'remov':'generat'}ed ${genTally} files, and edited 3`)




//// GENERATORS


////
function generateClass (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeClass6Js )
    fn( getClassConfig(name), path )
}


////
function generateClassAll (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeClassAll6Js )
    fn( getClassConfig(name), path )
}


////
function generateClassBrowser (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeClassBrowser6Js )
    fn( getClassConfig(name), path )
}


////
function generateClassNode (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeClassNode6Js )
    fn( getClassConfig(name), path )
}


////
function generateClassWp (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeClassWp6Js )
    fn( getClassConfig(name), path )
}


////
function generateDemoScript (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeDemo6Js )
    fn( getDemoConfig(name), path )
}


////
function generateDemoPage (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeClassDemoHtml )
    fn( getDemoConfig(name), path )
}


////
function generateMethod (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeMethod6Js )
    fn( getMethodConfig(name), path )
}


////
function generateMethodAll (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeMethodAll6Js )
    fn( getMethodConfig(name), path )
}


////
function generateMethodBrowser (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeMethodBrowser6Js )
    fn( getMethodConfig(name), path )
}


////
function generateMethodNode (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeMethodNode6Js )
    fn( getMethodConfig(name), path )
}


////
function generateMethodWp (name, path) {
    const fn = ( wrapped[ pathToFnName(path) ] || wrapped.writeMethodWp6Js )
    fn( getMethodConfig(name), path )
}




//// UTILITY


////
function generateOrRemove (name, path, generator) {
    const exists = fs.existsSync(path)
    if (remove && ! exists)
        return console.warn(`Doesn’t exist: ${path}`)
    if (! remove && exists)
        return console.warn(`Already exists: ${path}`)
    if (remove)
        fs.unlinkSync(path)
    else
        generator(name, path)
    genTally++
}


////
function getClassConfig (name) {
    const classname = `${projectTC}.${name}`
    return {
        isApp: false //@TODO remove from all Oomtility
      , isTop: 2 > name.split('.').length
      , classname
      , topline
      , remarks: '@TODO'
      , extendname: classname.split('.').slice(0,-1).join('.')
    }
}


////
function getMethodConfig (name) {
    const methodname = `${projectTC}.${name}`
    return {
        classname: methodname.split('.').slice(0,-1).join('.')
      , methodname
      , methodshort: methodname.split('.').pop()
      , topline
      , remarks: '@TODO'
    }
}


////
function getDemoConfig(name) {
    const config = getClassConfig(name)
    return Object.assign({}, config, {
        nameLC: name.replace(/\./g,'-').toLowerCase()
      , projectTC
      , projectLC
      , tagname: 'oom-' + name.split('.').pop().toLowerCase()
      , name
      , homepage: projectURL
      , repo: projectRepo
      , npm: projectNPM
    })
}


//// Similar to `lcToTc()`. 'foo/bar-baz.txt' to 'getBarBazTxt'.
//// Note that we may have several README.md files - they get special treatment.
//// Identical to pathToFnName() in init.js and wrap.js @TODO D.R.Y.
function pathToFnName (path) {
    if ( 'oomtility/wrap/' === path.slice(0,15) )
        path = path.slice(15)
    if ( '/README.md' === path.slice(-10) ) // eg 'wp/README.md'
        path = path.replace(/\//g, '-') // eg 'wp-README.md'
    return 'write' + (
        path.split('/').pop().split(/[- .]/g).map(
            w => w ? w[0].toUpperCase() + w.substr(1) : ''
        ).join('')
    )
}




}()
