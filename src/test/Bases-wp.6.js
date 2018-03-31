//// Oom.Dd //// 1.0.3 //// March 2018 //// http://oom-dd.richplastow.com/ /////

//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)

!function (ROOT) { 'use strict'
if (false) return // change to `true` to ‘hard skip’ this test
const { describe, it, eq, neq, is, goodVals, badVals } = ROOT.testify()
const { isConstant, isReadOnly, isReadWrite } = Oom.KIT

describe('Oom.Dd (wp)', () => {




describe('B.R.E.A.D. Oom.Dd instances', function () {
    const Class = ROOT.Oom.Dd, schema = Class.schema
        , instance = new Class(), attr = instance.attr
        , unchanged = new Class()
        , username = $('#wp-username').val().trim()
        , password = $('#wp-password').val().trim()
        , nameCPT = 'oom_dd'
    let wpBase = $('#wp-base').val().trim() // eg 'http://localhost/~emmy/wp/'
    wpBase += '/' === wpBase[wpBase.length-1] ? '' : '/'
    const urlCPT = wpBase + 'wp-json/wp/v2/' + nameCPT


    //// Connection, and oom-dd exists.
    it(urlCPT + ' is recognised', function (done) {
        this.timeout(5000)
        pingPlugin()
        function pingPlugin () {
            $.ajax(wpBase + 'wp-content/plugins/oom-dd/wp-plugin.php?ping')
               .done(function (data, textStatus, jqXHR) {
                    eq(data, 'pong'
                      , 'The oom-dd plugin should ‘pong’ when you ping it')
                    if ('pong' === data)
                        recogniseCpt()
                })
               .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log('fail', textStatus, errorThrown, jqXHR)
                    done( Error('fail: ' + textStatus) )
                })
        }
        function recogniseCpt () {
            $.ajax(urlCPT)
               .done(function (data, textStatus, jqXHR) {
                    is(Array.isArray(data)
                      , 'Getting wp/v2/' + nameCPT + ' should return an array')
                    done()
                })
               .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log('fail', textStatus, errorThrown, jqXHR)
                    done( Error('fail: ' + errorThrown) )
                })
        }
    })


    //// Xx.
    it(`Create an ${nameCPT} via WP API, ${username}:${password}` , function (done) {
        this.timeout(5000)
        const title = 'A cyan Oom.Dd, unit test random = ' + Math.random()
        const goodAuth = window.btoa(username + ":" + password)
        const goodSettings = {
            contentType: 'application/json'
          , method: 'POST'
          , url: urlCPT
          , crossDomain: true
          , beforeSend: xhr =>
                xhr.setRequestHeader('Authorization', 'Basic ' + goodAuth)
          , data: JSON.stringify({
                title
              , status: 'publish'
              , hilite: '#00ccdd'
            })
        }
        const badSettings = Object.assign({}, goodSettings, {
            beforeSend: xhr => {}
        })
        unauthorizedCreate()
        function unauthorizedCreate () {
            $.ajax(badSettings)
               .done(function (data, textStatus, jqXHR) {
                    done( Error('Incorrect success: should have failed') )
                })
               .fail(function (jqXHR, textStatus, errorThrown) {
                    eq(errorThrown, 'Unauthorized'
                      , 'POSTing without authorization gets a WP API error')
                    if ('Unauthorized' === errorThrown)
                        createCpt()
                })
        }
        function createCpt () {
            $.ajax(goodSettings)
               .done(function (data, textStatus, jqXHR) {
                    console.log('in Done')
                    eq(data.title.raw, title
                      , 'Created a CPT with title ' + title)
                    eq(data.hilite, '#00ccdd'
                      , 'Created a CPT with hilite #00ccdd')
                    done()
                })
               .fail(function (jqXHR, textStatus, errorThrown) {
                    if ('Unauthorized' === errorThrown)
                        console.warn(errorThrown
                          , '\n1. Check username and password'
                          , '\n2. Check the ‘JSON Basic Authentication’ plugin is activated'
                          , '\n3. Check the ‘Application Passwords’ plugin is activated'
                          , '\n4. in .htaccess after ‘RewriteEngine On’, add:'
                          , '\n  RewriteRule .* - [E=REMOTE_USER:%{HTTP:Authorization}]'
                          , '\n  (see https://goo.gl/2sWYAA)'
                          , jqXHR)
                    done( Error('fail: ' + errorThrown + '\n') )
                })
        }
    })




})//describe('B.R.E.A.D. Oom.Dd instances')




})//describe('Oom.Dd (wp)')





}(window)
