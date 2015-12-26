// Prototypes ----------------------------------------------
String.prototype.contains = function (char) {
  var value = this.toString()
  return value.match(char) != undefined ? true : false
}
// ---------------------------------------------------------

var http = require('http'),
  hostname = '127.0.0.1',
  port = 8080

var router = require('router').buildRouter()

var log = require('log').log

var tasksCtrl = new TaskController()

var server = http.createServer()

server.on('request', handler)

function handler (request, response) {
  log('------------------------------------------------------------------------------------------------')
  log('Request: METHOD:', request.method, ' - URL:', request.url)
  tasksCtrl.setTransaction(request, response)

  router
    .when('POST', '/tasks', request, tasksCtrl.save)
    .when('PUT', '/tasks/:id', request, tasksCtrl.update)
    .when('DELETE', '/tasks/:id', request, tasksCtrl.remove)
    .when('GET', '/tasks/:id', request, tasksCtrl.get)
    .when('GET', '/tasks', request, tasksCtrl.getAll)
    .when('GET', '/', request, tasksCtrl.forbidden)
    .end()

  response.end()
  log('------------------------------------------------------------------------------------------------')
}

server.listen(port, hostname, function () {
  console.log('Server running at http://' + hostname + ':' + port)
})

// TODO - Extrair esse controller para outro módulo.
function TaskController () {
  var ctrl = this, request, response

  // Isso vai pro activate

  // Atributos
  ctrl.request = request
  ctrl.response = response
  ctrl.tarefas = []

  // API
  ctrl.save = save,
  ctrl.update = update,
  ctrl.remove = remove,
  ctrl.get = get,
  ctrl.getAll = query,
  ctrl.forbidden = forbidden
  ctrl.setTransaction = setTransaction

  // Funcionalidades
  function setTransaction (req, res) {
    request = req
    response = res
    activate()
  }

  function activate () {
    // Access-Control-Allow-Origin -> Este header é usado para segurança de transação.
    //  Ele indica quais domínios poderão receber o retorno desta transação, tentando
    //  evitar ataques XSS. O correto é que esteja configurado com o domínio permitido
    //  a Acessar as informações retornadas. O wildcard * significa que qualquer domínio
    //  poderá ter acesso aos dados.

    // Access-Control-Allow-Methods -> Significa quais são os métodos HTTP aceitos pelo
    //  serviço. Qualquer transação que não seja GET ou POST faz uma requisição do tipo
    //  OPTIONS para checar quais são os métodos permitidos descritos nesse cabeçalho.
    //  Se não for retornada uma lista de métodos no HEADER da mensagem, a requisição
    //  é abortada.  

    // Isso aqui tem que ser refatorado. Nem sempre o código de retorno será 200, já é?
    response.writeHead(200, {'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, PUT, GET, POST'})

    Array.prototype.filterById = function (id) {
      var newArray
      newArray = this.filter(function (obj) { if (obj.id != id) return obj })
      return newArray
    }
  }

  function readRequest (dataAction) {
    var body = []
    request.on('data', function (chunk) {
      body.push(chunk)
    }).on('end', function () {
      body = Buffer.concat(body).toString()
      dataAction(body)
    })
  }

  function save () {
    log('Salvando tarefa')
    readRequest(saveTask)
    response.write('Salvar tarefa')
  }

  function saveTask (task) {
    // TA CHEGANO MALLOC
    ctrl.tarefas.push(JSON.parse(task))
    console.log(ctrl.tarefas)
  }

  function update () {
    log('Update tarefa')
    readRequest(updateTask)
    response.write('Atualizar tarefa')
  }

  function updateTask (task) {
    // Atualiza tb MALLOC
    // Para atualizar a tarefa eu vou remover a tarefa 
    // existente e adicionar a nova versão
    var updatedTask = JSON.parse(task)
    ctrl.tarefas = ctrl.tarefas.filterById(request.params.id)
    ctrl.tarefas.push(updatedTask)
    console.log(ctrl.tarefas)
  }

  function remove () {
    log('Remover tarefa ID ', request.params.id)
    ctrl.tarefas = ctrl.tarefas.filterById(request.params.id)
    response.write('Remover tarefa')
  }

  function get () {
    log('Buscando tarefa')
    response.write('Buscar tarefa')
  }

  function query () {
    log('Buscando todas as tarefas')
    var json = JSON.stringify(ctrl.tarefas)
    response.write(json)
  }

  function forbidden () {
    log('Request inválido')
    response.write('Request inválido')
  }
}

// VAI PRO MÓDULO ORM FUTURAMENTE
function TaskModel (id, descricao, status) {
  // Dados mo Modelo
  this.id
  this.descricao = descricao
  this.status = status

  this.toString = toString

  // API
  this.save = save
  this.update = update
  this.remove = remove
  this.get = get

  // Funcionalidades
  function toString () {
    return this.id + ' - ' + this.descricao + '. Status: ' + this.status ? 'completa' : 'pendente'
  }

  function save () {
    log('Salvando tarefa')
  }

  function update () {
    log('Update tarefa')
  }

  function remove () {
    log('Remove tarefa')
  }

  function get () {
    log('Buscando tarefa')
  }
}
