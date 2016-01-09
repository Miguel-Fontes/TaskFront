var TODO = (function (css, http) {
    
  return {
      build: TodoBuilder
  }
    
  // BUILDER
  function TodoBuilder () {
    return new TodoService(css, http)
  }

  // TODO SERVICE
  function TodoService (css, http) {
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
    md.addTask = addTask,
    md.toggleDone = toggleDone,
    md.checkInput = checkInput,
    md.removeTask = removeTask

    // INICIALIZACAO
    activate()

    function activate () {
      // Busco os handlers para facilitar o trabalho nos segmentos posteriores.  
      taskInputElement = document.getElementById(taskInputId)
      addButtonElement = document.getElementById(addButtonId)
      taskListElement = document.getElementById(taskListId)

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

      updateTask(updatedTask)

      function markTaskDone (task, index, array) {
        // Vai sempre passar por todas as tarefas.
        // Provavelmente esta não é a melhor forma de fazer isto, 
        // mas estamos lidando com uma única lista, vai ter que servir por enquanto.

        task.done = task.id == taskId ? !task.done : task.done
      }
    }

    function addTask () {
      var task = taskInputElement.value, taskObject
      if (task != undefined && task.trim() != '' && task != '') {
        taskInputElement.value = ''
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

    function removeTask (e) {
      // TODO: Dá pra melhorar essas parentadaNode aqui?
      var taskId = e.target.parentNode.parentNode.id

      tasks = tasks.filterById(taskId)

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
        tasks.push(new Task(value.id, value.description, value.done))
        taskListElement.innerHTML = taskListElement.innerHTML.concat('<li id=' + value.id + '>' +
          '<input type="checkbox" onclick="app.todo.toggleDone(event)"' +
          (value.done ? 'checked' : '') +
          '>' +
          '<span id="descricao">' + value.description +
          '</span>' +
          '<span id="controles">' +
          '<i class="fa fa-pencil-square-o"></i>' +
          '<i class="fa fa-trash" onclick="app.todo.removeTask(event)"></i>' +
          '</span></li>')

        // Se a tarefa já estiver concluída, adiciono a classe 'done'.
        if (value.done) { css.toggleClass(document.getElementById(value.id), 'done') }

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
    // TODO: Melhorar essas interfaces e criar short calls baseado nods métodos 
    // http.POST(backendUrl + tasksResource, taskJSON), 
    // http.query(backendUrl + tasksResource)
    function syncTask (task) {
      var taskJSON = JSON.stringify(task)

      http.xhrRequest({
        method: 'POST',
        url: backendUrl + tasksResource,
        async: true,
        data: taskJSON,
        callback: function (data) {console.log(data); }
      }).open()
        .send()
    }

    function getAllTasks (callback) {
      http.xhrRequest({
        method: 'GET',
        url: backendUrl + tasksResource,
        async: true,
        callback: callback
      }).open()
        .send()
    }

    function deleteTask (taskId) {
      http.xhrRequest({
        method: 'DELETE',
        url: backendUrl + tasksResource + '/' + taskId,
        dataType: 'text/plain',
        asyc: true,
        callback: function (data) { console.log(data); }
      }).open()
        .send()
    }

    function updateTask (task) {
      var taskJSON = JSON.stringify(task)

      http.xhrRequest({
        method: 'PUT',
        url: backendUrl + tasksResource + '/' + task.id,
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
  }
})(CSSTOOLS, HTTPREQUEST)
