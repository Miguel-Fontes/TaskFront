// Prototypes ----------------------------------------------
String.prototype.contains = function (char) {
  var value = this.toString()
  // log(value, char, '- value.search = ' , value.match(char), ' - Truality: ', value.match(char) != undefined)
  return value.match(char) != undefined ? true : false
}
// ---------------------------------------------------------

var http = require('http'),
  hostname = '127.0.0.1',
  port = 8080

var server = http.createServer()

server.on('request', handler)

function log () {
  // IMPLEMENTAR TRATAMENTO PARA OBJETOS == {}
  var logMessage = new Date() + ': '

  for (var i = 0, j = log.arguments.length; i < j; i++) {
    logMessage += (log.arguments[i] == undefined ? 'undefined' : log.arguments[i].toString()) + ' '
  }
  console.log(logMessage)
}

function validatePattern (urlPattern, requestUrl) {
  var params = [],
    paramMp = {},
    urlSplit = '',
    requestUrlSplit = '',
    parsedUrl = requestUrl

  validateArguments()

  // TODO: validar se url é string. Caso negativo, retornar erro.
  urlSplit = urlPattern.split('/')
  requestUrlSplit = requestUrl.split('/')

  // Validação do tamanho dos Arrays. Se não for igual significa que a URL não se encaixa no Pattern.
  // Vou retornar ''. Isto fará com que a URL nunca se encaixe no Pattern.
  if (urlSplit.length != requestUrlSplit.length) {
    log('O tamanho dos arrays é diferente. Não é deste pattern: ', urlSplit.length, '!=', requestUrlSplit.length)
    // TODO: Retornar daqui. Comofas
    return false
  }

  // Crio um objeto javascript com os parâmetros e a posição do bloco para efetuar o
  // Matching de valores posteriormente.
  urlSplit.forEach(paramMap)

  log('URL para Matching', parsedUrl)

  return parsedUrl == requestUrl

  function paramMap (value, index, array) {
    if (value.contains(':')) {
      paramMp[value] = index
      parsedUrl = parsedUrl.replace(value, requestUrlSplit[index])
    }
  }

  function validateArguments () {
    // if (typeof (urlSplit) != string) { return false }
    // if (typeof (urlSplit) != string) { return false }
  }
}

function Routes () {
  var matched = false,
    srv = this; // Bind do this do serviço à variável. Good Practice.

  // API
  srv.when = when

  // Funcionalidades
  function when (method, url, request, callback) {
    // Primeiro verifica o método que é o mais rápido, na boa
    if (validMethod() && !matched) {
      if (validatePattern(url, request.url)) {
        callback()
        // Marco como true para que não sejam avaliados mais padroes
        matched = true
      }
    }

    function validMethod () {
      return method == request.method ? true : false
    }

    // Chainning Cleverness
    return srv
  }
}

function handler (request, response) {
  log('------------------------------------------------------------------------------------------------')
  log('Request: METHOD:', request.method, ' - URL:', request.url)

  var tasksCtrl = new TaskController(request, response), routes = new Routes()

  // CREATE - METHOD: POST - COM DATA
  // UPDATE - METHOD: PUT  - COM DATA
  // REMOVE - METHOD: DELETE - SO ID
  // GET    - METHOD: GET - SO ID
  routes
    .when('POST', '/tasks', request, tasksCtrl.save)
    .when('PUT', '/tasks/:id', request, tasksCtrl.update)
    .when('DELETE', '/tasks/:id', request, tasksCtrl.remove)
    .when('GET', '/tasks/:id', request, tasksCtrl.get)
    .when('GET', '/tasks', request, tasksCtrl.getAll)
    .when('GET', '/', request, tasksCtrl.forbidden)
 
  
  response.end()
  log('------------------------------------------------------------------------------------------------')
}

server.listen(port, hostname, function () {
  console.log('Server running at http://' + hostname + ':' + port)
})

function TaskController (request, response) {
   
  var ctrl = this;
  
  // Isso vai pro activate
  response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    
  // Atributos
  ctrl.request = request
  ctrl.response = response
  ctrl.tarefas = [
    {
      id: '001',
      description: 'Tarefa 1',
      done: false
    },
    {
      id: '002',
      description: 'Tarefa 2',
      done: false
    },
    {
      id: '003',
      description: 'Tarefa 3',
      done: false
    },
    {
      id: '004',
      description: 'Tarefa 4',
      done: false
    },
    {
      id: '005',
      description: 'Tarefa 5',
      done: false
    },
    {
      id: '006',
      description: 'Tarefa 6',
      done: false
    },
  ]
  
  // API
  ctrl.save = save,
  ctrl.update = update,
  ctrl.remove = remove,
  ctrl.get = get,
  ctrl.getAll = query,
  ctrl.forbidden = forbidden

  // Funcionalidades

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
    console.log(task)
    console.log(JSON.parse(task))
  }

  function update () {
    log('Update tarefa')
    response.write('Atualizar tarefa')
  }

  function remove () {
    log('Remove tarefa')
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
