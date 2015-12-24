var TODO = (function () {
  var taskInputElement,
    addButtonElement,
    taskListElement,
    taskInputId = 'taskInput',
    addButtonId = 'addButton',
    taskListId = 'taskList',
    tasks = [],
    id = 0;

  activate()

  return {
    addTask: addTask,
    markDone: markDone,
    checkInput: checkInput,
    getTasks: tasks
  }

  function activate () {
    taskInputElement = document.getElementById(taskInputId)
    addButtonElement = document.getElementById(addButtonId)
    taskListElement = document.getElementById(taskListId)
  }

  function markDone (event) {
    toggleClass(event.target.parentElement, 'done')
  }

  function addClass (element, cssClass) {
    if (!element.classList.contains(cssClass)) {
      element.classList.add(cssClass)
    }
  }

  function removeClass (element, cssClass) {
    if (element.classList.contains(cssClass)) {
      element.classList.remove(cssClass)
    }
  }

  function toggleClass (element, cssClass) {
    if (element.classList.contains(cssClass)) {
      removeClass(element, cssClass)
    } else {
      addClass(element, cssClass)
    }
  }

  function addTask () {
    var task = taskInputElement.value
    if (task != undefined && task.trim() != '' && task != '') {
      taskInputElement.value = ''
      tasks.push(new Task(task, false))
      taskListElement.innerHTML = taskListElement.innerHTML.concat('<li><input type="checkbox" id='+ id + ' onclick="TODO.markDone(event)">' + task + '</li>')
      id++;
      removeClass(taskInputElement, 'error')
    } else {
      addClass(taskInputElement, 'error')
    }
  }

  function checkInput (e) {
    if (e.keyCode == 13) {
      addTask()
    }
  }

  function Task (description, status) {
    this.description = description
    this.done = status
  }

})()
