// Generated by CoffeeScript 1.4.0
(function() {
  var ChangeManager, ListAffecter, PlusController, Todo, addTodo, change_manager, handleExistingTodos, plus_controller, removeLastTodo, removeTodo, todos, updateTodos,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ChangeManager = (function() {

    function ChangeManager() {
      this.updateApp = __bind(this.updateApp, this);

      this.sendChange = __bind(this.sendChange, this);

      this.update = __bind(this.update, this);

    }

    ChangeManager.prototype.update = function(todos) {
      var postdata;
      postdata = {
        todos: todos
      };
      return this.sendChange("/update/", postdata);
    };

    ChangeManager.prototype.sendChange = function(url, postdata) {
      return $.ajax({
        'method': 'POST',
        'data': postdata,
        'url': url,
        'complete': $.proxy(this.updateApp, this)
      });
    };

    ChangeManager.prototype.updateApp = function() {};

    return ChangeManager;

  })();

  PlusController = (function() {

    function PlusController(plus) {
      this.plus = plus;
      this.manualClose = __bind(this.manualClose, this);

      this.close = __bind(this.close, this);

      this.openNewTodo = __bind(this.openNewTodo, this);

      this.openClose = __bind(this.openClose, this);

      this.plus.click($.proxy(this.openClose, this));
      this.container = $("#todo_holder");
      this.greaterExtra = 12;
      this.extraTop = todos.length > 0 ? this.greaterExtra : 0;
      this.originalTop = this.container.height() + this.extraTop;
      this.plus.css("top", this.originalTop);
      this.currentTop = this.originalTop;
    }

    PlusController.prototype.openClose = function() {
      if (!this.open) {
        this.openNewTodo();
      } else {
        removeLastTodo();
        this.close();
      }
      return this.open = this.plus.hasClass("close");
    };

    PlusController.prototype.openNewTodo = function() {
      var subtraction;
      subtraction = todos.length > 0 ? 2 : -1;
      this.plus.css("top", this.currentTop - (this.extraTop - subtraction));
      addTodo();
      return this.plus.addClass("close");
    };

    PlusController.prototype.close = function() {
      this.currentTop = this.container.height() + this.extraTop;
      this.plus.css("top", this.currentTop);
      return this.plus.removeClass("close");
    };

    PlusController.prototype.manualClose = function() {
      this.extraTop = this.greaterExtra;
      this.close();
      return this.open = this.plus.hasClass("close");
    };

    return PlusController;

  })();

  Todo = (function() {

    function Todo(plus) {
      this.plus = plus;
      this.setClosed = __bind(this.setClosed, this);

      this.setText = __bind(this.setText, this);

      this.enterTodo = __bind(this.enterTodo, this);

      this.completeEntry = __bind(this.completeEntry, this);

      this.handleEnter = __bind(this.handleEnter, this);

      this.removeListAffecter = __bind(this.removeListAffecter, this);

      this.remove = __bind(this.remove, this);

      this.generate_element = __bind(this.generate_element, this);

      this.createSupplements = __bind(this.createSupplements, this);

      this.createCoreElements = __bind(this.createCoreElements, this);

      this.createCoreElements();
    }

    Todo.prototype.createCoreElements = function() {
      this.todo_element = this.generate_element();
      this.plus.before(this.todo_element);
      return this.todo_element.keypress($.proxy(this.handleEnter, this));
    };

    Todo.prototype.createSupplements = function() {
      if (this.listAffecter != null) {
        return;
      }
      this.listAffecter = new ListAffecter(this.todo_element);
      return this.listAffecter.addCloseListener($.proxy(this.remove, this));
    };

    Todo.prototype.generate_element = function() {
      var cont;
      cont = $("<div class='todo new' contenteditable>");
      return cont;
    };

    Todo.prototype.remove = function() {
      this.todo_element.remove();
      this.removeListAffecter();
      return removeTodo(this);
    };

    Todo.prototype.removeListAffecter = function() {
      if (!(this.listAffecter != null)) {
        return;
      }
      this.listAffecter.destroy();
      return this.listAffecter = null;
    };

    Todo.prototype.handleEnter = function(e) {
      if (e.which !== 13) {
        return;
      }
      e.preventDefault();
      return this.completeEntry();
    };

    Todo.prototype.completeEntry = function() {
      this.enterTodo();
      return this.createSupplements();
    };

    Todo.prototype.enterTodo = function() {
      this.setClosed();
      return updateTodos();
    };

    Todo.prototype.setText = function(newText) {
      this.todo_element.text(newText);
      return this.setClosed();
    };

    Todo.prototype.setClosed = function() {
      this.text = this.todo_element.text().replace(/,/g, "/;");
      return this.todo_element.blur().removeClass("new");
    };

    return Todo;

  })();

  ListAffecter = (function() {

    function ListAffecter(listItemElement) {
      this.listItemElement = listItemElement;
      this.setupAffecters = __bind(this.setupAffecters, this);

      this.closeEvent = __bind(this.closeEvent, this);

      this.addCloseListener = __bind(this.addCloseListener, this);

      this.destroy = __bind(this.destroy, this);

      this.createElements = __bind(this.createElements, this);

      this.setupAffecters();
      this.createElements();
    }

    ListAffecter.prototype.createElements = function() {
      this.elementContainer = $("<div class='list_action_holder' />");
      this.close = $("<div class='list_close'>+</div>");
      this.elementContainer.append(this.close);
      this.listItemElement.after(this.elementContainer);
      return this.close.click($.proxy(this.closeEvent, this));
    };

    ListAffecter.prototype.destroy = function() {
      this.close.remove();
      this.elementContainer.remove();
      this.elementContainer = null;
      this.close = null;
      return this.closeListeners = null;
    };

    ListAffecter.prototype.addCloseListener = function(listener) {
      return this.closeListeners.push(listener);
    };

    ListAffecter.prototype.closeEvent = function() {
      var listener, _i, _len, _ref, _results;
      _ref = this.closeListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(listener());
      }
      return _results;
    };

    ListAffecter.prototype.setupAffecters = function() {
      return this.closeListeners = [];
    };

    return ListAffecter;

  })();

  change_manager = null;

  plus_controller = null;

  todos = [];

  $(document).ready(function() {
    handleExistingTodos();
    change_manager = new ChangeManager();
    return plus_controller = new PlusController($("#add_todo"));
  });

  handleExistingTodos = function() {
    var cookie, cookiePair, decodedCookies, existingCookies, existingTodos, newTodo, todo, _i, _j, _len, _len1, _results;
    existingCookies = document.cookie.split("; ");
    for (_i = 0, _len = existingCookies.length; _i < _len; _i++) {
      cookie = existingCookies[_i];
      cookiePair = cookie.split(/\=/);
      if (cookiePair[0] !== "todos") {
        continue;
      }
      decodedCookies = decodeURIComponent(cookiePair[1]);
      decodedCookies = decodedCookies.replace("j:[", "").replace(/]$/, "").replace(/\"/g, "");
      existingTodos = decodedCookies.split(",");
      break;
    }
    if (!(existingTodos != null)) {
      return;
    }
    _results = [];
    for (_j = 0, _len1 = existingTodos.length; _j < _len1; _j++) {
      todo = existingTodos[_j];
      if (todo === "undefined") {
        continue;
      }
      newTodo = new Todo($("#add_todo"));
      newTodo.createSupplements();
      newTodo.setText(todo.replace(/\/;/g, ","));
      _results.push(todos.push(newTodo));
    }
    return _results;
  };

  addTodo = function() {
    return todos.push(new Todo(plus_controller.plus));
  };

  removeLastTodo = function() {
    var position, todo;
    position = todos.length - 1;
    todo = todos[position];
    return todo.remove();
  };

  removeTodo = function(todo) {
    todos.splice(todos.indexOf(todo), 1)[0];
    todo = null;
    return updateTodos();
  };

  updateTodos = function() {
    var todo, todo_texts, _i, _len;
    todo_texts = [];
    for (_i = 0, _len = todos.length; _i < _len; _i++) {
      todo = todos[_i];
      todo_texts.push(todo.text);
    }
    change_manager.update(todo_texts);
    return plus_controller.manualClose();
  };

}).call(this);
