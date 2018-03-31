!function () { 'use strict'

const NAME     = 'Oomtility HTTP'
    , VERSION  = '1.3.7'
    , HOMEPAGE = 'http://oomtility.loop.coop'

    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script serves your Oom repo locally over HTTP, usually at:
http://127.0.0.1:9966
It also provides a live development environment, where you can run various
Oomtilities.

Installation
------------
You’ll need Beefy installed globally before running http.js:
$ npm install -g beefy

If you get permission errors, run this before:
$ sudo chmod -R a+w $(npm root -q -g); sudo chmod -R a+w $(npm bin -q -g)
...and this after:
$ sudo chmod -R a-w $(npm root -q -g); sudo chmod -R a-w $(npm bin -q -g)

If you get \`require()\` errors, try:
$ export NODE_PATH=$(npm root -q -g)

If you haven’t done it already, you should set up the \`oomhttp\` alias:
$ node oomtility/alias.js

Basic Usage
-----------
$ cd /path/to/your/oom/repo/  # An Oom repo directory
$ oomhttp --version           # Show the current ${NAME} version
$ oomhttp                     # Serve your Oom repo at http://127.0.0.1:9966

Options
-------
-h  --help      Show this help message
-v  --version   Show the current ${NAME} version

This script lives at ${HOMEPAGE}
`


//// Validate the environment.
const nodePath = process.argv.shift()
const selfPath = process.argv.shift()
if ( '/oomtility/http.js' !== selfPath.slice(-18) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== selfPath.slice(0,-18) ) )
    return console.warn(`Unexpected CWD, try:\n  $ cd ${selfPath.slice(0,-18)}`)
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node oomtility/http.js')




//// SETUP
// var childProcess = require("child_process");
// var oldSpawn = childProcess.spawn;
// function mySpawn() {
//     console.log('spawn called');
//     console.log(arguments);
//     var result = oldSpawn.apply(this, arguments);
//     return result;
// }
// childProcess.spawn = mySpawn;

//// Load library functionality.
const fs = require('fs')
    , { spawn } = require('child_process')
    , beefy = require('beefy')

//// Declare variables.
let opt

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-h' === opt || '--help'    === opt) return console.log(HELP)
    if ('-v' === opt || '--version' === opt) return console.log(NAME, VERSION)
}




//// RUN BEEFY

const proc = spawn('beefy', ['--browserify','browserify'])
let beefyHasStarted = false, successfulRequests = 0
  , reqMessage = 'Requests: 0', action = '> oom....', pos = 5

proc.stdout.on('data', data => {
    (data+'').split('\n').forEach( line => {
        if ('' === line) return
        if ( 'beefy (v' === line.slice(0,8) ) {
            console.log(`Process ID: ${proc.pid}  ${line}\n`)
            beefyHasStarted = true
        } else if ( '200' === line.slice(0,3) ) {
            successfulRequests++
        } else {
            clearTwoLines()
            console.log(line + '\n') // eg a 404 error
        }
        render()
    })
})

function render () {
    if (! beefyHasStarted) return
    reqMessage =
        'Requests: '
      + successfulRequests
      + ( ' '.repeat(5-(successfulRequests+'').length) )
    clearTwoLines()
    process.stdout.write(reqMessage + '\n' + action)
    process.stdout.cursorTo(pos)
}

proc.stderr.on('data', data => {
    console.log(`\nstderr: ${data}`);
})

proc.on('close', (code, signal) => { //@TODO make this display
    console.log(`\nBeefy exited with code ${code} and signal ${signal}`);
})





//// KEYBOARD INPUT

//// Set up the `stdin` object.
const stdin = process.stdin
stdin.setRawMode(true) // else we would only get streams after enter is pressed
// stdin.resume() // lets us catch Beefy’s exit code @TODO make this work
stdin.setEncoding('utf8') // would be binary by default

//// Deal with a keypress.
stdin.on('data', function(key) { // on any data into stdin
    if (key === '\u0003') { // ctrl-c, the 'end of text' character
        console.log('\nctrl-c')
        proc.kill()
        process.exit()
    }
    if (key === '\u007F') { // delete
        if (10 >= pos) {
            action = '> oom....'
            pos = 5
        } else {
            action = action.slice(0, pos-1) + action.slice(pos)
            pos--
        }
    } else if (27 === key.charCodeAt(0) && 91 === key.charCodeAt(1)) { // arrow
        if ('> oom....' !== action) {
            if ( 68 === key.charCodeAt(2) ) pos = Math.max(10, pos-1) // left
            if ( 67 === key.charCodeAt(2) ) pos = Math.min(action.length, pos+1)
        }
    } else if (key === '\u000D') { // enter or return
        if ('> oom....' === action) return
        const command = action.slice(2)
        const opts = command.slice(8).split(' ').map( s => s.trim() ) //@TODO allow spaces in strings, eg an oompush commit message
        const wantsHelp =
            ( -1 !== action.indexOf(' --help') || -1 !== action.indexOf(' -h') )
        console.log('\nRunning ' + command + '\n')
        // console.log(action.slice(2,9), [ action.slice(10) ] );
        const subproc = spawn(
            'node', [`oomtility/${command.slice(3,7)}.js`].concat(opts) )
        function subprocOut (data, prefix) {
            (data+'').split('\n').forEach( line => {
                if (! wantsHelp && '' === line) return
                clearTwoLines()
                console.log(wantsHelp ? line+'\n' : `${prefix}: ${line}\n`)
                render()
            })
        }
        subproc.stdout.on('data', data => subprocOut(data, command.slice(0,7)) )
        subproc.stderr.on('data', data => subprocOut(data, `${command}: stderr`) )
        subproc.on('close', (code, signal) => {
            if (code) subprocOut(
                `exited with code ${code} and signal ${signal}`, command)
        })
        action = '> oom....'
        pos = 5
    } else if ('> oom....' === action) {
        if ('h' === key || 'i' === key) {
            clearTwoLines()
            console.log('h' === key
              ? '> oomhttp: Sorry, already running oomhttp!\n'
              : '> oominit: That cannot be run under oomhttp\n' )
            render()
        } else {
            action = ({
                'a': '> oomauto '
              , 'b': '> oombump '
              , 'd': '> oomdocs '
              // , 'h': '> oomhttp ' // nope, already running http!
              // , 'i': '> oominit ' // nope, too complex
              , 'm': '> oommake '
              , 'p': '> oompush '
              , 't': '> oomtest '
              , 'w': '> oomwrap '
            })[key] || '> oom....'
            pos = '> oom....' === action ? 5 : 10
        }
    } else {
        if (key === '\u0009') key = ' ' // convert tab to a single space
        action = action.slice(0, pos) + key + action.slice(pos)
        pos += key.length // longer than 1 character if pasted text
    }
    render()
});




//// UTILITY
function clearTwoLines () {
    process.stdout.clearLine()
    process.stdout.write('\x1b[1A')
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
}

}()
