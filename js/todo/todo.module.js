'use strict'
var TODO = (function () {
  return {
    build: TodoBuilder
  }

  // BUILDER
  function TodoBuilder (css, http, dom, utils) {
    return new TodoService(css, http, dom, utils)
  }

  // TODO SERVICE
  function TodoService (css, http, dom, utils) {
    var md = this,
      taskInputElement,
      addButtonElement,
      taskListElement,
      taskInputId = 'taskInput',
      addButtonId = 'addButton',
      taskListId = 'taskList',
      tasks = [],
      currentId = 0,
      backendUrl = 'http://localhost:8080',
      tasksResource = '/tasks'

    // API
    md.addTask = addTask
    md.toggleDone = toggleDone
    md.checkInput = checkInput
    md.removeTask = removeTask
    md.editTask = editTask
    md.moveUp = moveUp
    md.moveDown = moveDown

    // INICIALIZACAO
    activate()

    function activate () {
      // Busco os handlers para facilitar o trabalho nos segmentos posteriores.  
      taskInputElement = dom.byId(taskInputId)
      addButtonElement = dom.byId(addButtonId)
      taskListElement = dom.byId(taskListId)

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
      tasks.forEach(markTaskDone)

      updatedTask = tasks.filter(function (obj) { if (obj.id == taskId) { return obj }})[0]

      updateTask(updatedTask, taskId)

      function markTaskDone (task, index, array) {
        // Vai sempre passar por todas as tarefas.
        // Provavelmente esta não é a melhor forma de fazer isto, 
        // mas estamos lidando com uma única lista, vai ter que servir por enquanto.

        task.done = task.id == taskId ? !task.done : task.done
      }
    }

    function addTask () {
      // TODO: QUE DOR LER ISSO AQUI. MELHORAR O CODIGO PLZ
      var task = taskInputElement.value, taskObject
      if (task != undefined && task.trim() != '' && task != '') {
        dom.updateAttr(taskInputElement, 'value', '')
        taskObject = new Task(currentId, task, false)
        renderTasks(taskObject)
        tasks.push(taskObject)
        // TODO: Quem tem que gerar ID é o BackEnd. Verificar o que fazer. 
        currentId++
        syncTask(taskObject)
        css.removeClass(taskInputElement, 'error')
      } else {
        css.addClass(taskInputElement, 'error')
      }
    }

    function editTask (e) {
      let eventElement = dom.getElementFromEvent(e)

      let liTaskElement = dom.findParentElement(eventElement, 'li')
      let taskDescription = dom.findChildById(liTaskElement, 'descricao')

      dom.updateAttr(taskInputElement, 'value', taskDescription.innerHTML)

      removeTask(eventElement)

    }

    function removeTask (e) {
      let eventElement = dom.getElementFromEvent(e)

      var liTaskElement = dom.findParentElement(eventElement, 'li')
      var taskId = liTaskElement.id

      tasks = tasks.filterById(taskId)

      deleteTask(taskId)

      dom.removeNode(liTaskElement)

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

    function getTaskElement (e) {
      return dom.findParentElement(dom.getElementFromEvent(e), 'li')
    }

    function moveUp (e) {
      dom.moveBefore(taskListElement, getTaskElement(e))
    }
    function moveDown (e) {
      dom.moveAfter(taskListElement, getTaskElement(e))
    }

    function renderTasks (tasksObj) {
      if (utils.isType(tasksObj, 'Array')) {
        tasksObj.forEach(render)
      } else {
        render(tasksObj)
      }

      function render (value, index, array) {
        tasks.push(new Task(value.id, value.description, value.done))

        var taskNodeContent = (
        '<input type="checkbox" onclick="app.todo.toggleDone(event)"' +
          (value.done ? 'checked' : '') +
          '>' +
          '<span id="descricao">' + value.description +
          '</span>' +
          '<span id="controles">' +
          '<i class="fa fa-chevron-up" onclick="app.todo.moveUp(event)"></i>' +
          '<i class="fa fa-chevron-down" onclick="app.todo.moveDown(event)"></i>' +
          '<i class="fa fa-pencil-square-o" onclick="app.todo.editTask(event)"></i>' +
          '<i class="fa fa-trash" onclick="app.todo.removeTask(event)"></i>' +
          '</span>')

        var taskNode = dom.createNode('li', taskNodeContent)

        dom.updateAttr(taskNode, 'id', value.id)

        dom.appendNode(taskListElement, taskNode)

        // Se a tarefa já estiver concluída, adiciono a classe 'done'.
        if (value.done) { css.toggleClass(dom.byId(value.id), 'done') }

        // Busco o maior ID dentre as tarefas existentes.
        // Imagino que esta solução deva funcionar agora mas em um outro cenário
        // pode ser que fique um tanto problemático.
        // TODO: Podemos ter um call para o servidor que retorne o próximo ID?
        currentId = value.id > currentId ? value.id + 1 : currentId
      }
    }

    // FUNÇÕES PARA CONEXÃO COM BACKEND
    // Dá pra virar um módulo baseado nas interfaces REST.
    // Assim que terminar, refatorar para Websockets
    function syncTask (task) {
      let taskJSON = JSON.stringify(task)
      http.xhrRequest().post((backendUrl + tasksResource), taskJSON)
    }

    function getAllTasks (callback) {
      http.xhrRequest().get((backendUrl + tasksResource), callback)
    }

    function deleteTask (taskId) {
      http.xhrRequest().remove(backendUrl + tasksResource + '/' + taskId)
    }

    function updateTask (task, taskId) {
      let taskJSON = JSON.stringify(task)
      http.xhrRequest().put((backendUrl + tasksResource + '/' + taskId), taskJSON)
    }

    // TODO: CANDIDATOS A SAIR DO MODULO
    // Prototype GOODIE.
    // Considerar mover para modulo huehuee
    function runPrototypes () {
      Array.prototype.filterById = function (id) {
        var newArray = []
        newArray = this.filter(function (obj) { if (obj.id != id) return obj })
        return newArray
      }
    }

  }
})()
