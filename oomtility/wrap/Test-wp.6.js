describe('${{classname}} (wp)', () => {




describe('B.R.E.A.D. ${{classname}} instances', function () {
    const Class = ROOT.${{classname}}, schema = Class.schema
        , instance = new Class(), attr = instance.attr
        , unchanged = new Class()
        , username = $('#wp-username').val().trim()
        , password = $('#wp-password').val().trim()
        , nameCPT = '${{classname.toLowerCase().replace(/\./g,'_')}}'
    let wpBase = $('#wp-base').val().trim() // eg 'http://localhost/~emmy/wp/'
    wpBase += '/' === wpBase[wpBase.length-1] ? '' : '/'
    const urlCPT = wpBase + 'wp-json/wp/v2/' + nameCPT


    //// Connection, and ${{classname.toLowerCase().replace(/\./g,'-')}} exists.
    it(urlCPT + ' is recognised', function (done) {
        this.timeout(5000)
        pingPlugin()
        function pingPlugin () {
            $.ajax(wpBase + 'wp-content/plugins/${{projectLC}}/wp-plugin.php?ping')
               .done(function (data, textStatus, jqXHR) {
                    eq(data, 'pong'
                      , 'The ${{projectLC}} plugin should ‘pong’ when you ping it')
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
        const title = 'A cyan ${{classname}}, unit test random = ' + Math.random()
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




})//describe('B.R.E.A.D. ${{classname}} instances')




})//describe('${{classname}} (wp)')
