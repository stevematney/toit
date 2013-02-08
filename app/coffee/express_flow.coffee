express = require "express"

class ExpressFlow
    constructor: (@dir)->
        @app = express()
        @config()
        @definePaths()

    start:=>
        @app.listen(3001)

    config: =>
        pub = @dir + "/public"
        @app.use(express.cookieParser('doit_toit_now'))
        @app.use(express.cookieSession())
        @app.use(express.static(pub))
        @app.use(@app.router)
        @app.set("views", @dir + "/views")

    definePaths: =>
        @app.get("/", @renderIndex)

    renderIndex: (req, res)=>
        console.log "sending #{ @dir }views/index.html"
        res.sendfile(@dir + "/views/index.html")

    renderError: (err, html)=>

module.exports = ExpressFlow
