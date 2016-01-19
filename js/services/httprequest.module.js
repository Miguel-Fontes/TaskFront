'use strict'
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
    var xhr,
      srv = this,
      srvConfig = {}

    srv.isInitialized = false

    initialize(config)

    // API
    srv.send = send
    srv.open = open
    srv.getConfiguration = getConfiguration
    srv.getXhr = getXhr
    srv.get = get
    srv.post = post
    srv.put = put
    srv.remove = remove

    function initialize (config) {
      config = config || {}

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
      return srv
    }

    function get (url, callback) {
      // code
      initialize({
        method: 'GET',
        url: url,
        async: true,
        callback: callback || undefined
      }).open()
        .send()
    }

    function post (url, data, callback) {
      // code
      initialize({
        method: 'POST',
        url: url,
        async: true,
        data: data,
        callback: callback || undefined
      }).open()
        .send()
    }

    function put (url, data, callback) {
      // code
      initialize({
        method: 'PUT',
        url: url,
        async: true,
        data: data,
        callback: callback || undefined
      }).open()
        .send()
    }

    function remove (url, callback) {
      // code
      initialize({
        method: 'DELETE',
        url: url,
        async: true,
        callback: callback || undefined
      }).open()
        .send()
    }

    function getXhr () {
      return xhr
    }

    function getConfiguration () {
      return srvConfig
    }

    function open (method, url, async) {
      if (srv.isInitialized) {
          // faltam configurações aqui como, por exemplo, datatype
        xhr.open(srvConfig.method || method, srvConfig.url || url, srvConfig.async || async)
        return srv
      } else {
        return 'Favor inicializar o módulo via initialize()'
      }
    }

    function send (data) {
      if (srv.isInitialized) {
        xhr.send(srvConfig.data || data || '')
        return srv
      } else {
        return 'Favor inicializar o módulo via initialize()'
      }
    }

    function defaultCallback (data) {
      return data
    }
  }

})()
