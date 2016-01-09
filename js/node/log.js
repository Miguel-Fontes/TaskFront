var LOG = (function logModule () {
  return {
    log: log
  }

  function log () {
    // IMPLEMENTAR TRATAMENTO PARA OBJETOS == {}
    var logMessage = new Date() + ': '

    for (var i = 0, j = log.arguments.length; i < j; i++) {
      logMessage += (log.arguments[i] == undefined ? 'undefined' : log.arguments[i].toString()) + ' '
    }
    console.log(logMessage)
  }
})()

module.exports = LOG
