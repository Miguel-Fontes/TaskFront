var TODO = (function (css) {
  var taskInputElement,
    addButtonElement,
    taskListElement,
    taskInputId = 'taskInput',
    addButtonId = 'addButton',
    taskListId = 'taskList',
    tasks = [],
    id = 0

  activate()

  return {
    addTask: addTask,
    toggleDone: toggleDone,
    checkInput: checkInput,
    getTasks: tasks,
    syncTask: syncTask,
    getAllTasks: getAllTasks
  }

  function activate () {
    // Busco os handlers para facilitar o trabalho nos segmentos posteriores.  
    taskInputElement = document.getElementById(taskInputId)
    addButtonElement = document.getElementById(addButtonId)
    taskListElement = document.getElementById(taskListId)
  // Adicionar opções de configuração do módulo.
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
    var task = taskInputElement.value
    if (task != undefined && task.trim() != '' && task != '') {
      taskInputElement.value = ''
      tasks.push(new Task(id, task, false))
      taskListElement.innerHTML = taskListElement.innerHTML.concat('<li><input type="checkbox" id=' + id + ' onclick="TODO.toggleDone(event)">' + task + '</li>')
      id++
      css.removeClass(taskInputElement, 'error')
    } else {
      css.addClass(taskInputElement, 'error')
    }
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

  function RequestHttp (config) {
    var srv = this

    srv.xhr = new XMLHttpRequest()

    srv.xhr.onreadystatechange = function () {
      if (srv.xhr.readyState == XMLHttpRequest.DONE) {
        srv.callback(srv.xhr.responseText)
      }
    }

    srv.method = config.method || undefined
    srv.url = config.url || undefined
    srv.headers = config.headers || undefined
    srv.async = config.async || true
    srv.dataType = config.dataType || undefined
    srv.data = config.data || undefined
    srv.callback = config.callback || function (data) { console.log(data); }

    srv.send = send
    srv.open = open

    function open (method, url, async) {
      srv.xhr.open(srv.method || method, srv.url || url, srv.async || async)
    }

    function send (data) {
      srv.xhr.send(srv.data || data || '')
    }

  }

  function syncTask () {
    var taskJSON = JSON.stringify(tasks[0])

    var xhr = new RequestHttp({
      method: 'POST',
      url: 'http://localhost:8080/tasks',
      async: true,
      data: taskJSON,
      callback: function (data) {console.log(data); }
    })

    xhr.open()
    xhr.send()

  }

  function getAllTasks () {
    var xhr = new RequestHttp({
      method: 'GET',
      url: 'http://localhost:8080/tasks',
      async: true,
      callback: function (data) {console.log(data) }
    })

    xhr.open()
    xhr.send()

  }

})(CSSTOOLS)
