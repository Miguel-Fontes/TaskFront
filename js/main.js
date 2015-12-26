var TODO = (function (css, http) {
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

    getAllTasks()

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
      tasks.push(taskObject)
      taskListElement.innerHTML = taskListElement.innerHTML.concat('<li><input type="checkbox" id=' + id + ' onclick="TODO.toggleDone(event)">' + task + '</li>')
      id++
      syncTask(taskObject)
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

  function renderTasks (tasks) {
    typeof (tasks) == 'object' ? tasks.forEach(renderTask) : renderTask(tasks)

    function renderTask (value, index, array) {
      tasks.push(new Task(value.id, value.description, value.status))
      taskListElement.innerHTML = taskListElement.innerHTML.concat('<li><input type="checkbox" id=' + value.id + ' onclick="TODO.toggleDone(event)">' + value.description + '</li>')
    }
  }

  function syncTask (task) {
    // TODO - CORRIGIR ESSA FUNCAO. TA ERRADO!
    var taskJSON = JSON.stringify(task)
    console.log(taskJSON)

    var xhr = http.xhrRequest({
      method: 'POST',
      url: 'http://localhost:8080/tasks',
      async: true,
      data: taskJSON,
      callback: function (data) {console.log(data); }
    }).open()
      .send()
  }

  function getAllTasks () {
    var xhr = http.xhrRequest({
      method: 'GET',
      url: 'http://localhost:8080/tasks',
      async: true,
      callback: function (data) { renderTasks(JSON.parse(data)) }
    }).open()
      .send()
  }

})(CSSTOOLS, HTTPREQUEST)
