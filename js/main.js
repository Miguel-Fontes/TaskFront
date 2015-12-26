var TODO = (function (css, http) {
  var taskInputElement,
    addButtonElement,
    taskListElement,
    taskInputId = 'taskInput',
    addButtonId = 'addButton',
    taskListId = 'taskList',
    tasks = [],
    id = 0,
    backendUrl = 'http://localhost:8080',
    tasksResource = '/tasks'

  activate()

  return {
    addTask: addTask,
    toggleDone: toggleDone,
    checkInput: checkInput,
    getTasks: tasks,
    removeTask: removeTask,
    syncTask: syncTask,
    getAllTasks: getAllTasks
  }

  function activate () {
    // Busco os handlers para facilitar o trabalho nos segmentos posteriores.  
    taskInputElement = document.getElementById(taskInputId)
    addButtonElement = document.getElementById(addButtonId)
    taskListElement = document.getElementById(taskListId)
    // Adicionar opções de configuração do módulo.

    getAllTasks()
    runPrototypes()

  }

  function toggleDone (event) {
    css.toggleClass(event.target.parentElement, 'done')

    var taskId = event.target.id

    tasks.forEach(markTaskDone)

    function markTaskDone (task, index, array) {
      // Vai sempre passar por todas as tarefas.
      // Provavelmente esta não é a melhor forma de fazer isto, 
      // mas estamos lidando com uma única lista, vai ter que server por enquanto.

      // Detalhe que a atribução é de !task.status
      task.done = task.id == taskId ? !task.done : task.done
    }
  }

  function addTask () {
    var task = taskInputElement.value, taskObject
    if (task != undefined && task.trim() != '' && task != '') {
      taskInputElement.value = ''
      taskObject = new Task(id, task, false)
      renderTasks(taskObject)
      tasks.push(taskObject)
      // TODO: Quem tem que gerar ID é o BackEnd. Verificar o que fazer. 
      id++
      syncTask(taskObject)
      css.removeClass(taskInputElement, 'error')
    } else {
      css.addClass(taskInputElement, 'error')
    }
  }

  function removeTask (e) {
    var taskId = e.target.parentNode.parentNode.id

    tasks = tasks.filterById(taskId)
    
    console.log(id)
    console.log(tasks)

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
      tasks.push(new Task(value.id, value.description, value.status))
      taskListElement.innerHTML = taskListElement.innerHTML.concat('<li id=' + value.id + '><input type="checkbox"' +
        ' onclick="TODO.toggleDone(event)"><span id="descricao">' + value.description +
        '</span><span id="controles"><i class="fa fa-trash" onclick="TODO.removeTask(event)"></span></i></li>')
    }
  }

  // FUNÇÕES PARA CONEXÃO COM BACKEND
  // Dá pra virar um módulo baseado nas interfaces REST.
  // Assim que terminar, refatorar para Websockets
  function syncTask (task) {
    // TODO - CORRIGIR ESSA FUNCAO. TA ERRADO!
    var taskJSON = JSON.stringify(task)
    console.log(taskJSON)

    var xhr = http.xhrRequest({
      method: 'POST',
      url: backendUrl + tasksResource,
      async: true,
      data: taskJSON,
      callback: function (data) {console.log(data); }
    }).open()
      .send()
  }

  function getAllTasks () {
    var xhr = http.xhrRequest({
      method: 'GET',
      url: backendUrl + tasksResource,
      async: true,
      callback: function (data) { renderTasks(JSON.parse(data)) }
    }).open()
      .send()
  }

  function deleteTask (taskId) {
    var xhr = http.xhrRequest({
      method: 'DELETE',
      url: backendUrl + tasksResource + '/' + taskId,
      dataType: 'text/plain',
      asyc: true,
      callback: function (data) { console.log(data); }
    }).open()
      .send()

    console.log(xhr.getConfiguration())
  }
  // CANDIDATAOS A SAIR DO MODULO
  // Prototype GOODIE.
  // Considerar mover para modulo huehuee
  function runPrototypes () {
    Array.prototype.filterById = function (id) {
      var newArray = [];
      newArray = this.filter(function (obj) { if (obj.id != id) return obj })
      return newArray;
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
