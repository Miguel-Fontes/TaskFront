var log = require('log').log

var ROUTER = (function routerBuilder (log) {
  // API Factory
  return {
    buildRouter: buildRouter
  }

  function buildRouter () {
    return new Router()
  }

  // Class Router
  function Router () {
    var matched = false,
      srv = this; // Bind do this do serviço à variável. Good Practice.

    // API
    srv.when = when
    srv.end = end
    // Funcionalidades
    function when (method, pattern, request, callback) {
      // Primeiro verifica o método que é o mais rápido, na boa
      if (validMethod() && !matched) {
        if (validatePattern(pattern, request)) {
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

    function end () {
      // Nesta função, resetar a condição do router.
      matched = false
    }

    function parseUrl (url) {
      // Função com acesso ao request
      // Função que 'saiba' quais são os parâmetros da URL e quais são os valores dos parâmetros.
      // Para cada parâmetro da URL, adicionar um atributo no Request.

    }

    function validatePattern (urlPattern, request) {
      var urlSplit = '',
        requestUrlSplit = '',
        parsedUrl = request.url,
        requestUrl = request.url;
        
        request.params = {};

      validateArguments()

      log('Validação do Pattern', urlPattern, 'com a URL do request', requestUrl)

      // TODO: validar se url é string. Caso negativo, retornar erro.
      urlSplit = urlPattern.split('/')
      requestUrlSplit = requestUrl.split('/')

      // Validação do tamanho dos Arrays. Se não for igual significa que a URL não se encaixa no Pattern.
      // Vou retornar ''. Isto fará com que a URL nunca se encaixe no Pattern.
      if (urlSplit.length != requestUrlSplit.length) {
        log('O tamanho dos arrays é diferente. Não é deste pattern (', urlPattern , '): ', urlSplit.length, '!=', requestUrlSplit.length)
        return false
      }

      // Crio um objeto javascript com os parâmetros e a posição do bloco para efetuar o
      // Matching de valores posteriormente.
      urlSplit.forEach(buildParams)

      log('URL para Matching', parsedUrl)

      return parsedUrl == requestUrl

      function buildParams (value, index, array) {
        if (value.contains(':')) {
          // paramMp[value] = index
          parsedUrl = parsedUrl.replace(value, requestUrlSplit[index])
          request.params[value.replace(':', '')] = requestUrlSplit[index];
        }
      }

      function validateArguments () {
        // if (typeof (urlSplit) != string) { return false }
        // if (typeof (urlSplit) != string) { return false }
      }
    }
  }
})(log)

module.exports = ROUTER
