!function () { 'use strict'

const NAME     = 'Oomtility Test'
    , VERSION  = '1.3.7'
    , HOMEPAGE = 'http://oomtility.loop.coop'

    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script runs the ‘all’ and ‘node’ tests in ‘src/test’. it can also
launch ‘support/test.html’ in your default browser.

Installation
------------
You’ll need Mocha and Chai installed globally before running test.js:
$ npm install -g mocha; npm install -g chai

If you get permission errors, run this before:
$ sudo chmod -R a+w $(npm root -q -g); sudo chmod -R a+w $(npm bin -q -g)
...and this after:
$ sudo chmod -R a-w $(npm root -q -g); sudo chmod -R a-w $(npm bin -q -g)

If you get \`require()\` errors, try:
$ export NODE_PATH=$(npm root -q -g)

If you haven’t done it already, you should set up the \`oomtest\` alias:
$ node oomtility/alias.js

Basic Usage
-----------
$ cd /path/to/your/oom/repo/  # An Oom repo directory
$ oomtest --version           # Show the current ${NAME} version
$ oomtest                     # Run ‘all’ and ‘node’ tests in Node
$ oomtest --browser           # Run Node tests and browser tests
$ npm test                    # Same as \`$ oomtest\`
$ npm test -- --browser       # Same as \`$ oomtest --browser\` (note extra \`--\`)

Options
-------
-b  --browser   Also launch ‘support/test.html’ in the default browser
-q  --quieter   Only show a single line result
-h  --help      Show this help message
-v  --version   Show the current ${NAME} version

This script lives at ${HOMEPAGE}
`


//// Validate the environment for `$ mocha oomtility/test.js`, and run tests.
if ( process.argv[1] && 'mocha/bin/_mocha' === process.argv[1].slice(-16) ) {
    //@TODO validate the environment
    const readdirSync = require('fs').readdirSync, CWD = process.cwd()
    readdirSync(CWD+'/src/main/')
       .filter( p => '.6.js' === p.slice(-5) )
       .forEach(p => require(CWD+'/src/main/'+p) )
    readdirSync(CWD+'/src/test/') // first run all the universal tests...
       .filter( p => '-all.6.js' === p.slice(-9) )
       .forEach(p => require(CWD+'/src/test/'+p) )
    readdirSync(CWD+'/src/test/') // ...then run all the node-only tests
       .filter( p => '-node.6.js' === p.slice(-10) )
       .forEach(p => require(CWD+'/src/test/'+p) )
    return
}

//// Validate the environment for `$ node oomtility/test.js` or `$ oomtest`.
const nodePath = process.argv.shift()
const selfPath = process.argv.shift()
if ( '/oomtility/test.js' !== selfPath.slice(-18) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== selfPath.slice(0,-18) ) )
    return console.warn(`Unexpected CWD, try:\n  $ cd ${selfPath.slice(0,-18)}`)
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node oomtility/test.js')




//// SETUP


//// Load library functionality.
const { spawn } = require('child_process')

//// Set constants.
const projectLC = process.cwd().split('/').pop() // lowercase, eg 'foo-bar'

//// Declare variables.
let opt, browser, quieter

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-h' === opt || '--help'    === opt) return console.log(HELP)
    if ('-v' === opt || '--version' === opt) return console.log(NAME, VERSION)
    if ('-b' === opt || '--browser' === opt) { browser = true; continue }
    if ('-q' === opt || '--quieter' === opt) { quieter = true; continue }
}




//// RUN MOCHA


//// Spawn a Mocha sub-process.
const subProc = spawn('mocha', ['oomtility/test.js'])
subProc.stdout.on('data', data => subprocOut(data) )
subProc.stderr.on('data', data => subprocOut(data, `mocha: stderr`) )
subProc.on('exit', (code, signal) => {
    if (code) subprocOut(
        `exited with code ${code} and signal ${signal}`, 'mocha')
})


//// Launch the browser tests.
if (browser) {
    const exec = require('child_process').exec
    exec(
        'open file://' + process.cwd() + '/support/test.html'
      , function(error, stdout, stderr) {
            if (error) console.warn(error)
        }
    )
}




//// UTILITY


////
function subprocOut (data, prefix) {
    (data+'').split('\n').forEach( line => {
        if ( '' === line.trim() )
            return // don’t output blank lines
        if ( quieter && ! prefix && ! /^\s*\d+ passing \(\d+ms\)$/.test(line) )
            return // in ‘quieter’ mode, only output errors or the final line
        console.log(prefix ? `${prefix}: ${line}` : line)
    })
}


}()




/* Kept for reference:
//// In '--quieter' mode, capture calls to `console.log()` etc.
let captured, oldConsoleLog, oldConsoleWarn, oldConsoleError
if (quieter) {
    const { Writable } = require('stream')
    captured = []
    const capturer = new Writable({
        write (chunk, encoding, callback) {
            captured.push(chunk+'')
            callback()
        }
    })
    oldConsoleLog   = console.log
    oldConsoleWarn  = console.warn
    oldConsoleError = console.error
    const captureConsole = new console.Console(capturer, capturer)
    console.log   = captureConsole.log
    console.warn  = captureConsole.warn
    console.error = captureConsole.error
}

...run code which uses console here...

//// In '--quieter' mode, show a summary of the tests.
if (quieter) {
    console.log   = oldConsoleLog
    console.warn  = oldConsoleWarn
    console.error = oldConsoleError
console.log(captured);
    // const fails = captured.filter( // green tick is '\x1b[32m\u2714\x1b[0m'
    //     l => '\x1b[31m\u2718\x1b[0m' === l.slice(0,10) ? l : null )
    // if (fails.length)
    //     console.log(fails.join(''))
    // else
    //     console.log(
    //         NAME+` passed ${captured.length} test${1===captured.length?'':'s'}`)
}
*/
