/* global async */
/* global method */
var HTTPREQUEST = (function HttpRequest () {
    
  // API
  return {
    xhrRequest: xhrRequestBuilder
  }
 
  // BUILDERS
  function xhrRequestBuilder (config) {
    return new XhrRequest(config)
  }
  
  // REQUEST OBJECTS
  function XhrRequest (config) {
    var xhr, srv = this, srvConfig = {}

    this.isInitialized = false,

    srvConfig = {}

    initialize()

    // API
    this.send = send
    this.open = open

    function initialize () {
      srvConfig.method = config.method || undefined
      srvConfig.url = config.url || undefined
      srvConfig.headers = config.headers || undefined
      srvConfig.async = config.async || true
      srvConfig.dataType = config.dataType || undefined
      srvConfig.data = config.data || undefined
      srvConfig.callback = config.callback || defaultCallback

      xhr = new XMLHttpRequest()

      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          srvConfig.callback(xhr.responseText)
        }
      }

      srv.isInitialized = true
      return srv;
    }

    function getXhr () {
      return xhr
    }

    function getConfiguration () {
      return srvConfig
    }

    function open (method, url, async) {
      if (srv.isInitialized) {
        xhr.open(srvConfig.method || method, srvConfig.url || url, srvConfig.async || async)
        return srv;
      } else {
        return 'Favor inicializar o módulo via initialize()'
      }
    }

    function send (data) {
      if (srv.isInitialized) {
        xhr.send(srvConfig.data || data || '')
        return srv;
      } else {
        return 'Favor inicializar o módulo via initialize()'
      }
    }

    function defaultCallback (data) {
      console.log(data)
    }
  }

})()
