!function () { 'use strict'

//// YOU MAY NEED TO ADD MORE CONST NAMES IN HERE:
const CONSTS = {
    __LOCATION__:0 // special case, must be exactly `${{__LOCATION__}}`
  , isApp:       0//@TODO remove from all oomtility
  , isTop:       0
  , title:       0
  , projectTC:   0
  , projectLC:   0
  , projectLCU:  0 // lowercase underscored, eg 'oom_foo'
  , classname:   0
  , extendname:  0
  , nameLC:      0
  , methodname:  0
  , methodshort: 0
  , remarks:     0
  , version:     0
  , date:        0
  , repo:        0
  , npm:         0
  , domain:      0
  , homepage:    0
  , topline:     0
  , description: 0
  , color:       0
}

const NAME     = 'Oomtility Wrap'
    , VERSION  = '1.3.7'
    , HOMEPAGE = 'https://oomtility.loop.coop'
    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script reads files, and converts them into JavaScript functions
which return that file as a string. It’s used to create most of the functions in
‘oomtility/wrapped.js’, and may be useful for general Oom development.

Installation
------------
If you haven’t done it already, you should set up the \`oomwrap\` alias:
$ node oomtility/alias.js

Basic Usage
-----------
$ cd /path/to/your/oom/repo/  # An Oom repo directory
$ oomwrap --version           # Show the current ${NAME} version
$ oomwrap                     # Update oomtility/wrapped.js with oomtility/wrap/
$ oomwrap foo.js bar/baz.png  # Output \`writeFooJs()\` and \`writeBazPng()\`

Options
-------
-a  --auto-only  Only process ‘oomtility/wrap/auto/’, not ‘oomtility/wrap/’
-d  --dummy      Send output to the console (stdout), not ‘oomtility/wrapped.js’
-h  --help       Show this help message
-v  --version    Show the current ${NAME} version

This script lives at ${HOMEPAGE}
`


//// Validate the environment.
const nodePath = process.argv.shift()
const selfPath = process.argv.shift()
if ( '/oomtility/wrap.js' !== selfPath.slice(-18) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== selfPath.slice(0,-18) ) )
    return console.warn(`Unexpected CWD, try:\n  $ cd ${selfPath.slice(0,-18)}`)
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node oomtility/make.js')




//// SETUP


//// Load library functionality.
const fs = require('fs')
    , { rxBinaryExt } = require('./wrapped.js')

//// Declare variables.
let opt, autoOnly, dummy, wraps = [], autos = [], out, tally = 0

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-a' === opt || '--auto-only' === opt) { autoOnly = true; continue }
    if ('-d' === opt || '--dummy'     === opt) { dummy = true; continue }
    if ('-h' === opt || '--help'      === opt) return console.log(HELP)
    if ('-v' === opt || '--version'   === opt) return console.log(NAME, VERSION)
    wraps.push(opt)
}

//// If no wrap-paths were specified, wrap the contents of ‘oomtility/wrap/’ and
//// ‘oomtility/wrap/auto/’.
const autoPath = 'oomtility/wrap/auto/'
const wrapPath = 'oomtility/wrap/'
if (0 === wraps.length)
    autos = fs.readdirSync(autoPath).map(p => autoPath + p)
if (0 === wraps.length && ! autoOnly)
    wraps = fs.readdirSync(wrapPath).map(p => wrapPath + p)




//// CONVERT FILES


//// Convert each file in `autos`.
if (autos.length) {

    //// Wrap each path.
    out = []
    autos.forEach(doWrap)

    //// Write the result to console (if `--dummy` is set), or else the
    //// dynamic section of ‘oomtility/wrapped.js’.
    out = out.join('\n')
    if (dummy) {
        console.log(out)
    } else {
        updateWrappedJs('oomtility/wrapped.js', out
          , 'BEGIN oomtility/wrap/auto/ OUTPUT //////////'
          , 'END oomtility/wrap/auto/ OUTPUT //////////'
        )
    }

}


//// Convert each file in `wraps`.
if (wraps.length) {

    //// Wrap each path.
    out = []
    wraps.forEach(doWrap)

    //// Write the result to console (if `--dummy` is set), or else the
    //// dynamic section of ‘oomtility/wrapped.js’.
    out = out.join('\n')
    if (dummy) {
        console.log(out)
    } else {
        updateWrappedJs('oomtility/wrapped.js', out
          , 'BEGIN oomtility/wrap/ OUTPUT //////////'
          , 'END oomtility/wrap/ OUTPUT //////////'
        )
    }

}


//// Show a result.
console.log(NAME+`${autoOnly ? ', in auto-only mode,' : ''
    } processed ${tally} file${1===tally?'':'s'}`)




//// UTILITY


//// Wraps a path.
function doWrap (path) {
    if ( '.DS_Store' === path.slice(-9) ) return
    if ( 'auto' === path.slice(-4) ) return
    tally++
    const wrapped = []
    const expectedConsts = Object.assign({}, CONSTS)
    let inTemplateSection = false
    ;(fs.readFileSync(path, 'binary')+'').split('\n').forEach( (line, num) => {
        let c

        //// Deal with the start or end of a special `${{{` section. Or if we’re
        //// in a template section, just output the line verbatim.
        if ('${{{' === line) {
            inTemplateSection = true
            const prevLine = wrapped[wrapped.length-1]
            if ( prevLine && "\\n'" === prevLine.slice(-3) )
                wrapped[wrapped.length-1] = prevLine.slice(0, -3) + "' + ("
            else
                wrapped.push('  + (')
            return
        }
        if ('}}}' === line) {
            if (! inTemplateSection)
                throw Error(`Muddled end of '\${{{...}}}' in ${path}:${num}\n`)
            inTemplateSection = false
            return wrapped.push(") + '\\n'")
        }
        if (inTemplateSection) {
            for (c in expectedConsts)
                if ( 0 <= line.indexOf(c) )
                    expectedConsts[c]++
            return wrapped.push(line)
        }

        //// Deal with the special `${{double+template}}` markup.
        let start, end, doubleTemplates=[], doubleTemplateLut={}, rnd=rndCh8()
        while ( -1 !== (start = line.indexOf('${{')) ) {
            if (10 <= doubleTemplates.length)
                throw Error(`More than ten '\${{'s in ${path}:${num}\n`)
            end = line.indexOf('}}')
            if (0 <= start) {
                if (0 > end) throw Error(`Unmatched '\${{' in ${path}:${num}\n`)
                if (start > end) throw Error(`Muddled '\${{' in ${path}:${num}\n`)
                doubleTemplates.push( line.slice(start+3, end) )
                line =
                    line.slice(0,start)
                  + rnd + '#' + (doubleTemplates.length - 1)
                  + line.slice(end+2)
            }
        }

        //// Provide info for generating the config-to-const code.
        for (let i=0,tmpt; tmpt=doubleTemplates[i]; i++)
            for (c in expectedConsts)
                if ( 0 <= tmpt.indexOf(c) )
                    expectedConsts[c]++

        //// Escape backslashes, single-quotes, and unicode-escape non-ascii.
        line = encodeUTF16(line, '•', path, num) // non-ascii ‘•’ avoids edge cases

        //// Prevent double-templates markers from being split over two lines.
        for (let i=0,tmpt; tmpt=doubleTemplates[i]; i++) {
            const char = String.fromCharCode(0xB0+i) // ° to ¹
            line = line.replace(rnd+'#'+i, char)
            doubleTemplateLut[char] = tmpt
        }

        //// Deal with a line which does not need to be split.
        if (80 >= line.length) {
            line = line.replace(/•/g, '\\u') // correct our edge-case avoider
            line = line.replace(/([°-¹])/g, (m,p1) =>
                '__LOCATION__' === doubleTemplateLut[p1]
              ? `'+path+'`
              : `'+(${doubleTemplateLut[p1]})+'`) // reinstate double-templates
            if ( "'+(" === line.slice(0,3) ) // remove useless code
                line = `  + ${line.slice(2)}\\n'`
            else
                line = `  + '${line}\\n'`
            return wrapped.push(line)
        }

        //// Deal with a line which must be split over two or more lines.
        for (let pos=0, len=80, reduction, sub; pos<line.length;) {
            while (len) {
                reduction = getLineLengthReduction(line, pos, len)
                if (! reduction) break // no need to reduce line length
                len -= reduction // found a ‘\’ or the result of `encodeUTF16()`
            }
            if (0 >= len)
                throw Error(`Too many backslashes in ${path}:${num}\n`)
            sub = line.substr(pos, len)
            sub = sub.replace(/•/g, '\\u') // correct our edge-case avoider
            sub = sub.replace(/([°-¹])/g, (m,p1) =>
                '__LOCATION__' === doubleTemplateLut[p1]
              ? `'+path+'`
              : `'+(${doubleTemplateLut[p1]})+'`) // reinstate double-templates
            wrapped.push(`  + '${sub}'`)
            pos += len
            len = 80
        }

        //// Add a newline at the end of the last sub-line.
        wrapped[wrapped.length-1] = wrapped[wrapped.length-1].slice(0, -1) + "\\n'"

    })

    //// Remove the final newline.
    wrapped[wrapped.length-1] = wrapped[wrapped.length-1].slice(0, -3) + "'"

    out = out.concat([
        `//// An ${NAME} of ${path.split('/').pop()} \\\\//\\\\// ${HOMEPAGE} ////`
        , `module.exports.${pathToFnName(path)} = function (config, path) {`
    ])

    //// Generate the config-to-const code.
    let c, consts = [], configToConst = [], docomma = false
    for (c in expectedConsts)
        if (0 < expectedConsts[c])
            consts.push(c)
    if (0 < consts.length) {
        let hasLocation = false
        consts.forEach(c => {
            configToConst.push((docomma ? '  , ' : '    ') + c)
            docomma = true
        })
        out = out.concat('const {', configToConst, '} = config')
    }

    //// Define options for `fs.writeFileSync()`.
    out = out.concat(
        'const encoding = rxBinaryExt.test(path) ? \'binary\' : \'utf8\''
      , 'const flag = \'a\'' // 'a' appends to the end of the file
      , 'let out = \'\'' // will be returned if `path` is null
      , 'const write = str => out += null == path ? str'
      , '  : fs.writeFileSync(path, str, { encoding, flag })'
    )

    //// Add file-append code for each chunk of 2500 lines (just one chunk will
    //// be used for files under about 200KB).
    for (let i = 0; i<wrapped.length; i += 2500) {
        out = out.concat(
            'write(\'\''
          , wrapped.slice(i, i + 2500)
          , ')'
        )
    }

    //// Finish off the function.
    out = out.concat(
        '    return null == path ? out : null'
      , '}\n\n\n\n'
    )
}


////
function encodeUTF16 (str, u='\\u', path, num) {
    let pos=0, out='', code, hex

    //// Convert from UTF-8 to UTF-16, unless it’s a binary file.
    if (! rxBinaryExt.test(path) )
        str = utf8to16(str, path, num)

    for (; pos<str.length; pos++) {
        code = str.charCodeAt(pos)
        if (0x27 === code) { // single quote
            out += "\\'"
        } else if (0x5c === code) { // backslash
            out += '\\\\'
        } else if (31 < code && 127 > code) { // printable ascii
            out += str[pos]
        } else if (0xd === code) { // carriage return
            out += '\\r'
        } else if (0x9 === code) { // horizontal tab
            out += '\\t'
        } else {
            hex = code.toString(16)
            out += u + ( '0'.repeat(4-hex.length) ) + hex
        }
    }
    return out
}


//// based on https://gist.github.com/weishuaiwang/4221687
function utf8to16(str, path, num) {
	let c1, c2, c3, c4, out = '', len = str.length, i = 0
	while (i < len) {
		c1 = str.charCodeAt(i++)
		switch (c1 >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
            case 4:
			case 5:
			case 6:
			case 7:
				// c1 is 0 to 01111111, output as-is
				out += str.charAt(i - 1)
				break
            case 8:
			case 9:
			case 10:
			case 11:
                // c1 is 10000000 to 10111111
                throw Error(
                    `code ${c1}, which is 128 to 191, in ${path}:${num}\n`
                  + `    ...may be a binary file, or a garbled UTF-8 file.\n`
                )
			case 12:
			case 13:
                // c1 is 11000000 to 11011111
                // 11000000 10000000 -> 00000000 10000000 (U+0080)
                // 11011111 11111111 -> 00000011 11111111 (U+DFFF)
				c2 = str.charCodeAt(i++)
				out += String.fromCharCode(
                    ( (c1 & 0x0F) << 6 )
                  |   (c2 & 0x3F)
                )
				break
			case 14:
                // c1 is 11100000 to 11101111
                // 11101110 10000000 10000000 -> 11100000 00000000 (U+E000)
                // 11011111 11111111 11111111 -> 10111111 10111111 (U+FFFF)
				c2 = str.charCodeAt(i++)
				c3 = str.charCodeAt(i++)
				out += String.fromCharCode(
                    ( (c1 & 0x0F) << 12 )
                  | ( (c2 & 0x3F) <<  6 )
                  |   (c3 & 0x3F)
                )
				break
            case 15:
                // c1 is 11110000 to 11111111 (emojis etc)
                // 11110000 10010000 10000000 10000000 -> D800 DC00 (U+100000)
                //     which is 11011000 00000000 11011100 00000000
                // 11110100 10001111 10111111 10111111 -> DBFF DFFF (U+10ffff)
                //     which is 11011011 11111111 1101111 111111111
				c2 = str.charCodeAt(i++);
                c3 = str.charCodeAt(i++);
                c4 = str.charCodeAt(i++);
                out += utf32to16(
                    ( (c1 & 0x0F) << 18 )
                  | ( (c2 & 0x3F) << 12 )
                  | ( (c3 & 0x3F) <<  6 )
                  |   (c4 & 0x3F)
                )
				break
		}
	}
	return out;
}


//// based on https://stackoverflow.com/a/37674792
function utf32to16 (x) {
    return ''
      + String.fromCharCode(
            (
                ( (x - 0x10000) >> 0x0A )
              | 0
            ) + 0xD800
        ).toString(16)
      + String.fromCharCode(
            (
                (x - 0x10000) & 0x3FF
            ) + 0xDC00
        ).toString(16)
}


////
function getLineLengthReduction (line, pos, len) {
    for (let i=1; i<5; i++) // find an encoding made by `encodeUTF16()`
        if ( /•[0-9a-f]{4}/.test( line.substr(pos+len-i,5) ) )
            return i
    if ( '\\' === line[pos+len-1] ) // find a backslash
        return 1
    return 0
}


//// Similar to `lcToTc()`. 'foo/bar-baz.txt' to 'getBarBazTxt'.
//// Note that we may have several README.md files - they get special treatment.
//// Identical to pathToFnName() in auto.js and init.js @TODO D.R.Y.
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


////
function updateWrappedJs (wrappedPath, out, startMarker, endMarker) {
    let start = 0, end = 0
      , orig = (fs.readFileSync(wrappedPath, 'binary')+'').split('\n')
    for (; start<orig.length; start++)
        if (0 < orig[start].indexOf(startMarker) ) break
    for (; end<orig.length; end++)
        if (0 < orig[end].indexOf(endMarker)   ) break
    if ( start === orig.length || end === orig.length)
        return console.warn(`Couldn’t find dynamic section in ‘${wrappedPath}’`)
    out = orig.slice(0, start+1).concat([
`//// Files processed by oomtility/wrap.js //////////////////////////////////////
`], [out], orig.slice(end))
    fs.writeFileSync( wrappedPath, out.join('\n'), 'binary' )
}


////
function rndCh (s, e) {
    return String.fromCharCode(Math.random() * (e-s) + s)
}


////
function rndCh8 () {
    return '12345678'.replace( /./g,         c=> rndCh(48,122) ) // 0-z
                     .replace( /[:-@\[-`]/g, c=> rndCh(97,122) ) // a-z
}


}()
