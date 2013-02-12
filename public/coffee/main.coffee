# do stuff here

class ChangeManager
    update: (todos)=>
        postdata  = {
            todos: todos
        }
        @sendChange("/update/", postdata)
    
    sendChange: (url, postdata)=>
        $.ajax {
            'method': 'POST'
            'data': postdata
            'url' : url
            'complete': $.proxy(@updateApp, @)
        }

    updateApp: =>
        #do some updating

class PlusController
    constructor: (@plus)->
        @plus.click $.proxy(@openClose, @)
        @container = $("#todo_holder")
        @greaterExtra = 12
        @extraTop = if todos.length > 0 then @greaterExtra else 0
        @originalTop = @container.height() + @extraTop;
        @plus.css "top", @originalTop
        @currentTop = @originalTop

    openClose: =>
        if not @open then @openNewTodo() 
        else 
            removeLastTodo()
            @close()
        @open = @plus.hasClass("close")

    openNewTodo: =>
        subtraction = if todos.length > 0 then 2 else -1
        @plus.css("top", @currentTop - (@extraTop - subtraction))
        addTodo() 
        @plus.addClass("close")

    close: =>
        @currentTop = @container.height() + @extraTop
        @plus.css("top", @currentTop)
        @plus.removeClass "close"

    manualClose: =>
        @extraTop = @greaterExtra
        @close()
        @open = @plus.hasClass("close")

class Todo
    constructor: (@plus)->
        @createCoreElements()
    
    createCoreElements: =>
        @todo_element = @generate_element()
        @plus.before @todo_element
        @todo_element.keypress $.proxy(@handleEnter, @)
        #@todo_element.blur $.proxy(@completeEntry, @)

    createSupplements: =>
        if @listAffecter?
            return
        @listAffecter = new ListAffecter @todo_element
        @listAffecter.addCloseListener $.proxy @remove, @

    generate_element: =>
        cont = $("<div class='todo new' contenteditable>")
        return cont

    remove: =>
        @todo_element.remove()
        @removeListAffecter()
        removeTodo(@)

    removeListAffecter: =>
        if not @listAffecter?
            return
        @listAffecter.destroy()
        @listAffecter = null


    handleEnter: (e)=>
        if e.which != 13
            return;
        e.preventDefault()
        @completeEntry()

    completeEntry: =>
        @enterTodo()
        @createSupplements()

    enterTodo: =>
        @setClosed()
        updateTodos()

    setText: (newText)=>
        @todo_element.text(newText)
        @setClosed()

    setClosed: =>
        @text = @todo_element.text().replace(/,/g, "/;")
        @todo_element.blur().removeClass("new")

class ListAffecter
    constructor: (@listItemElement)->
        @setupAffecters()
        @createElements()

    createElements: =>
        @elementContainer = $("<div class='list_action_holder' />")
        @close = $("<div class='list_close'>+</div>")
        @elementContainer.append @close
        @listItemElement.after @elementContainer
        @close.click $.proxy(@closeEvent, @)

    destroy: =>
        @close.remove()
        @elementContainer.remove()
        @elementContainer = null
        @close = null
        @closeListeners = null

    addCloseListener: (listener)=>
        @closeListeners.push listener

    closeEvent: =>
        for listener in @closeListeners
            listener()

    setupAffecters: =>
        @closeListeners = []

#app-level vars
change_manager = null;
plus_controller = null;
todos = []

$(document).ready ->
    handleExistingTodos()
    change_manager = new ChangeManager()
    plus_controller = new PlusController($("#add_todo"))

handleExistingTodos = ->
    existingCookies = document.cookie.split("; ")
    for cookie in existingCookies
        cookiePair = cookie.split(/\=/)
        if cookiePair[0] != "todos"
            continue
        decodedCookies = decodeURIComponent(cookiePair[1])
        decodedCookies = decodedCookies.replace("j:[", "").replace(/]$/, "").replace(/\"/g, "")
        existingTodos = decodedCookies.split(",")
        break
    if not existingTodos?
        return
    for todo in existingTodos
        if(todo == "undefined")
            continue
        newTodo = new Todo($("#add_todo"))
        newTodo.createSupplements()
        newTodo.setText(todo.replace /\/;/g, ",")
        todos.push newTodo

addTodo = ->
    todos.push new Todo(plus_controller.plus)

removeLastTodo = ()->
    position = todos.length - 1;
    todo = todos[position]
    todo.remove()

removeTodo = (todo)->
    todos.splice(todos.indexOf(todo), 1)[0]
    todo = null;
    updateTodos()

updateTodos = ->
    todo_texts = []
    for todo in todos
        todo_texts.push todo.text
    change_manager.update todo_texts
    plus_controller.manualClose()
