var TODO = (function (css, http) {
  var todo = this

  todo.todotaskInputElement,
  todo.addButtonElement,
  todo.taskListElement,
  todo.taskInputId = 'taskInput',
  todo.addButtonId = 'addButton',
  todo.taskListId = 'taskList',
  todo.tasks = [],
  todo.currentId = 0,
  todo.backendUrl = 'http://localhost:8080',
  todo.tasksResource = '/tasks',

  activate()

  return {
    addTask: addTask,
    toggleDone: toggleDone,
    checkInput: checkInput,
    getTasks: todo.tasks,
    removeTask: removeTask,
    syncTask: syncTask,
    getAllTasks: getAllTasks,
    getId: getId
  }

  function getId () {
    return todo.currentId
  }

  function activate () {
    // Busco os handlers para facilitar o trabalho nos segmentos posteriores.  
    todo.taskInputElement = document.getElementById(todo.taskInputId)
    todo.addButtonElement = document.getElementById(todo.addButtonId)
    todo.taskListElement = document.getElementById(todo.taskListId)

    // Busco todas as tarefas e as renderizo
    getAllTasks(function (data) {
      renderTasks(JSON.parse(data))
    })

    // Inicializo os protótipos legais 
    runPrototypes()

  }

  function toggleDone (e) {
    var taskId = e.target.parentNode.id,
      updatedTask = new Task()

    css.toggleClass(e.target.parentElement, 'done')

    // TODO: Melhorar esta lógica de marcação e retrieve de valores. Estamos
    // percorrendo o Array de tarefas duas vezes.
    todo.tasks.forEach(markTaskDone)

    updatedTask = todo.tasks.filter(function (obj) { if (obj.id == taskId) { return obj }})[0]

    updateTask(updatedTask)

    function markTaskDone (task, index, array) {
      // Vai sempre passar por todas as tarefas.
      // Provavelmente esta não é a melhor forma de fazer isto, 
      // mas estamos lidando com uma única lista, vai ter que servir por enquanto.
      
      task.done = task.id == taskId ? !task.done : task.done
    }
  }

  function addTask () {
    var task = todo.taskInputElement.value, taskObject
    if (task != undefined && task.trim() != '' && task != '') {
      todo.taskInputElement.value = ''
      taskObject = new Task(todo.currentId, task, false)
      renderTasks(taskObject)
      todo.tasks.push(taskObject)
      // TODO: Quem tem que gerar ID é o BackEnd. Verificar o que fazer. 
      todo.currentId++
      syncTask(taskObject)
      css.removeClass(todo.taskInputElement, 'error')
    } else {
      css.addClass(todo.taskInputElement, 'error')
    }
  }

  function removeTask (e) {
    // TODO: Dá pra melhorar essas parentadaNode aqui?
    var taskId = e.target.parentNode.parentNode.id

    todo.tasks = todo.tasks.filterById(taskId)

    console.log(todo.tasks)

    deleteTask(taskId)

    removeDOMNode(e.target, 'li')

    // Importante verificar aqui se o nó foi realmente removido.
    // Como havia um bind com o Javascript, provavelmente o Browser não irá remover.
    // TODO: Pesquisar este aspecto e pensar em soluções.

  }

  // Função que verifica os caracteres inputados no input de tasks.
  // Se o usuário inputar 'ENTER', entendemos como um submit.
  function checkInput (e) {
    if (e.keyCode == 13) {
      addTask()
    }
  }

  // Modelo Task.
  function Task (id, description, status) {
      console.log(status)
    this.id = id
    this.description = description
    this.done = status
  }

  function renderTasks (tasksObj) {
    if (isType(tasksObj, 'Array')) {
      tasksObj.forEach(render)
    } else {
      render(tasksObj)
    }

    function render (value, index, array) {
      todo.tasks.push(new Task(value.id, value.description, value.done))
      todo.taskListElement.innerHTML = todo.taskListElement.innerHTML.concat('<li id=' + value.id + '>' +
        '<input type="checkbox" onclick="TODO.toggleDone(event)"' +
        (value.done ? 'checked' : '') +
        '>' +
        '<span id="descricao">' + value.description +
        '</span>' +
        '<span id="controles">' +
        '<i class="fa fa-pencil-square-o"></i>' +
        '<i class="fa fa-trash" onclick="TODO.removeTask(event)"></i>' +
        '</span></li>')

      // Se a tarefa já estiver concluída, adiciono a classe 'done'.
      if (value.done) { css.toggleClass(document.getElementById(value.id), 'done') }

      // Busco o maior ID dentre as tarefas existentes.
      // Imagino que esta solução deva funcionar agora mas em um outro cenário
      // pode ser que fique um tanto problemático.
      // TODO: Podemos ter um call para o servidor que retorne o próximo ID?
      todo.currentId = value.id > todo.currentId ? value.id : todo.currentId
    }
  }

  // FUNÇÕES PARA CONEXÃO COM BACKEND
  // Dá pra virar um módulo baseado nas interfaces REST.
  // Assim que terminar, refatorar para Websockets
  // TODO: Melhorar essas interfaces e criar short calls baseado nods métodos 
  // http.POST(todo.backendUrl + todo.tasksResource, taskJSON), 
  // http.query(todo.backendUrl + todo.tasksResource)
  function syncTask (task) {
    var taskJSON = JSON.stringify(task)

    http.xhrRequest({
      method: 'POST',
      url: todo.backendUrl + todo.tasksResource,
      async: true,
      data: taskJSON,
      callback: function (data) {console.log(data); }
    }).open()
      .send()
  }

  function getAllTasks (callback) {
    http.xhrRequest({
      method: 'GET',
      url: todo.backendUrl + todo.tasksResource,
      async: true,
      callback: callback
    }).open()
      .send()
  }

  function deleteTask (taskId) {
    http.xhrRequest({
      method: 'DELETE',
      url: todo.backendUrl + todo.tasksResource + '/' + taskId,
      dataType: 'text/plain',
      asyc: true,
      callback: function (data) { console.log(data); }
    }).open()
      .send()
  }

  function updateTask (task) {
    var taskJSON = JSON.stringify(task)
    console.log(taskJSON)

    http.xhrRequest({
      method: 'PUT',
      url: todo.backendUrl + todo.tasksResource + '/' + task.id,
      data: taskJSON,
      asyc: true,
      callback: function (data) { console.log(data); }
    }).open()
      .send()
  }

  // TODO: CANDIDATAOS A SAIR DO MODULO
  // Prototype GOODIE.
  // Considerar mover para modulo huehuee
  function runPrototypes () {
    Array.prototype.filterById = function (id) {
      var newArray = []
      newArray = this.filter(function (obj) { if (obj.id != id) return obj })
      return newArray
    }
  }

  // FUNÇÃO PURA, PRONTA PARA SER EXTRAÍDA PARA OUTRO MODULO ----------
  function isType (obj, type) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1)
    return obj !== undefined && obj !== null && clas === type
  }
  // ------------------------------------------------------------------

  // FUNÇÃO PURA, PRONTA PARA SER EXTRAÍDA PARA OUTRO MODULO ----------
  function removeDOMNode (element, targetNode) {
    var node = element

    while (node.localName != targetNode) {
      node = node.parentNode
      if (node.localName == null) {
        break
      }
    }

    if (node.localName != null) {
      node.remove()
    } else {
      throw ('Nó não existe')
    }
  }
// --------------------------------------------------------------------
})(CSSTOOLS, HTTPREQUEST)
