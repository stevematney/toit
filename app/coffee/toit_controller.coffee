express = require "express"

class ToitController
    constructor: (@dir, @port)->
        @port = @port || 3001
        @app = express()
        @config()
        @definePaths()

    start:=>
        @app.listen(@port)

    config: =>
        pub = @dir + "/public"
        @app.use(express.bodyParser())
        @app.use(express.cookieParser('doit_toit_now'))
        @app.use(express.cookieSession())
        @app.use(express.static(pub))
        @app.use(@app.router)
        @app.set("views", @dir + "/views")

    definePaths: =>
        @app.get("/", @renderIndex)
        @app.post("/update/", @updateTodos)

    renderIndex: (req, res)=>
        console.log "sending #{ @dir }views/index.html"
        res.sendfile(@dir + "/views/index.html")

    updateTodos: (req, res)=>
        req.session.todos = req.body.todos
        res.cookie('todos', req.body.todos, { maxAge : 1000*60*60*24*365})
        res.send("Todos updated as #{ req.session.todos }")

    renderError: (err, html)=>

module.exports = ToitController
